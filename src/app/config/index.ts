const {
    NODE_ENV,

    PORT,
    DB_URL
} = process.env;

export default {
    database_url: DB_URL,
    port: PORT || 5000,
}