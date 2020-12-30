import { runtime } from "./runtime";
import { bootstrap } from "./bootstrap";
import { errorHandler } from "./errorHandler";
import { shutdown } from "./shutdown";

bootstrap()
    .then(runtime)
    .catch((error) => {
        return errorHandler(error).then(shutdown);
    });

