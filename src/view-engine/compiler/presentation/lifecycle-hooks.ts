export const lifecycleHookNames = {
    onComponentInit: "onComponentInit",
    onComponentDestroy: "onComponentDestroy"
};

export interface IComponentInit {
    onComponentInit(): void;
}

export interface IComponentDestroy {
    onComponentDestroy(): void;
}