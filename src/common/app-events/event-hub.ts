import { Injectable, registerSingleton } from "../../di";
import { ApplicationEvent } from "./events/base";
import { Type } from "../../exports";

type EventHandler<TEvent> = (ev: TEvent) => void;

interface ISubscription {
    unsubscribe(): void;
}

@Injectable
export class EventHub {
    private eventSubscribers = new Map<Type<ApplicationEvent<any>>, EventHandler<any>[]>();

    subscribe<TData, TEvent extends ApplicationEvent<TData>>(eventType: new (data: TData) => TEvent, cb: (ev: TEvent) => void): ISubscription {
        let subscribers = this.eventSubscribers.get(eventType);
        if (!subscribers) {
            subscribers = [];
            this.eventSubscribers.set(eventType, subscribers);
        }

        subscribers.push(cb);

        return {
            unsubscribe() {
                subscribers.splice(subscribers.indexOf(cb), 1);
            }
        };
    }

    raise<TData, TEvent extends ApplicationEvent<TData>>(ev: TEvent) {
        const subscribers = this.eventSubscribers.get((ev as any).constructor);
        subscribers.forEach(s => s(ev));
    }
}

registerSingleton(EventHub);
