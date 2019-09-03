import { Injectable, registerSingleton } from "../../di";
import { ApplicationEvent } from "./events/base";
import { Type } from "../../exports";

type EventHandler<TEvent> = (ev: TEvent) => void;

@Injectable
export class EventHub {
    private eventSubscribers = new Map<Type<ApplicationEvent<any>>, EventHandler<any>[]>();

    // TODO: return some kind of subscription
    subscribe<TData, TEvent extends ApplicationEvent<TData>>(eventType: new (data: TData) => TEvent, cb: (ev: TEvent) => void): void {
        let subscribers = this.eventSubscribers.get(eventType);
        if (!subscribers) {
            subscribers = [];
            this.eventSubscribers.set(eventType, subscribers);
        }

        subscribers.push(cb);
    }

    raise<TData, TEvent extends ApplicationEvent<TData>>(ev: TEvent) {
        const subscribers = this.eventSubscribers.get((ev as any).constructor);
        subscribers.forEach(s => s(ev));
    }
}

registerSingleton(EventHub);
