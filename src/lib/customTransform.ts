import config from "../app/config";

export const customTransform = (
    ret: Record<string, any>,
    images: string[]
) => {
    ret.id = ret._id;

    delete ret.__v;

    const processObject = (obj: any) => {
        if (!obj || typeof obj !== "object") return;

        images.forEach((field) => {
            // Single image
            if (
                typeof obj[field] === "string" &&
                obj[field] &&
                !obj[field].startsWith("http")
            ) {
                obj[field] = `${config.base_url}${obj[field]}`;
            }

            // Array of images
            if (Array.isArray(obj[field])) {
                obj[field] = obj[field].map((item: string) => {
                    if (item && !item.startsWith("http")) {
                        return `${config.base_url}${item}`;
                    }

                    return item;
                });
            }
        });

        // Recursive processing
        for (const key in obj) {
            if (typeof obj[key] === "object" && obj[key] !== null) {
                processObject(obj[key]);
            }
        }
    };

    processObject(ret);
};