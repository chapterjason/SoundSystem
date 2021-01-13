module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testRegex: "/__tests__/.*\\.test\\.[jt]sx?$",
    setupFiles: [
        "./__tests__/setup.ts",
    ],
};
