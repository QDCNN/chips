module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
  },
  mini: {},
  h5: {
    devServer: {
      proxy: {
        '/api': {
          target: 'https://api-dev.oscac-sh.com',
          changeOrigin: true,
          // secure: false,
          pathRewrite: {
            '^/api': ''
          },
        }
      }
    }
  }
}
