const express = require('express');
const {
  createProxyMiddleware
} = require('http-proxy-middleware');
const app = express();
const PORT = 4800;
app.use(express.static('dist'));
/**路径以/开头配置 */
const apiProxy = createProxyMiddleware('/**', {
  target: "http://localhost:3000",
  changeOrigin: true,
});
/**路径以 /api开头配置 */
// const apiProxy = createProxyMiddleware('/api/**', {
//   target: "http://localhost:3000",
//   changeOrigin: true,
//   pathRewrite: {
//     "^/api": ""
//   }
// });
app.use(apiProxy);
app.listen(PORT, function (err) {
  if (err) {
    console.log('err', err);
  } else {
    console.log('Listen at http://localhost:' + PORT);
  }
})
