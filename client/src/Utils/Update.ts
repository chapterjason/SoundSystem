import { execute } from "./Execute";

export async function update() {
    await execute(["/home/pi/scripts/client/client_update.sh"]);
}
