import ListenerManager from "./ListenerManager";
import Registry from "./Registry";

export default class ObservableRegistry<K, V> extends Registry<K, V> {

    readonly onAddListeners = new ListenerManager<V>();
    readonly onRemoveListeners = new ListenerManager<V>();
    
    add(value: V): boolean {
        const result = super.add(value);
        this.onAddListeners.emit(value);
        return result;
    }

    remove(value: V): boolean {
        const result = super.remove(value);
        this.onRemoveListeners.emit(value);
        return result;
    }

    removeByKey(key: K): boolean {
        if (!this.map.has(key)) return false;
        const value: V = this.map.get(key) as V;
        this.map.delete(key);
        this.onRemoveListeners.emit(value);
        return true;
    }
}