const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: [
        './src/ts/app.ts',
        './src/ts/utils.ts',
        './src/ts/events.ts',
        './src/ts/loadParticles.ts'
    ],
    output: {
        filename: '[name].chonk.js',
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
            {
                test: /\.ts$/i,
                use: [
                    'ts-loader'
                ]
            },
        ]
    },
    devtool: false,
    mode: 'development',
    watch: true,
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
        new CleanWebpackPlugin()
    ],
    optimization: {
        minimize: false,
        minimizer: [
            `...`,
            new CssMinimizerPlugin(),
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },

}