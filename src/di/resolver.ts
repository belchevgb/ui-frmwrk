import { getParamTypes } from "./metadata.resolver";
import { SingletonProvider } from "./providers/singleton-provider";
import { ValueProvider } from "./providers/value-provider";
import { InstantiateProvider } from "./providers/instantiate-provider";
import { FactoryProvider } from "./providers/factory-provider";
import { dependencyStore } from "./dependency-store";
import { EntryProvider } from "./providers/entry-provider";
import { metadataStore } from "./metadata/metadata-store";
import { IConstructible } from "./interfaces";

/**
 * Creates or gets cached singleton.
 * @param provider The provider associated with the singleton.
 */
function resolveSingleton(provider: SingletonProvider) {
    const cachedInstance = dependencyStore.getInstance(provider);
    if (cachedInstance) {
        return cachedInstance;
    }

    const newInstance = resolveInstance(new InstantiateProvider(provider.use, provider.as));
    dependencyStore.setInstance(provider, newInstance);
    return newInstance;
}

function resolveValue(provider: ValueProvider) {
    return provider.use;
}

/**
 * Resolve parameters by the metadata they have.
 * @param targetType The type which has parameters.
 * @param paramIndex The parameter index, which should be resolved.
 * @param paramType The parameter type.
 */
function resolveParam(targetType: IConstructible, paramIndex: number, paramType: any) {
    const paramMetadata = metadataStore.getParamMetadata(targetType, paramIndex);
    if (paramMetadata) {
        const key = paramMetadata.injectionKey;
        return paramMetadata.multi ? resolveAll(key) : resolveKey(key);
    }

    return resolveKey(paramType);
}

/**
 * Set properties that need injection for given instance.
 * @param instance The instance to set properties.
 * @param targetType The type of instance.
 */
function resolveProperties(instance: any, targetType: IConstructible) {
    const propMetadata = metadataStore.getPropertiesMetadata(targetType) || [];

    for (const propMeta of propMetadata) {
        const key = propMeta.injectionKey;
        const propValue = propMeta.multi ? resolveAll(key) : resolveKey(key);

        instance[propMeta.name] = propValue;
    }
}

/**
 * Instantiate type by provider.
 * @param provider The provider.
 */
function resolveInstance(provider: InstantiateProvider) {
    const type = provider.use;
    const paramTypes = getParamTypes(type);
    const params = paramTypes.map((p, i) => resolveParam(type, i, p));
    const instance = new type(...params);

    resolveProperties(instance, type);

    return instance;
}

/**
 * Resolve instance by using factory.
 * @param provider The provider.
 */
function resolveFactory(provider: FactoryProvider) {
    return provider.factory();
}

/**
 * Resolve instance by provider.
 * @param provider The provider.
 */
function resolveProvider(provider: EntryProvider) {
    const providerType = provider.constructor;
    return resolversMap.get(providerType)(provider);
}

const resolversMap = new Map<any, (prov: any) => any>([
    [SingletonProvider, resolveSingleton],
    [ValueProvider, resolveValue],
    [InstantiateProvider, resolveInstance],
    [FactoryProvider, resolveFactory]
]);

/**
 * Resolve instance by key.
 * @param key The key.
 */
export function resolveKey(key: any) {
    const provider = dependencyStore.get(key);
    return resolveProvider(provider);
}

/**
 * Resolve instances for all providers by key.
 * @param key The key.
 */
export function resolveAll(key: any) {
    const providers = dependencyStore.getAll(key);
    return providers.map(p => resolveProvider(p));
}