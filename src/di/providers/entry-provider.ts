import { FactoryProvider } from "./factory-provider";
import { InstantiateProvider } from "./instantiate-provider";
import { SingletonProvider } from "./singleton-provider";
import { ValueProvider } from "./value-provider";

export type EntryProvider = FactoryProvider | InstantiateProvider | SingletonProvider | ValueProvider;