const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './index.html'
        })
    ],
    module: {
        rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        },
        {
            test: /\.scss$/,
            use: ['style-loader', 'css-loader','sass-loader']
        }]
    },
    mode: 'development'
}