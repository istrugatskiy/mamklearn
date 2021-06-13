import { characterCount, getCaretCharacterOffsetWithin, setCaretPosition, throwExcept } from './utils';

// Handles the majority of events.
export const eventHandle = () => {
    window.addEventListener('click', (event) => {
        const keys = Object.keys(window.clickIncludesEvents);
        const eventTarget = (event.target! as HTMLElement).id;
        if (eventTarget in window.clickEvents) {
            window.clickEvents[eventTarget](event);
        }
        for (var i = 0; i < keys.length; i++) {
            if (eventTarget.includes(keys[i])) {
                window.clickIncludesEvents[keys[i]](event);
                break;
            }
        }
    });
    window.addEventListener('keydown', (event) => {
        if (event.key == 'Enter' || event.key == ' ') {
            event.code;
            const keys = Object.keys(window.keyboardIncludesEvents);
            const eventTarget = (event.target! as HTMLElement).id;
            for (var i = 0; i < keys.length; i++) {
                if (eventTarget.includes(keys[i])) {
                    window.keyboardIncludesEvents[keys[i]](event);
                    break;
                }
            }
        }
    });
    window.addEventListener('submit', function (event) {
        event.preventDefault();
        const eventTarget = (event.target! as HTMLElement).id;
        if (eventTarget in window.submitEvents) {
            window.submitEvents[eventTarget](event);
        }
    });
    window.addEventListener('input', (event) => {
        if ((event.target! as HTMLElement).matches('[contenteditable]')) {
            const target = event.target! as HTMLElement;
            let a69 = getCaretCharacterOffsetWithin(target);
            let a70 = String(target.textContent!.replace(/(\r\n|\r|\n)/, ''));
            const maxLength = target.dataset!.maxlength as unknown as number;
            target.textContent = a70;
            if (maxLength < target.textContent!.length) {
                target.textContent = target.dataset.revert as string;
                try {
                    setCaretPosition(target, a69 - 1);
                } catch {
                    setCaretPosition(target, target.textContent!.length);
                }
            } else {
                try {
                    setCaretPosition(target, a69);
                } catch {
                    setCaretPosition(target, target.textContent!.length);
                }
            }
            characterCount(target, target.dataset!.maxlength as string);
        }
    });
    window.addEventListener('beforeinput', (event) => {
        const target = event.target! as HTMLElement;
        if ((event.target! as HTMLElement).matches('[contenteditable]')) {
            target.dataset.revert = target.textContent as string;
        }
    });
    window.addEventListener('error', (error) => {
        throwExcept('@ScriptErrorHandler: ' + error.message);
    });
};
