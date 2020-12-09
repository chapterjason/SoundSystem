import { Process } from "@mscs/process";

export async function update(){
    const updateProcess = new Process(["bash", "/home/pi/scripts/client/client_update.sh"], {
        detached: true,
    });

    await updateProcess.run();
}
