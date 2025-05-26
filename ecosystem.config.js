module.exports = {
  apps: [
    {
      name: 'bestcoach-bot',
      script: 'bot/index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      },
      error_file: 'logs/bot-error.log',
      out_file: 'logs/bot-out.log',
      log_file: 'logs/bot-combined.log',
      time: true
    },
    {
      name: 'bestcoach-web',
      script: 'serve',
      env: {
        PM2_SERVE_PATH: './web/build',
        PM2_SERVE_PORT: 3001,
        PM2_SERVE_SPA: 'true',
        PM2_SERVE_HOMEPAGE: '/index.html'
      }
    }
  ]
};