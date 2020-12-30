import { Process } from "@mscs/process";

export async function update(){
    const updateProcess = new Process(["/home/pi/scripts/client/client_update.sh"]);
    await updateProcess.run();
}
