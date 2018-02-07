const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: {
        preview: './preview.js'
    },
    output: {
        filename: '[name]_bundle.js',
        path: path.resolve(__dirname, './'),
    },
    module: {
        rules: [
            {
                test: /\.css$|\.scss$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localIdentName: '[local]'
                        }
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            },
            {
                test: /\.js?$|\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'babel-loader',
                        query: {
                            // stage-0 is to es7 es 2015 is to es5
                            plugins: ['transform-runtime'],
                            presets: ['es2015', 'stage-0', 'react'],
                        }

                        // options: {
                        //     // presets: ['env', 'react']
                        // }
                    }
                ]
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, './'),
        compress: true,
        port: 8001,
        host: '10.41.9.63'
    },
    devtool: 'source-map',
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: './preview.html'
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
};