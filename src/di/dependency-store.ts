import { EntryProvider } from "./providers/entry-provider";
import { validateHasValue } from "../common/helpers";

export enum Lifetime {
    Transient,
    Singleton
}

export interface IEntryRecord {
    actualTypes: any[];

    lifetime: Lifetime;

    resolve: () => any[];
}

/**
 * Persists dependency registrations and created singletons.
 */
class DependencyStore {
    private entryRegistrations = new Map<any, EntryProvider[]>();
    private instanceStore = new Map<EntryProvider, any>();

    /**
     * Registers new dependency configuration.
     * @param entryProvider The provider for the dependency.
     * @param multi Flag that marks if multiple injection is allowed.
     */
    register(entryProvider: EntryProvider, multi = false) {
        const existingRegistration = this.getRegistration(entryProvider.as, false);
        if (!existingRegistration) {
            return this.entryRegistrations.set(entryProvider.as, [entryProvider]);
        }

        if (multi) {
            return existingRegistration.push(entryProvider);
        }

        existingRegistration[existingRegistration.length - 1] = entryProvider;
    }

    /**
     * Get single provider by key.
     * @param key The key to retrieve provider.
     */
    get(key: any) {
        const existingRegistration = this.getRegistration(key);
        return existingRegistration[existingRegistration.length - 1];
    }

    /**
     * Get all providers by key.
     * @param key The key to retrieve all providers.
     */
    getAll(key: any) {
        return this.getRegistration(key);
    }

    /**
     * Set instance in the cache.
     * @param entryProvider The provider for which the instance will be associated.
     * @param value The instance.
     */
    setInstance(entryProvider: EntryProvider, value: any) {
        this.instanceStore.set(entryProvider, value);
    }

    /**
     * Retrieve instance by provider.
     * @param entryProvider The provider for which the instance will be retrieved.
     */
    getInstance(entryProvider: EntryProvider) {
        return this.instanceStore.get(entryProvider);
    }

    clearCachedObjects() {
        this.instanceStore = new Map<EntryProvider, any>();
    }

    private getRegistration(key: any, validate = true) {
        const existingRegistration = this.entryRegistrations.get(key) as EntryProvider[];
        if (validate) {
            validateHasValue(existingRegistration, `There is no registration for ${key}`);
        }

        return existingRegistration;
    }
}

export const dependencyStore = new DependencyStore();