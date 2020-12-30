const { EnvironmentLoader, ProcessEnvironment } = require("@mscs/environment");
const path = require("path");

const UrlExpression = /^(\w+):\/\/(\w+):(\w+)@([a-zA-Z0-9.]+):(\d+)\/(\w+)$/m;

// eslint-disable-next-line no-async-promise-executor
module.exports = new Promise(async function (resolve) {
    const environment = new ProcessEnvironment();
    const environmentLoader = new EnvironmentLoader(environment);

    await environmentLoader.loadEnvironment(path.join(__dirname, ".env"));

    const DATABASE_URL = environment.get("DATABASE_URL");
    const match = UrlExpression.exec(DATABASE_URL);

    if (!match) {
        throw new Error("Invalid DATABASE_URL");
    }

    const [driver, username, password, host, port, database] = match.slice(1);

    resolve({
        "type": driver,
        "host": host,
        "port": port,
        "username": username,
        "password": password,
        "database": database,
        "synchronize": false,
        "logging": false,
        "entities": [
            path.join(__dirname, "dist/Module/Application/Entity/**/*.js"),
        ],
        "migrations": [
            path.join(__dirname, "dist/Module/Application/Migration/**/*.js"),
        ],
        "subscribers": [
            path.join(__dirname, "dist/Module/Application/Subscriber/**/*.js"),
        ],
        "cli": {
            "entitiesDir": path.join(__dirname, "src/Module/Application/Entity"),
            "migrationsDir": path.join(__dirname, "src/Module/Application/Migration"),
            "subscribersDir": path.join(__dirname, "src/Module/Application/Subscriber"),
        },
    });
});
