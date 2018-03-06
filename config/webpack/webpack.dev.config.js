const webpack = require('webpack');
const glob = require('glob');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 需要屏蔽的入口key
const forbidEntryKeys = [
    // 'home/index',
    // 'rzrq/wtmm/wtmm',
    // 'ptjy/index'
];

// 获取所有入口文件
const getEntry = function(globPath) {
    var entries = {
        // 'home/index': [
        //     'react-hot-loader/patch',
        //     'webpack-hot-middleware/client',
        //     './src/home/index.jsx'
        // ],
        // 'ptjy/index': [
        //     'react-hot-loader/patch',
        //     'webpack-hot-middleware/client',
        //     './src/ptjy/index.jsx'
        // ],
        // 'rzrq/wtmm/wtmm': [
        //     'react-hot-loader/patch',
        //     'webpack-hot-middleware/client',
        //     './src/rzrq/wtmm/wtmm.jsx'
        // ],
    };
    glob.sync(globPath).forEach(function(entry) {
        if (entry.indexOf('component') === -1) { // 过滤component文件夹下的jsx文件
            const pathname = entry.split('/').splice(2).join('/').split('.')[0];
            entries[pathname] = ['react-hot-loader/patch', 'webpack-hot-middleware/client', ...[entry]]; // 动态生成entrys
        }
    });
    return entries;
};

// 去除entries某些key
const deleteEntryKey = function(entries) {
    for (var key in entries) {
        if (forbidEntryKeys.indexOf(key)>-1) {
            delete entries[key];
        }
    }
    console.log('需要打包的entries', entries);
    return entries;
};

const entries = deleteEntryKey(getEntry('./src/**/*.jsx'));
const chunks = Object.keys(entries);
const config = require('../index.js');

module.exports = {
    context: config.rootPath,
    entry: entries,
    output: {
        filename: '[name].[hash:8].js',
        chunkFilename: 'chunk.[id].[hash:8].js',
        path: config.staticPath,
        publicPath: config.publicPath
    },
    module: {
        rules: [
            {
                test: /\.js|jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env', 'stage-0', 'react'],
                        plugins: [
                            ['react-hot-loader/babel'],
                            ['import', {"libraryName": "antd", "style": "css"}]
                        ]
                    }
                }
            },
            {
                // 当前项目，启用CSS modules
                test: /\.less$/,
                include: [config.srcPath],
                exclude: [config.libPath],
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: "css-loader" // creates style nodes from JS strings
                        },
                        {
                            loader: "postcss-loader", // translates CSS into CommonJS
                            options: {
                                plugins: [
                                    require('autoprefixer')()
                                ]
                            }
                        },
                        {
                            loader: "less-loader" // compiles Less to CSS
                        }
                    ]
                })
            },
            {
                // 当前项目，启用CSS modules
                test: /\.css$/,
                include: [config.srcPath],
                exclude: [config.libPath],
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                importLoaders: 1,
                                localIdentName: '[path][name]-[local]-[hash:5]'
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [
                                    require('autoprefixer')()
                                ]
                            }
                        }
                    ]
                })
            },
            {
                // 依赖库，禁用CSS modules
                test: /\.css$/,
                include: [config.libPath],
                exclude: [config.srcPath],
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [
                                    require('autoprefixer')()
                                ]
                            }
                        }
                    ]
                })
            },
            {
                test: /\.woff(\?.*)?$/,
                use: 'url-loader?prefix=fonts/&name=[name]_[hash:8].[ext]&limit=10000&mimetype=application/font-woff'
            },
            {
                test: /\.woff2(\?.*)?$/,
                use: 'url-loader?prefix=fonts/&name=[name]_[hash:8].[ext]&limit=10000&mimetype=application/font-woff2'
            },
            {
                test: /\.otf(\?.*)?$/,
                use: 'file-loader?prefix=fonts/&name=[name]_[hash:8].[ext]&limit=10000&mimetype=font/opentype'
            },
            {
                test: /\.ttf(\?.*)?$/,
                use: 'url-loader?prefix=fonts/&name=[name]_[hash:8].[ext]&limit=10000&mimetype=application/octet-stream'
            },
            {
                test: /\.eot(\?.*)?$/,
                use: 'file-loader?prefix=fonts/&name=[name]_[hash:8].[ext]'
            },
            {
                test: /\.svg(\?.*)?$/,
                use: 'url-loader?prefix=fonts/&name=[name]_[hash:8].[ext]&limit=10000&mimetype=image/svg+xml'
            },
            {
                test: /\.(png|jpg|jpeg)$/,
                use: 'url-loader?limit=8192&name=static/img/[name].[ext]' // name 字段指定了在打包根目录（output.path）下生成名为 images 的文件夹
            }
        ],
    },
    resolve: {
        alias: {
            'ASYNC': config.srcPath
        },
        extensions: ['*', '.js', '.jsx', 'sass', '.less', '.css']
    },
    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
        // css抽取
        new ExtractTextPlugin({
            filename: 'css/[name].styles.[contenthash].css'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'js/vendor',
            minChunks: function (module) {
                if(module.resource && (/^.*\.(css|scss|less)$/).test(module.resource)) {
                    return false;
                }
                return module.context && module.context.indexOf("node_modules") !== -1;
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'js/common',
            minChunks: Infinity
        })
    ]
};

// 生成HTML文件(多个)
chunks.forEach(function(pathname) {
    const conf = {
        title: 'My App',
        filename: pathname + '.html',
        template: './template/index.html',
        inject: 'true',
        minify: {
            removeComments: true,
            collapseWhitespace: false
        }
    };
    if (pathname in module.exports.entry) {
        conf.chunks = ['js/common', 'js/vendor', pathname];
        conf.hash = false;
    }
    module.exports.plugins.push(new HtmlWebpackPlugin(conf));
});
