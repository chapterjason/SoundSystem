import { ApplicationInterface } from "@mscs/console";
import { Container } from "@soundsystem/system";

export async function runtime(container: Container) {
    const application = await container.get<ApplicationInterface>("application");

    return await application.run();
}
