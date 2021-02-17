const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
    entry: './src/js/app.js',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist/')
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
        ]
    },
    mode: 'production',
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'about.html',
            template: './src/about.html'
        }),
        new CopyPlugin({
            patterns: [
                { from: './src/img', to: './img'},
                { from: './src/data', to: './data'}
            ]
        }),
        new MiniCssExtractPlugin(),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            `...`,
            new CssMinimizerPlugin(),
        ],
    },
}