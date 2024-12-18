const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    disableHostCheck: true
  },
  devServer: {
    proxy: 'https://chatbot-dpi-back.onrender.com'
  }
})
