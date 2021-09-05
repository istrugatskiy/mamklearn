// Adopted from DragulaJS
// This rewrite was done with the goal of making DragulaJS more performant, easier to debug, and more in line with how the modern web works.
// Original project: https://github.com/bevacqua/dragula
import { Context, DragulaOptions, emitterMap, eventResponses, eventStore } from './dragulaTypes';
import { makeOptionsSafe } from './dragulaUtils';
const doc = document;
const { documentElement } = doc;

export const dragula = (initialContainers?: Element[], dragulaOptions?: DragulaOptions) => {
    const { moves, accepts, invalid, containers, isContainer, copy, copySortSource, revertOnSpill, removeOnSpill, direction, ignoreInputTextSelection, mirrorContainer, slideFactorX, slideFactorY } = makeOptionsSafe(initialContainers, dragulaOptions);
    let _mirror: HTMLElement | null; // mirror image
    let _source: HTMLElement | null; // source container
    let _item: HTMLElement | null; // item being dragged
    let _offsetX: number; // reference x
    let _offsetY: number; // reference y
    let _moveX: number; // reference move x
    let _moveY: number; // reference move y
    let _initialSibling: HTMLElement | null; // reference sibling when grabbed
    let _currentSibling: HTMLElement | null; // reference sibling now
    let _copy: HTMLElement | null; // item used for copying
    let _lastDropTarget: HTMLElement | null; // last container item was over
    let _grabbed: Context | null; // holds mousedown context until first mousemove
    const currentEvents: eventStore = {
        cancel: [],
        remove: [],
        shadow: [],
        over: [],
        out: [],
        drag: [],
        dragend: [],
        drop: [],
        cloned: [],
    };

    const state = {
        containers: containers,
        start: manualStart,
        end: end,
        cancel: cancel,
        remove: remove,
        destroy: () => {
            events(true);
            release();
        },
        canMove: canMove,
        dragging: false,
        on: <t extends keyof eventResponses>(type: t, handler: eventResponses[t]) => {
            // Typescript isn't very intelligent.
            // @ts-ignore
            currentEvents[type].push(handler);
            return state;
        },
        emit: <t extends keyof eventResponses>(type: t, ...args: emitterMap[t]) => {
            currentEvents[type].forEach((fn) => {
                // Typescript doesn't realize that the args will match the arguments that the function expects.
                // @ts-expect-error
                fn(...args);
                return state;
            });
        },
    };

    if (removeOnSpill === true) {
        state.on('over', spillOver).on('out', spillOut);
    }

    events();

    return state;

    function isValidContainer(el: HTMLElement) {
        return state.containers.includes(el) || isContainer(el);
    }

    function events(remove: boolean = false) {
        const op = remove ? 'remove' : 'add';
        touchy(documentElement, op, 'mousedown', grab);
        touchy(documentElement, op, 'mouseup', release);
    }

    function eventualMovements(remove: boolean = false) {
        const op = remove ? 'remove' : 'add';
        touchy(documentElement, op, 'mousemove', startBecauseMouseMoved);
    }

    function movements(remove: boolean = false) {
        documentElement[remove ? 'removeEventListener' : 'addEventListener']('click', preventGrabbed);
    }

    function preventGrabbed(event: Event) {
        if (_grabbed) {
            event.preventDefault();
        }
    }

    function grab(event: MouseEvent) {
        _moveX = event.clientX;
        _moveY = event.clientY;

        const ignore = whichMouseButton(event) !== 1 || event.metaKey || event.ctrlKey;
        if (ignore) {
            return; // we only care about honest-to-god left clicks and touch events
        }
        const item = event.target as HTMLElement;
        const context = canStart(item);
        if (!context) {
            return;
        }
        _grabbed = context;
        eventualMovements();
        if (event.type === 'mousedown') {
            if (isInput(item)) {
                // see also: https://github.com/bevacqua/dragula/issues/208
                item.focus(); // fixes https://github.com/bevacqua/dragula/issues/176
            } else {
                event.preventDefault(); // fixes https://github.com/bevacqua/dragula/issues/155
            }
        }
    }

    function startBecauseMouseMoved(event: MouseEvent) {
        if (!_grabbed) {
            return;
        }
        if (whichMouseButton(event) === 0) {
            release();
            return; // when text is selected on an input and then dragged, mouseup doesn't fire. this is our only hope
        }

        // truthy check fixes #239, equality fixes #207, fixes #501
        if (event.clientX !== void 0 && Math.abs(event.clientX - _moveX) <= slideFactorX && event.clientY !== void 0 && Math.abs(event.clientY - _moveY) <= slideFactorY) {
            return;
        }

        if (ignoreInputTextSelection) {
            const clientX = getCoord('clientX', event);
            const clientY = getCoord('clientY', event);
            const elementBehindCursor = doc.elementFromPoint(clientX, clientY);
            if (isInput(elementBehindCursor as HTMLElement)) {
                return;
            }
        }

        let grabbed = _grabbed; // call to end() unsets _grabbed
        eventualMovements(true);
        movements();
        end();
        start(grabbed);

        let offset = getOffset(_item);
        _offsetX = getCoord('pageX', event) - offset.left;
        _offsetY = getCoord('pageY', event) - offset.top;

        (_copy || _item)?.classList.add('gu-transit');
        renderMirrorImage();
        drag(event);
    }

    function canStart(item: HTMLElement | undefined): Context | undefined {
        if (state.dragging && _mirror) {
            return;
        }
        if (isValidContainer(item!)) {
            return; // don't drag container itself
        }
        const handle = item;
        while (getParent(item) && !isValidContainer(getParent(item) as HTMLElement)) {
            if (invalid(item, handle)) {
                return;
            }
            item = getParent(item); // drag target should be a top element
            if (!item) {
                return;
            }
        }
        const source = getParent(item);
        if (!source) {
            return;
        }
        if (invalid(item, handle)) {
            return;
        }

        const movable = moves(item, source, handle, item!.nextElementSibling as HTMLElement);
        if (!movable) {
            return;
        }

        return {
            item: item,
            source: source,
        };
    }

    function canMove(item: HTMLElement) {
        return !!canStart(item);
    }

    function manualStart(item: HTMLElement) {
        const context = canStart(item);
        if (context) {
            start(context);
        }
    }

    function start(context: Context) {
        if (!context?.item) return;
        if (isCopy(context.item, context.source)) {
            _copy = context.item.cloneNode(true) as HTMLElement;
            state.emit('cloned', _copy, context.item, 'copy');
        }

        _source = context.source;
        _item = context.item;
        _initialSibling = _currentSibling = context.item.nextElementSibling! as HTMLElement;

        state.dragging = true;
        state.emit('drag', _item, _source);
    }

    function end() {
        if (!state.dragging) {
            return;
        }
        let item = _copy || _item;
        drop(item, getParent(item as HTMLElement | undefined) as HTMLElement);
    }

    function ungrab() {
        _grabbed = null;
        eventualMovements(true);
        movements(true);
    }

    function release(event?: MouseEvent) {
        ungrab();
        if (!event) return;
        if (!state.dragging) {
            return;
        }
        const item = _copy || _item;
        const clientX = getCoord('clientX', event);
        const clientY = getCoord('clientY', event);
        const elementBehindCursor = getElementBehindPoint(_mirror, clientX, clientY);
        const dropTarget = findDropTarget(elementBehindCursor!, clientX, clientY);
        if (dropTarget && ((_copy && copySortSource) || !_copy || dropTarget !== _source)) {
            drop(item, dropTarget);
        } else if (removeOnSpill) {
            remove();
        } else {
            cancel();
        }
    }

    function drop(item: HTMLElement | null, target: HTMLElement | null) {
        const parent = getParent(item as HTMLElement | undefined);
        if (_copy && copySortSource && target === _source) {
            parent!.removeChild(_item!);
        }
        if (isInitialPlacement(target)) {
            state.emit('cancel', item!, _source!, _source!);
        } else {
            state.emit('drop', item!, target!, _source!, _currentSibling!);
        }
        cleanup();
    }

    function remove() {
        if (!state.dragging) {
            return;
        }
        let item = _copy || _item;
        let parent = getParent(item!);
        if (parent) {
            parent.removeChild(item!);
        }
        state.emit(_copy ? 'cancel' : 'remove', item!, parent!, _source!);
        cleanup();
    }

    function cancel(revert?: boolean) {
        if (!state.dragging) {
            return;
        }
        const reverts = revert ? revert : revertOnSpill;
        const item = _copy || _item;
        const parent = getParent(item!);
        const initial = isInitialPlacement(parent!);
        if (initial === false && reverts) {
            if (_copy) {
                if (parent) {
                    parent.removeChild(_copy);
                }
            } else {
                _source?.insertBefore(item as Node, _initialSibling);
            }
        }
        if (initial || reverts) {
            state.emit('cancel', item!, _source!, _source!);
        } else {
            state.emit('drop', item!, parent!, _source!, _currentSibling!);
        }
        cleanup();
    }

    function cleanup() {
        const item = _copy || _item;
        ungrab();
        removeMirrorImage();
        if (item) {
            item.classList.remove('gu-transit');
        }
        state.dragging = false;
        if (_lastDropTarget) {
            state.emit('out', item!, _lastDropTarget, _source!);
        }
        state.emit('dragend', item!);
        _source = _item = _copy = _initialSibling = _currentSibling = _lastDropTarget = null;
    }

    function isInitialPlacement(target: HTMLElement | null, s?: HTMLElement) {
        let sibling;
        if (s !== void 0) {
            sibling = s;
        } else if (_mirror) {
            sibling = _currentSibling;
        } else {
            sibling = (_copy || _item)?.nextElementSibling;
        }
        return target === _source && sibling === _initialSibling;
    }

    function findDropTarget(elementBehindCursor: HTMLElement, clientX: number, clientY: number) {
        const accepted = () => {
            const droppable = isValidContainer(target);
            if (droppable === false) {
                return false;
            }

            const immediate = getImmediateChild(target, elementBehindCursor);
            const reference = getReference(target, immediate!, clientX, clientY);
            let initial = isInitialPlacement(target, reference!);
            if (initial) {
                return true; // should always be able to drop it right back where it was
            }
            return accepts(_item!, target, _source!, reference!);
        };
        let target = elementBehindCursor;
        while (target && !accepted()) {
            target = getParent(target)!;
        }
        return target;
    }

    function drag(event: MouseEvent) {
        if (!_mirror) {
            return;
        }
        event.preventDefault();

        let clientX = getCoord('clientX', event);
        let clientY = getCoord('clientY', event);

        let x = clientX - _offsetX;
        let y = clientY - _offsetY;

        _mirror.style.left = x + 'px';
        _mirror.style.top = y + 'px';

        const item = _copy || _item;
        const elementBehindCursor = getElementBehindPoint(_mirror, clientX, clientY);
        let dropTarget = findDropTarget(elementBehindCursor as HTMLElement, clientX, clientY);
        let changed = dropTarget !== null && dropTarget !== _lastDropTarget;
        if (changed || dropTarget === null) {
            out();
            _lastDropTarget = dropTarget;
            over();
        }
        let parent = getParent(item!);
        if (dropTarget === _source && _copy && !copySortSource) {
            if (parent) {
                parent.removeChild(item!);
            }
            return;
        }
        let reference;
        let immediate = getImmediateChild(dropTarget, elementBehindCursor);
        if (immediate !== null) {
            reference = getReference(dropTarget, immediate, clientX, clientY);
        } else if (revertOnSpill === true && !_copy) {
            reference = _initialSibling;
            dropTarget = _source!;
        } else {
            if (_copy && parent) {
                parent.removeChild(item!);
            }
            return;
        }
        if ((reference === null && changed) || (reference !== item && reference !== item?.nextElementSibling)) {
            _currentSibling = reference;
            dropTarget.insertBefore(item as Node, reference);
            state.emit('shadow', item!, dropTarget, _source!);
        }
        function over() {
            if (changed) {
                state.emit('over', item!, _lastDropTarget!, _source!);
            }
        }
        function out() {
            if (_lastDropTarget) {
                state.emit('out', item!, _lastDropTarget, _source!);
            }
        }
    }

    function spillOver(el: HTMLElement) {
        el.classList.add('gu-hide');
    }

    function spillOut(el: HTMLElement) {
        if (state.dragging) {
            el.classList.add('gu-hide');
        }
    }

    function renderMirrorImage() {
        if (_mirror) {
            return;
        }
        const rect = _item?.getBoundingClientRect();
        _mirror = _item?.cloneNode(true) as HTMLElement;
        _mirror.style.width = getRectWidth(rect) + 'px';
        _mirror.style.height = getRectHeight(rect) + 'px';
        _mirror.classList.remove('gu-transit');
        _mirror.classList.add('gu-mirror');
        mirrorContainer.appendChild(_mirror);
        touchy(documentElement, 'add', 'mousemove', drag);
        mirrorContainer.classList.add('gu-unselectable');
        state.emit('cloned', _mirror, _item!, 'mirror');
    }

    function removeMirrorImage() {
        if (_mirror) {
            mirrorContainer?.classList.remove('gu-unselectable');
            touchy(documentElement, 'remove', 'mousemove', drag);
            getParent(_mirror)!.removeChild(_mirror);
            _mirror = null;
        }
    }

    function getImmediateChild(dropTarget: HTMLElement, target: HTMLElement | null) {
        let immediate = target;
        while (immediate !== dropTarget && getParent(immediate!) !== dropTarget) {
            immediate = getParent(immediate!) as HTMLElement;
        }
        if (immediate === documentElement) {
            return null;
        }
        return immediate;
    }

    function getReference(dropTarget: HTMLElement, target: HTMLElement, x: number, y: number) {
        const outside = () => {
            // slower, but able to figure out any position
            const len = dropTarget.children.length;
            for (let i = 0; i < len; i++) {
                let el = dropTarget.children[i];
                let rect = el.getBoundingClientRect();
                if (horizontal && rect.left + rect.width / 2 > x) {
                    return el as HTMLElement;
                }
                if (!horizontal && rect.top + rect.height / 2 > y) {
                    return el as HTMLElement;
                }
            }
            return null;
        };

        const inside = () => {
            const resolve = (after: boolean) => (after ? target.nextElementSibling : target);

            // faster, but only available if dropped inside a child element
            let rect = target.getBoundingClientRect();
            if (horizontal) {
                return resolve(x > rect.left + getRectWidth(rect) / 2);
            }
            return resolve(y > rect.top + getRectHeight(rect) / 2);
        };

        const horizontal = direction === 'horizontal';
        const reference = target !== dropTarget ? inside() : outside();
        return reference as HTMLElement | null;
    }

    function isCopy(item: HTMLElement, container: HTMLElement) {
        return typeof copy === 'boolean' ? copy : copy(item, container);
    }
};

