const path = require("path");

module.exports = {
    devtool: "inline-source-map",
    target: "node",
    entry: "./src/index.ts",
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
                        "@babel/preset-typescript",
                    ],
                    plugins: [
                        "@babel/plugin-syntax-dynamic-import",
                        "@babel/plugin-proposal-class-properties"
                    ]
                },
            },
        ],
    },
    optimization: {
        minimize: false
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "client.js",
        path: path.resolve(__dirname, "dist"),
    },
};
