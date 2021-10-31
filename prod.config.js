// @ts-check
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: ['./src/ts/app.ts'],
    output: {
        filename: 'mamkEngine~[chunkhash:8].js',
        path: path.resolve(__dirname, 'dist/'),
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.ts$/i,
                // specify custom loader after default one.
                use: ['ts-loader'],
            },
        ],
    },
    devtool: false,
    mode: 'production',
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html',
        }),
        new HtmlWebpackPlugin({
            filename: 'about.html',
            template: './src/about.html',
        }),
        new HtmlWebpackPlugin({
            filename: 'privacy.html',
            template: './src/privacy.html',
        }),
        new HtmlWebpackPlugin({
            filename: 'tos.html',
            template: './src/tos.html',
        }),
        new CopyPlugin({
            patterns: [
                { from: './src/img', to: './img' },
                { from: './src/data', to: './data' },
                { from: './src/404.html', to: './' },
            ],
        }),
        new MiniCssExtractPlugin(),
        new CleanWebpackPlugin(),
    ],
    optimization: {
        minimize: true,
        mangleExports: 'size',
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin({
                terserOptions: {
                    mangle: {
                        module: true,
                    },
                    compress: {
                        pure_funcs: ['this.log_', 'assert'],
                    },
                },
            }),
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
};
