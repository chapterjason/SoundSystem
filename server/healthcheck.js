const http = require("http");
const path = require("path");
const { ProcessEnvironment, EnvironmentLoader } = require("@mscs/environment");

async function runtime() {

    const environment = new ProcessEnvironment();
    const environmentLoader = new EnvironmentLoader(environment);
    await environmentLoader.loadEnvironment(path.join(__dirname, ".env"));

    const options = {
        host: "localhost",
        port: environment.get("PORT"),
        timeout: 2000,
        path: "/health",
    };

    console.log("OPTIONS:", options);

    const request = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        if (res.statusCode === 200) {
            process.exit(0);
        } else {
            process.exit(1);
        }
    });

    request.on("error", function (error) {
        console.log("ERROR");
        console.log(error);
        process.exit(1);
    });

    request.end();

}

runtime()
    .catch(error => {
        console.log("ERROR");
        console.log(error);
        process.exit(1);
    });
