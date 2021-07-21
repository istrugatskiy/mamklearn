interface eventList {
    [key: string]: (event: Event) => void;
}
interface keyboardEventList {
    [key: string]: (event: KeyboardEvent) => void;
}

// Globals are used instead of window to prevent global scope pollution.
// TODO: Get this to be empty.
// This is just a temporary thing until the port to modules is complete.
export class globals {
    static quitQuizTeacher: () => void | null;
    static quitQuizStudent: () => void | null;
    static alreadyInGame: boolean = false;
    static isMain: boolean = false;
    static currentUserConfig: number[] = [0, 0, 0, 0, 0];
    static clickEvents: eventList;
    static clickIncludesEvents: eventList;
    static keyboardIncludesEvents: keyboardEventList;
    static submitEvents: eventList;
    static currentGameState: { isInGame: boolean; code: number; isTeacher: boolean; location: string };
}
