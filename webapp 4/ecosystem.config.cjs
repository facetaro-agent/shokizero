module.exports = {
  apps: [
    {
      name: 'shokizero-lp',
      script: 'npx',
      args: 'serve . -l 3000 --no-clipboard',
      cwd: '/home/user/webapp',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    }
  ]
}
