import { ServiceIdentifier, TaggedServiceIdentifier } from "./ServiceIdentifier";

export function isTaggedServiceIdentifier(serviceIdentifier: ServiceIdentifier): serviceIdentifier is TaggedServiceIdentifier {
    return serviceIdentifier.startsWith("!");
}
