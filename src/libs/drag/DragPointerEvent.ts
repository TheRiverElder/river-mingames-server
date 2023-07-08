import { MouseEvent, MouseEventHandler } from "react";
import { Nullable } from "../lang/Optional";
import ListenerManager from "../management/ListenerManager";
import Vector2 from "../math/Vector2";

export enum Button {
    LEFT,
    MIDDLE,
    RIGHT,
    UNKNOWN,
}

export interface DragPointerEvent {
    readonly localPosition: Vector2;
    readonly globalPosition: Vector2;
    readonly button: Button;
    readonly nativeEvent: PointerEvent;
}

export interface DragEventListeners {
    readonly onDragStartListeners: ListenerManager<Vector2>;
    readonly onDragMoveListeners: ListenerManager<Vector2>;
    readonly onDragEndListeners: ListenerManager<Vector2>;
    readonly onClickListeners: ListenerManager<Vector2>;
}

export function passOrCreate(listeners: Nullable<DragEventListeners>): DragEventListeners {
    return listeners || createDragEventListeners();
}

export function createDragEventListeners(): DragEventListeners {
    return {
        onDragStartListeners: new ListenerManager<Vector2>(),
        onDragMoveListeners: new ListenerManager<Vector2>(),
        onDragEndListeners: new ListenerManager<Vector2>(),
        onClickListeners: new ListenerManager<Vector2>(),
    };
}

export function createReactMouseListener(listeners: ListenerManager<DragPointerEvent> | undefined, doPreventDefault: boolean = false): MouseEventHandler | undefined {
    if (!listeners) return undefined;
    // console.log(listeners)
    return (event: MouseEvent) => {
        if (doPreventDefault) event.preventDefault();
        const e: DragPointerEvent = {
            nativeEvent: event.nativeEvent as PointerEvent,
            localPosition: new Vector2(event.nativeEvent.offsetX, event.nativeEvent.offsetY),
            globalPosition: new Vector2(event.nativeEvent.pageX, event.nativeEvent.pageY),
            button: getButton(event.button),
        };
        listeners.emit(e);
    };
}

function getButton(b: number): Button {
    switch (b) {
        case 0: return Button.LEFT;
        case 1: return Button.MIDDLE;
        case 2: return Button.RIGHT;
        default: return Button.LEFT;
    }
}