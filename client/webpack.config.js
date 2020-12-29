const path = require("path");

module.exports = {
    devtool: "inline-source-map",
    target: "node",
    entry: "./src/index.ts",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "client.js",
        path: path.resolve(__dirname, "dist"),
    },
};
