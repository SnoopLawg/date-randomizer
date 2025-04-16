module.exports = {
  apps: [
    {
      name: "date-randomizer-api",
      script: "server/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
        ALLOWED_ORIGINS:
          "http://localhost:5173,http://localhost:5174,https://d13swv3yj9soxt.cloudfront.net",
        GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
        DB_USER: "postgres",
        DB_PASSWORD: "postgres",
        DB_NAME: "date_randomizer",
        DB_HOST: "date-randomizer-db.c2fqqeim0ol3.us-east-1.rds.amazonaws.com",
        DB_PORT: 5432,
        JWT_SECRET: "your-super-secret-jwt-key-change-this-in-production",
      },
      watch: false,
      instances: 1,
      autorestart: true,
      max_memory_restart: "1G",
    },
  ],
};
