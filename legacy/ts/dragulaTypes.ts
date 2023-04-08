export type DragulaOptions = {
    containers?: HTMLElement[] | undefined;
    isContainer?: ((el?: HTMLElement) => boolean) | undefined;
    moves?: ((el?: HTMLElement, container?: HTMLElement, handle?: HTMLElement, sibling?: HTMLElement) => boolean) | undefined;
    accepts?: ((el?: HTMLElement, target?: HTMLElement, source?: HTMLElement, sibling?: HTMLElement) => boolean) | undefined;
    invalid?: ((el?: HTMLElement, target?: HTMLElement) => boolean) | undefined;
    direction?: string | undefined;
    copy?: ((el: HTMLElement, source: HTMLElement) => boolean) | boolean | undefined;
    copySortSource?: boolean | undefined;
    revertOnSpill?: boolean | undefined;
    removeOnSpill?: boolean | undefined;
    mirrorContainer?: HTMLElement | undefined;
    ignoreInputTextSelection?: boolean | undefined;
    slideFactorX?: number;
    slideFactorY?: number;
};

export type SafeDragulaOptions = {
    containers: HTMLElement[];
    isContainer: (el?: HTMLElement) => boolean;
    moves: (el?: HTMLElement, container?: HTMLElement, handle?: HTMLElement, sibling?: HTMLElement) => boolean;
    accepts: (el?: HTMLElement, target?: HTMLElement, source?: HTMLElement, sibling?: HTMLElement) => boolean;
    invalid: (el?: HTMLElement, target?: HTMLElement) => boolean;
    direction: string;
    copy: ((el: HTMLElement, source: HTMLElement) => boolean) | boolean;
    copySortSource: boolean;
    revertOnSpill: boolean;
    removeOnSpill: boolean;
    mirrorContainer: HTMLElement;
    ignoreInputTextSelection: boolean;
    slideFactorX: number;
    slideFactorY: number;
};

export type Context = {
    item: HTMLElement | undefined;
    source: HTMLElement;
};

type commonEventResponse = (element: HTMLElement, target: HTMLElement, source: HTMLElement) => void;

export type eventResponses = {
    cancel: commonEventResponse;
    remove: commonEventResponse;
    shadow: commonEventResponse;
    over: commonEventResponse;
    out: commonEventResponse;
    drag: (element: HTMLElement, source: HTMLElement) => void;
    dragend: (element: HTMLElement) => void;
    drop: (element: HTMLElement, target: HTMLElement, source: HTMLElement, sibling: HTMLElement) => void;
    cloned: (clone: HTMLElement, original: HTMLElement, type: 'mirror' | 'copy') => void;
};

export type eventStore = {
    cancel: commonEventResponse[];
    remove: commonEventResponse[];
    shadow: commonEventResponse[];
    over: commonEventResponse[];
    out: commonEventResponse[];
    drag: ((element: HTMLElement, source: HTMLElement) => void)[];
    dragend: ((element: HTMLElement) => void)[];
    drop: ((element: HTMLElement, target: HTMLElement, source: HTMLElement) => void)[];
    cloned: ((clone: HTMLElement, original: HTMLElement, type: 'mirror' | 'copy') => void)[];
};

type commonEmitterArgs = [element: HTMLElement, target: HTMLElement, source: HTMLElement];

export type emitterMap = {
    cancel: commonEmitterArgs;
    remove: commonEmitterArgs;
    shadow: commonEmitterArgs;
    over: commonEmitterArgs;
    out: commonEmitterArgs;
    drag: [element: HTMLElement, source: HTMLElement];
    dragend: [element: HTMLElement];
    drop: [element: HTMLElement, target: HTMLElement, source: HTMLElement, sibling: HTMLElement];
    cloned: [clone: HTMLElement, original: HTMLElement, type: 'mirror' | 'copy'];
};

export type DragulaJS = {
    containers: HTMLElement[];
    start: (item: HTMLElement) => void;
    end: () => void;
    cancel: (revert?: boolean | undefined) => void;
    remove: () => void;
    destroy: () => void;
    canMove: (item: HTMLElement) => boolean;
    dragging: boolean;
    on: <t extends keyof eventResponses>(type: t, handler: eventResponses[t]) => DragulaJS;
    emit: <t extends keyof eventResponses>(type: t, ...args: emitterMap[t]) => void;
};

export type leftTopOffsets = {
    left: number;
    top: number;
};
