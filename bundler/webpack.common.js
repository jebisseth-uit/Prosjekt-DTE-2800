const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

// Basert på kodeeksempler fra: https://threejs-journey.com/
// NB! Fyll inn navn på .js entry-fil, .html template. Merk at html-fila også må ligge i en
// undermappe med samme navn som hthml-fila.
// PASS PÅ REKKEFØLGEN (1-1 mellom pages og pagesDir):
const pages = [
    "ammeShapes2"
];
const pagesDir = [
    ""
];

module.exports = {
    entry: pages.reduce((config, page, index) => {
        config[page] = path.resolve(__dirname,`../src/${pagesDir[index]}/${page}/${page}.js`);
        return config;
    }, {}),
    output: {
        //hashFunction: 'xxhash64',
        //filename: '[name].[contenthash].js',
        filename: '[name].js',
        path: path.resolve(__dirname, '../dist')
    },
    optimization: {
        splitChunks: {
            chunks: "all",
        },
    },
    experiments: {
        topLevelAwait: true
    },
    devtool: 'source-map',
    plugins: [].concat(
        pages.map(
            (page, index) =>
                new HtmlWebpackPlugin({
                    inject: true,
                    template: path.resolve(__dirname, `../src/${pagesDir[index]}/${page}/${page}.html`),
                    filename: `./dist/${pagesDir[index]}/${page}/${page}.html`,
                    chunks: [page],
                })
        )
    ).concat(
        new CopyWebpackPlugin({
            patterns: [
                { from: path.resolve(__dirname, '../static') }
            ]
        }),
    ).concat(
        new MiniCSSExtractPlugin()
    ),
    module:
    {
        rules:
        [
            // HTML
            {
                test: /\.(html)$/,
                use:
                [
                    'html-loader'
                ]
            },

            // JS
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use:
                [
                    'babel-loader'
                ]
            },

            // CSS
            {
                test: /\.css$/,
                use:
                [
                    MiniCSSExtractPlugin.loader,
                    'css-loader'
                ]
            },

            // Images
            {
                test: /\.(jpg|png|gif|svg)$/,
                type: 'asset/resource',
                generator:
                {
                    filename: 'assets/images/[hash][ext]'
                }
            },

            // Fonts
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                type: 'asset/resource',
                generator:
                {
                    filename: 'assets/fonts/[hash][ext]'
                }
            }
        ]
    }
}
