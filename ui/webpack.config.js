const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    devtool: "inline-source-map",
    entry: {
        main: "./src/index.tsx",
    },
    module: {
        rules: [
            {
                test: /\.(js|mjs|jsx|ts|tsx)$/,
                include: path.join(__dirname, "src"),
                loader: "babel-loader",
                options: {
                    presets: [
                        [
                            "@babel/preset-env",
                            {
                                useBuiltIns: "entry",
                                corejs: 3,
                            },
                        ],
                        "@babel/preset-react",
                        "@babel/preset-typescript",
                    ],
                    plugins: [
                        "@babel/plugin-syntax-dynamic-import",
                        "@babel/plugin-proposal-class-properties"
                    ]
                },
            },
            {
                test: /\.(css|sass|scss)$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    MiniCssExtractPlugin.loader,
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
            {
                test: /\.(svg|eot|woff|woff2|ttf)$/,
                loader: "file-loader",
                options: {
                    outputPath: "fonts",
                    publicPath: "fonts",
                },
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css",
        }),
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".scss", ".sass", ".css"],
    },
    output: {
        filename: "[name].js",
        chunkFilename: "[id].js",
        path: path.resolve(__dirname, "dist"),
    },
};
