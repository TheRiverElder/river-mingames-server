import { Supplier } from "../CommonTypes";
import ListenerManager from "../management/ListenerManager";
import Vector2 from "../math/Vector2";
import { Button, DragEventListeners, DragPointerEvent } from "./DragPointerEvent";

export default class DragContainer {
    readonly onDown = new ListenerManager<DragPointerEvent>();
    readonly onMove = new ListenerManager<DragPointerEvent>();
    readonly onUp = new ListenerManager<DragPointerEvent>();
    readonly onLeave = new ListenerManager<DragPointerEvent>();

    readonly listeners: DragEventListeners;
    getPosition: Supplier<Vector2>;

    constructor(listeners: DragEventListeners, getPosition: Supplier<Vector2>) {
        this.listeners = listeners;
        this.getPosition = getPosition;
    }

    initialize() {
        this.onDown.add(this.onContainerDown);
        this.onMove.add(this.onContainerMove);
        this.onUp.add(this.onContainerUp);
        this.onLeave.add(this.onContainerUp);
    }

    destory() {
        this.onDown.remove(this.onContainerDown);
        this.onMove.remove(this.onContainerMove);
        this.onUp.remove(this.onContainerUp);
        this.onLeave.remove(this.onContainerUp);
    }

    private started: boolean = false;
    private startHostPosition: Vector2 = Vector2.INVALID_VECTOR2;
    private startPointerPosition: Vector2 = Vector2.INVALID_VECTOR2;
    private moved: boolean = false;
    
    onContainerDown = (event: DragPointerEvent) => {
        if (event.button !== Button.MIDDLE) return;
        this.startHostPosition = this.getPosition();
        this.startPointerPosition = event.globalPosition;
        this.moved = false;
        this.started = true;
    };

    onContainerMove = (event: DragPointerEvent) => {
        if (!this.started) return;
        if (!this.moved) {
            this.listeners.onDragStartListeners.emit(this.startHostPosition);
            this.moved = true;
        }

        const currentPointerPosition = event.globalPosition;
        const delta = currentPointerPosition.sub(this.startPointerPosition);
        const currentHostPosition = this.startHostPosition.add(delta);
        this.listeners.onDragMoveListeners.emit(currentHostPosition);

    };

    onContainerUp = (event: DragPointerEvent) => {
        if (!this.started) return;
        if (this.moved) {
            const currentPointerPosition = event.globalPosition;
            const delta = currentPointerPosition.sub(this.startPointerPosition);
            const currentHostPosition = this.startHostPosition.add(delta);
            this.listeners.onDragMoveListeners.emit(currentHostPosition);
            this.listeners.onDragEndListeners.emit(currentHostPosition);
        } else {
            this.listeners.onClickListeners.emit(this.startHostPosition);
        }

        this.started = false;
        this.startHostPosition = Vector2.INVALID_VECTOR2;
        this.startPointerPosition = Vector2.INVALID_VECTOR2;
        this.moved = false;
    };

    onContainerLeave = () => {
        this.listeners.onDragMoveListeners.emit(this.startHostPosition);
        this.listeners.onDragEndListeners.emit(this.startHostPosition);

        this.started = false;
        this.startHostPosition = Vector2.INVALID_VECTOR2;
        this.startPointerPosition = Vector2.INVALID_VECTOR2;
        this.moved = false;
    };
}