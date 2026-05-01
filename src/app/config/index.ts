const {
    NODE_ENV,
    PORT,
    DB_URL,
    JWT_ACCESS_SECRET,
    JWT_ACCESS_EXPIRES_IN,
    JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRES_IN
} = process.env;

export default {
    node_env: NODE_ENV || "development",
    database_url: DB_URL,
    port: Number(PORT) || 5000,

    jwt_access_secret: JWT_ACCESS_SECRET!,
    jwt_refresh_secret: JWT_REFRESH_SECRET!,

    // 🔥 FIX: force correct type
    jwt_access_expires_in: JWT_ACCESS_EXPIRES_IN as unknown as number | undefined,
    jwt_refresh_expires_in: JWT_REFRESH_EXPIRES_IN as unknown as number | undefined
};