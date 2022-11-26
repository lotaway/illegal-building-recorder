const webpack = require('webpack')
    , open = require("opn")
    , WebpackDevServer = require("webpack-dev-server")
    , HtmlWebpackPlugin = require("html-webpack-plugin")
    , host = require("../tools/getLocalIp")()   //  访问地址，指向当前内网ip地址
    , port = 3002   //  监听端口
    , devServer = `http://${host}:${port}`
;
let {baseConfig, pageConfigs} = require("./webpack.config");

baseConfig.mode = "development";
baseConfig.entry.app = [`webpack-dev-server/client?${devServer}/`];
baseConfig.devtool = "source-map";
baseConfig.devServer = {
    hot: true,
    inline: true,
    historyApiFallback: true,
    overlay: true
};

baseConfig.plugins.push(...pageConfigs.map(conf =>
    new HtmlWebpackPlugin({
        devServer,
        minify: {
            removeComments: true,
            collapseWhitespace: false
        },
        ...conf
    })))
;

console.log(`服务运行在：${devServer}`);

const webpackDevServer = new WebpackDevServer(webpack(baseConfig));

open(devServer);
webpackDevServer.listen(port);