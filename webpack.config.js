const Html = require('html-webpack-plugin');
const Template = require('html-webpack-template');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: './main',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'main.bundle.js'
    },
    devtool: "sourcemap",
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.scss$/, use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                test: /\.tsx?$/, use: 'awesome-typescript-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(ttf|png|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
                use: {
                    loader: 'file-loader',
                    options: { name: "[name].[ext]" }
                }
            }
        ]
    },
    plugins: [
        new Html({
            template: Template,
            appMountId: 'app',
            title: 'Fourier Sums Demo',
            inject: false,
            scripts: [
                "https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.99.5/jsxgraphcore.js"
            ],
        }), new ExtractTextPlugin("styles.css"),
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
}