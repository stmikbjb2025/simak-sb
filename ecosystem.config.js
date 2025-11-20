module.exports = {
	apps: [
		{
			name: 'simak-sb',
			script: 'npm',
			args: 'start',
			// Next.js biasanya berjalan di port 3000
			env: {
				PORT: 3000,
				NODE_ENV: 'production',
			},
		},
		{
			name: 'simak-scheduler-sb',
			script: 'npm',
			args: 'run scheduler',
			// Restart scheduler jika crash
			autorestart: true,
			watch: false,
		},
	],
};