function touchy(el: HTMLElement, op: 'add' | 'remove', type: 'mouseup' | 'mousedown' | 'mousemove', fn: (event: MouseEvent) => void) {
    type eventType = `${typeof op}EventListener`;
    const touch: { [key: string]: string } = {
        mouseup: 'touchend',
        mousedown: 'touchstart',
        mousemove: 'touchmove',
    };
    const pointers: { [key: string]: string } = {
        mouseup: 'pointerup',
        mousedown: 'pointerdown',
        mousemove: 'pointermove',
    };
    if (window.navigator.pointerEnabled) {
        // Have to do type conversion to event because typeScript doesn't know event type.
        el[`${op}EventListener` as eventType](pointers[type], fn as (event: Event) => void);
    } else {
        el[`${op}EventListener` as eventType](touch[type], fn as (event: Event) => void);
        el[`${op}EventListener` as eventType](type, fn as (event: Event) => void);
    }
}

function whichMouseButton(event: MouseEvent) {
    if (event instanceof TouchEvent) {
        return event.touches.length;
    }
    return event.buttons;
}

function getOffset(el: HTMLElement | null) {
    const rect = el?.getBoundingClientRect();
    return {
        left: rect?.left! + getScroll('scrollLeft', 'pageXOffset'),
        top: rect?.top! + getScroll('scrollTop', 'pageYOffset'),
    };
}

