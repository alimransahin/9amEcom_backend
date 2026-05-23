import type { Document, Model, Query as MongooseQuery } from 'mongoose';

export interface Query {
  _page?: string;
  _limit?: string;
  _sort?: string;
  _fields?: string;
  _search?: string;
  _filter?: Record<string, any>;
  _range?: Record<string, string | string[]>;
}

type ApiFeaturesResponse<T> = {
  mongooseQuery: MongooseQuery<T[], T>;
  total: number;
};

export const apiFeatures = async <T>(
  Model: Model<T>,
  query: Query
): Promise<ApiFeaturesResponse<T>> => {

  const page = +(query._page || 1);
  const limit = +(query._limit || 20);
  const skip = (page - 1) * limit;

  const sort = query._sort?.split(',').join(' ') || '-createdAt';
  const select = query._fields?.split(',').join(' ') || '-__v';

  // 🔍 Search
  let searchObj: Record<string, any> = {};
  if (query._search) {
    const [value, ...fields] = query._search.split(',');
    if (value && fields.length) {
      searchObj = {
        $or: fields.map(field => ({
          [field]: { $regex: value, $options: 'i' }
        }))
      };
    }
  }

  // 🎯 Filter
  const filterObj: Record<string, any> = {};

  if (query._filter) {
    for (const [key, value] of Object.entries(query._filter)) {

      // comma → $in
      if (typeof value === 'string' && value.includes(',')) {
        filterObj[key] = { $in: value.split(',').map(v => v.trim()) };
      } else {
        filterObj[key] = value;
      }
    }
  }

  // 📊 Range
  const rangeObj: Record<string, any> = {};

  if (query._range) {
    for (const [key, value] of Object.entries(query._range)) {
      const values = Array.isArray(value) ? value : [value];

      if (key === 'createdAt') {
        const start = values[0] ? new Date(values[0]) : null;
        const end = values[1] ? new Date(values[1]) : null;

        if (start && end) {
          rangeObj[key] = { $gte: start, $lte: end };
        } else if (start) {
          rangeObj[key] = { $gte: start };
        } else if (end) {
          rangeObj[key] = { $lte: end };
        }
      } else {
        const min = Number(values[0]);
        const max = Number(values[1]);

        if (!isNaN(min) && !isNaN(max)) {
          rangeObj[key] = { $gte: min, $lte: max };
        } else if (!isNaN(min)) {
          rangeObj[key] = { $gte: min };
        } else if (!isNaN(max)) {
          rangeObj[key] = { $lte: max };
        }
      }
    }
  }

  // 🔗 Final Filter
  const finalFilter = {
    ...searchObj,
    ...filterObj,
    ...rangeObj,
    isDeleted: { $ne: true }
  };

  const total = await Model.countDocuments(finalFilter);

  const mongooseQuery = Model.find(finalFilter)
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .select(select);

  return { mongooseQuery, total };
};