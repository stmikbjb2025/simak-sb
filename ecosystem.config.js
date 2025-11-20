module.exports = {
  apps: [
    {
      name: 'simak-web',
      script: 'npm',
      args: 'start',
      // Next.js biasanya berjalan di port 3000
      env: {
        PORT: 3000,
        NODE_ENV: 'production',
      },
    },
    {
      name: 'simak-scheduler',
      script: 'npm',
      args: 'run scheduler',
      // Restart scheduler jika crash
      autorestart: true,
      watch: false,
    },
  ],
};