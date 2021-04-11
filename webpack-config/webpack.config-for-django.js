/**
 *
 * @author A.kauniyyah <alaunalkauniyyah3@gmail.com>
 * @copyright 2020 A.kauniyyah | Front-end Web developer
 *
 * ________________________________________________________________________________
 *
 * webpack.config.js
 *
 * The gulp configuration file.
 *
 */

const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const exclusions = /node_modules/;


module.exports = [{
    entry: {
        app: "./assets/app.js",
        vendor: "./assets/vendor.js"
    },
    output: {
        path: path.resolve(__dirname, "static"),
        publicPath: "/static/",
        filename: "[name].js",
        chunkFilename: "[id]-[chunkhash].js",
    },
    optimization: {
        minimizer: [
            new OptimizeCssAssetsPlugin(),
            new TerserPlugin()
        ]
    },
    devServer: {
        port: 8081,
        writeToDisk: true,
    },
    module: {
        rules: [{
                test: /.*/,
                include: path.resolve(__dirname, "assets/img"),
                exclude: exclusions,
                options: {
                    context: path.resolve(__dirname, "assets/"),
                    name: "[path][name].[ext]",
                },
                loader: "file-loader",
            },
            {
                test: /\.scss$/,
                exclude: exclusions,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader", //2. Turns css into commonjs
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: [
                                require('autoprefixer')
                            ],
                        },
                    },
                    "sass-loader" //1. Turns sass into css
                ],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false
        }),
        new MiniCssExtractPlugin(),
    ],
}];
