import { double, Supplier } from "../CommonTypes";
import ListenerManager from "../management/ListenerManager";
import Vector2 from "../math/Vector2";
import DragContainer from "./DragContainer";
import { Button, createDragEventListeners, DragEventListeners, DragPointerEvent } from "./DragPointerEvent";


export default class DragElement {
    readonly onDown = new ListenerManager<DragPointerEvent>();
    readonly onUp = new ListenerManager<DragPointerEvent>();

    readonly listeners: DragEventListeners = createDragEventListeners();
    readonly container: DragContainer;
    enabled: boolean = true;
    getPosition: Supplier<Vector2>;
    getScalar: Supplier<double>;

    constructor(container: DragContainer, getPosition: Supplier<Vector2>, getScalar: Supplier<double> = (() => 1)) {
        this.container = container;
        this.getPosition = getPosition;
        this.getScalar = getScalar;
    }

    setup() {
        this.onDown.add(this.onElementDown);
        this.onUp.add(this.onElementUp);

        this.container.onMove.add(this.onContainerMove);
        this.container.onUp.add(this.onContainerUp);
        this.container.onLeave.add(this.onContainerUp);
    }

    dispose() {
        this.onDown.remove(this.onElementDown);
        this.onUp.remove(this.onElementUp);

        this.container.onMove.remove(this.onContainerMove);
        this.container.onUp.remove(this.onContainerUp);
        this.container.onLeave.remove(this.onContainerUp);
    }

    private pressed: boolean = false;
    private started: boolean = false;
    private startHostPosition: Vector2 = Vector2.INVALID_VECTOR2;
    private startPointerPosition: Vector2 = Vector2.INVALID_VECTOR2;
    private moved: boolean = false;
    
    onElementDown = (event: DragPointerEvent) => {
        if (event.button !== Button.LEFT) return;
        this.pressed = true;
        if (!this.enabled) return;
        // console.log("onElementDown");
        this.startHostPosition = this.getPosition();
        this.startPointerPosition = event.globalPosition;
        this.moved = false;
        this.started = true;
    };

    onContainerMove = (event: DragPointerEvent) => {
        if (!this.started) return;
        if (!this.enabled) {
            this.onElementUp(event);
            return;
        }
        if (!this.moved) {
            this.listeners.onDragStartListeners.emit(this.startHostPosition);
            this.moved = true;
        }

        const currentPointerPosition = event.globalPosition;
        const delta = currentPointerPosition.sub(this.startPointerPosition).div(this.getScalar());
        const currentHostPosition = this.startHostPosition.add(delta);
        this.listeners.onDragMoveListeners.emit(currentHostPosition);

    };

    onElementUp = (event: DragPointerEvent) => {
        if (this.moved) {
            if (!this.started) return;
            const currentPointerPosition = event.globalPosition;
            const delta = currentPointerPosition.sub(this.startPointerPosition).div(this.getScalar());
            const currentHostPosition = this.startHostPosition.add(delta);
            this.listeners.onDragMoveListeners.emit(currentHostPosition);
            // console.log("onDragMove", this.listeners.onDragMove);
            this.listeners.onDragEndListeners.emit(currentHostPosition);
            // console.log("onDragEnd", this.listeners.onDragEnd);
        } else {
            if (this.pressed) {
                this.listeners.onClickListeners.emit(this.startHostPosition);
            }
            // console.log("onClick", this.listeners.onClick);
        }

        event.nativeEvent.stopPropagation();

        this.started = false;
        this.startHostPosition = Vector2.INVALID_VECTOR2;
        this.startPointerPosition = Vector2.INVALID_VECTOR2;
        this.moved = false;
    };

    onContainerUp = (event: DragPointerEvent) => {
        // console.log("onElementUp");
        if (this.moved) {
            if (!this.started) return;
            const currentPointerPosition = event.globalPosition;
            const delta = currentPointerPosition.sub(this.startPointerPosition).div(this.getScalar());
            const currentHostPosition = this.startHostPosition.add(delta);
            this.listeners.onDragMoveListeners.emit(currentHostPosition);
            this.listeners.onDragEndListeners.emit(currentHostPosition);
        } else {
            if (this.pressed) {
                this.listeners.onClickListeners.emit(this.startHostPosition);
            }
        }

        this.pressed = false;
        this.started = false;
        this.startHostPosition = Vector2.INVALID_VECTOR2;
        this.startPointerPosition = Vector2.INVALID_VECTOR2;
        this.moved = false;
    };

    onContainerLeave = () => {
        this.listeners.onDragMoveListeners.emit(this.startHostPosition);
        this.listeners.onDragEndListeners.emit(this.startHostPosition);

        this.pressed = false;
        this.started = false;
        this.startHostPosition = Vector2.INVALID_VECTOR2;
        this.startPointerPosition = Vector2.INVALID_VECTOR2;
        this.moved = false;
    };

}