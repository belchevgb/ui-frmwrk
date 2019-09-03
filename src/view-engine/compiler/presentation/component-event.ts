type SubscribeCb = (val: any) => void;

/**
 * Represents event that is fired by components.
 */
export class ComponentEvent {
    private subscribers: SubscribeCb[] = [];

    subscribe(cb: (val: any) => void) {
        this.subscribers.push(cb);
    }

    raise(val: any) {
        this.subscribers.forEach(s => s(val));
    }
}