import { IConstructible } from "./interfaces";
import { resolveAll as activatorResolveAll, resolveKey as activatorResolve } from "./resolver";
import { dependencyStore, IEntryRecord } from "./dependency-store";
import { InstantiateProvider } from "./providers/instantiate-provider";
import { SingletonProvider } from "./providers/singleton-provider";
import { ValueProvider } from "./providers/value-provider";
import { FactoryProvider } from "./providers/factory-provider";

/**
 * Register type which will be instantiated each time when requested.
 * @param use The type to instantiate.
 * @param as The type used to resolve.
 * @param multi Allows multiple types to be registered as "as".
 */
export function registerType(use: IConstructible, as: any = use, multi = false) {
    dependencyStore.register(new InstantiateProvider(use, as), multi);
}

/**
 * Register type which will be instantiated only once, and the instace will be reused.
 * @param use The type to instantiate.
 * @param as The type used to resolve.
 * @param multi Allows multiple types to be registered as "as".
 */
export function registerSingleton(use: IConstructible, as: any = use, multi = false) {
    dependencyStore.register(new SingletonProvider(use, as), multi);
}

/**
 * Register value by given key.
 * @param key The key.
 * @param value The value.
 * @param multi Allows multiple values to be injected for single key.
 */
export function registerValue(key: any, value: any = key, multi = false) {
    dependencyStore.register(new ValueProvider(value, key), multi);
}

/**
 * Register factory function, which will be used to create the required object.
 * @param factory The factory function.
 * @param as The type used to resolve.
 * @param multi Allows multiple types to be registered as "as".
 */
export function registerFactory(factory: () => any, as: any, multi = false) {
    dependencyStore.register(new FactoryProvider(factory, as), multi);
}

/**
 * Resolve dependency by given key.
 * @param dependencyKey The key for which the dependency is registered.
 */
export function resolve(dependencyKey: any) {
    return activatorResolve(dependencyKey);
}

/**
 * Resolve all dependencies for given key.
 * @param dependencyKey The key for which the dependencies is registered.
 */
export function resolveAll(dependencyKey: any) {
    return activatorResolveAll(dependencyKey);
}