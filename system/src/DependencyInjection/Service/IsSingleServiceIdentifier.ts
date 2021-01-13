import { ServiceIdentifier, SingleServiceIdentifier } from "./ServiceIdentifier";

export function isSingleServiceIdentifier(serviceIdentifier: ServiceIdentifier): serviceIdentifier is SingleServiceIdentifier {
    return serviceIdentifier.startsWith("@");
}
