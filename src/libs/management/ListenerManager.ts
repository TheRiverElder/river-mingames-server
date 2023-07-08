import { Consumer } from "../CommonTypes";

export default class ListenerManager<TEvent = void> {
    private listeners = new Set<Consumer<TEvent>>();

    add(listener: Consumer<TEvent>) {
        this.listeners.add(listener);
    }

    remove(listener: Consumer<TEvent>) {
        this.listeners.delete(listener);
    }

    emit(event: TEvent) {
        this.listeners.forEach(l => l(event));
    }

}