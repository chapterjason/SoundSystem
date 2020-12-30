const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
    devtool: "source-map",
    target: "node",
    entry: "./src/index.ts",
    module: {
        rules: [
            {
                test: /\.ts$/,
                include: path.join(__dirname, "src"),
                loader: "ts-loader",
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
    ],
    optimization: {
        minimize: false,
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "client.js",
        path: path.resolve(__dirname, "dist"),
    },
};
