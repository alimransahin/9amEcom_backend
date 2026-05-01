const {
    NODE_ENV,
    PORT,
    DB_URL,
    JWT_ACCESS_SECRET,
    JWT_ACCESS_EXPIRES_IN,
    JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRES_IN,

    BACKEND_URL_DEVELOPMENT,
    FRONTEND_URL_DEVELOPMENT,

    BASE_URL_PRODUCTION

} = process.env;

export default {

    base_url: NODE_ENV === "production" ? BASE_URL_PRODUCTION : BACKEND_URL_DEVELOPMENT,
    frontend_url: NODE_ENV === "production" ? BASE_URL_PRODUCTION : FRONTEND_URL_DEVELOPMENT,

    node_env: NODE_ENV || "development",
    database_url: DB_URL,
    port: Number(PORT) || 5000,

    jwt_access_secret: JWT_ACCESS_SECRET!,
    jwt_refresh_secret: JWT_REFRESH_SECRET!,

    // 🔥 FIX: force correct type
    jwt_access_expires_in: JWT_ACCESS_EXPIRES_IN as unknown as number | undefined,
    jwt_refresh_expires_in: JWT_REFRESH_EXPIRES_IN as unknown as number | undefined
};