module.exports = {
  apps: [
    {
      name: "date-randomizer-api",
      script: "server/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
        ALLOWED_ORIGINS:
          "https://date-randomizer.com,https://www.date-randomizer.com",
        GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
      },
      watch: false,
      instances: 1,
      autorestart: true,
      max_memory_restart: "1G",
    },
  ],
};
