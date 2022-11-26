const HtmlWebpackPlugin = require("html-webpack-plugin");
let {baseConfig, pageConfigs} = require("./webpack.config");

baseConfig.mode = "production";
baseConfig.plugins.push(...pageConfigs.map(conf =>
    new HtmlWebpackPlugin({
        minify: {
            removeComments: true,
            collapseWhitespace: false
        },
        ...conf
    })))
;

module.exports = baseConfig;