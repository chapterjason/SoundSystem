import { ParameterServiceIdentifier, ServiceIdentifier } from "./ServiceIdentifier";

export function isParameterServiceIdentifier(serviceIdentifier: ServiceIdentifier): serviceIdentifier is ParameterServiceIdentifier {
    return serviceIdentifier.startsWith("%") && serviceIdentifier.endsWith("%");
}
