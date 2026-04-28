const {
    NODE_ENV,

    PORT,
    DB_URL
} = process.env;

export default {
    node_env: NODE_ENV || "production",
    database_url: DB_URL,
    port: PORT || 5000,
}