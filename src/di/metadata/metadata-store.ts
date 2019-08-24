import { IConstructible } from "../interfaces";
import { isString } from "../helpers";

export enum InjectionTypes {
    Ctor,
    Prop
}

export interface IInjectionMetadata {
    injectionKey: any;
    multi?: boolean;
}

/**
 * When number is used as key, that means it's a parameter index.
 * When string is used as key, that means it's a property name.
 */
type IMetadataRecord = Map<number | string, IInjectionMetadata>;

/**
 * Store that contains injection metadata.
 */
class MetadataStore {
    private metadata = new Map<IConstructible, IMetadataRecord>();

    /**
     * Get injection metadata for given parameter index.
     * @param target The type for which metadata should be resolved.
     * @param paramIndex The parameter's index.
     */
    getParamMetadata(target: IConstructible, paramIndex: number) {
        const record = this.metadata.get(target);
        if (record) {
            return record.get(paramIndex);
        }

        return undefined;
    }

    /**
     * Get injection metadata for configured properties.
     * @param target The type for which metadata should be resolved.
     */
    getPropertiesMetadata(target: IConstructible) {
        const record = this.metadata.get(target);
        if (!record) {
            return [];
        }

        const props = Array.from(record.keys())
            .filter(x => isString(x))
            .map(p => {
                return {
                    name: p,
                    ...record.get(p)
                };
            });

        return props;
    }

    /**
     * Set injection metadata for given type.
     * @param target The type.
     * @param recordKey If the key is number, it will be threated as parameter index, otherwise it's property name.
     * @param metadata The configured metadata.
     */
    setMetadata(target: any, recordKey: number | string, metadata: IInjectionMetadata) {
        if (!this.metadata.has(target)) {
            this.metadata.set(target, new Map<number | string, IInjectionMetadata>());
        }

        const targetMetadata = this.metadata.get(target);
        targetMetadata.set(recordKey, metadata);
    }
}

export const metadataStore = new MetadataStore();