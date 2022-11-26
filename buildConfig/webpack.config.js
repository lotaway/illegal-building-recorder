var path = require('path')
    , MiniCssExtractPlugin = require("mini-css-extract-plugin") //  css文件提取
    , TransferWebpackPlugin = require('transfer-webpack-plugin') //  把指定文件夹下的文件复制到指定的目录
    , autoPreFixer = require("autoprefixer")    //  CSS浏览器兼容
    , VueLoaderPlugin = require("vue-loader/lib/plugin")
    , glob = require("glob")
    , buildFileFolder = "member"
    , buildPath = path.resolve(__dirname, `../../${buildFileFolder}`)
    , entries = glob.sync("./web/pages/**/*.{js,ts,tsx}")
    , templatePath = glob.sync('./web/template.html')  //  模板页面
    , configEntry = {}
    , configPlugins = []
    , pageConfigs = []
    , manifestName = ["manifest", "vendor", "common"]
;

entries.forEach(filePath => {
    let chunkName = path.parse(filePath).name;

    configEntry[chunkName] = filePath;
    pageConfigs.push({
        filename: chunkName + ".html",
        template: "html-withimg-loader!" + templatePath,
        inject: "body",
        chunks: [manifestName[0], `${manifestName[0]}.${chunkName}`, chunkName]
    });
});
configPlugins.push(new VueLoaderPlugin());  //  包含此插件后vue-loader和webpack才能正常运作
/*configPlugins.push(
    new MiniCssExtractPlugin({
        filename: './[name].css'
        , chunkFilename: './[contenthash:12].css'  // use contenthash *
    }));*/
configPlugins.push(
    new TransferWebpackPlugin([
        {
            from: 'public' //  定义要拷贝的源目录
            , to: `public`
        }
    ], path.resolve(__dirname, '../web/'))
);

module.exports = {
    pageConfigs,
    baseConfig: {
        entry: configEntry, // 项目的入口文件，webpack会从main.js开始，把所有依赖的js都加载打包
        plugins: configPlugins,
        output: {
            path: buildPath, // 项目的打包文件路径
            publicPath: `./`, // 通过devServer访问路径
            filename: '[name].js' // 打包后的文件名
            , chunkFilename: "[name]chunk.js"   //  （异步加载文件）生成的子路径和文件名
        },
        resolve: {
            extensions: [".js", ".vue", ".json", ".css", ".wxss", ".ts"],
            alias: {
                "vue$": "vue/dist/vue.esm.js"
            }
        },
        module: {
            rules: [
                {
                    test: /\.pug$/,
                    use: [{
                        loader: "pug-html-loader"
                    }]
                }
                , {
                    test: /\.vue$/,
                    use: [
                        {
                            loader: "vue-loader"/*,
                            options: {
                                loaders: {
                                    ts: "ts-loader",
                                    tsx: "babel-loader!ts-loader"
                                }
                            }*/
                        }
                    ]
                }
                , {
                    test: /\.(css|wxss)$/,
                    use: [
                        // MiniCssExtractPlugin.loader,
                        "vue-style-loader",
                        "css-loader",
                        {
                            loader: "postcss-loader",
                            options: {
                                plugins: loader => [autoPreFixer()]
                            }
                        }
                    ]
                }
                , {
                    test: /\.js$/,
                    use: [{
                        loader: "babel-loader"
                    }],
                    exclude: "/node_modules/"
                }
                , {
                    test: /\.tsx?$/,
                    loader: "ts-loader"
                    , options: {
                        // onlyCompileBundledFiles: true,
                        appendTsSuffixTo: /\.vue$/
                    },
                    exclude: "/node_modules/"
                }
                ,
                {
                    test: /\.(jpe?g|png|gif|svg|swf|ttf)$/,
                    use: [{
                        loader: "url-loader"/*,
                    options: {
                        name: "[name].[ext]",
                        outputPath: buildPath,
                        publicPath: `${buildFileFolder}/`
                    }*/
                    }]
                }
            ]
        }
    }
};