// We use globals instead of imports because we don't want to load unnecessary code
export class globals {
    static quitQuizTeacher: () => void | null;
    static quitQuizStudent: () => void | null;
    static alreadyInGame: boolean = false;
    static isMain: boolean = false;
}