function getScroll(scrollProp: 'scrollLeft' | 'scrollTop', offsetProp: 'pageXOffset' | 'pageYOffset') {
    if (typeof window[offsetProp] !== 'undefined') {
        return window[offsetProp];
    }
    if (documentElement.clientHeight) {
        return documentElement[scrollProp];
    }
    return doc.body[scrollProp];
}

function getElementBehindPoint(point: HTMLElement | null, x: number, y: number) {
    point?.classList.add('gu-hide');
    const el = doc.elementFromPoint(x, y);
    point?.classList.remove('gu-hide');
    return el as HTMLElement | null;
}
function getRectWidth(rect: DOMRect | undefined) {
    return rect!.width || rect!.right - rect!.left;
}
function getRectHeight(rect: DOMRect | undefined) {
    return rect!.height || rect!.bottom - rect!.top;
}
function getParent(el: HTMLElement | undefined): HTMLElement | undefined {
    return el!.parentNode === doc! ? undefined : (el!.parentNode as HTMLElement);
}
function isInput(el: HTMLElement | null) {
    const isEditable = (el: HTMLElement | undefined): boolean => {
        if (!el) {
            return false;
        } // no parents were editable
        if (el.contentEditable === 'false') {
            return false;
        } // stop the lookup
        if (el.contentEditable === 'true') {
            return true;
        } // found a contentEditable element in the chain
        return isEditable(getParent(el)); // contentEditable is set to 'inherit'
    };
    if (!el) return false;
    return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || isEditable(el);
}

function getEventHost(event: MouseEvent) {
    // on touchend event, we have to use `e.changedTouches`
    // see http://stackoverflow.com/questions/7192563/touchend-event-properties
    // see https://github.com/bevacqua/dragula/issues/34
    if (event instanceof TouchEvent) {
        if (event.targetTouches && event.targetTouches.length) {
            return event.targetTouches[0];
        }
        if (event.changedTouches && event.changedTouches.length) {
            return event.changedTouches[0];
        }
    }
    return event;
}

function getCoord(coord: 'pageX' | 'pageY' | 'clientX' | 'clientY', event: MouseEvent) {
    return getEventHost(event)[coord];
}
