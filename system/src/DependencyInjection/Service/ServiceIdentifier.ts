export type SingleServiceIdentifier = `@${string}`;
export type TaggedServiceIdentifier = `!${string}`;
export type ParameterServiceIdentifier = `%${string}%`;

export type ServiceIdentifier = SingleServiceIdentifier | TaggedServiceIdentifier | ParameterServiceIdentifier;

