module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || 'postgres://postgres@localhost/newsfeed',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgres://postgres@localhost/newsfeed-test',
    API_URL: process.env.API_URL || 'https://content.guardianapis.com/search?api-key=10b46517-2476-4726-8663-30386d3846c0',
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'https://newsfeed-ecru.vercel.app/'
}