import { html, LitElement, css } from 'lit';
import { property } from 'lit/decorators.js';

type options = 'Eyes' | 'Nose' | 'Mouth' | 'Shirt' | 'Arms';
type charStyles = 'animated-char' | 'teacher-screen' | 'student-screen' | 'third-place results-player' | 'second-place results-player' | 'first-place ' | '';
const customOptions = ['Eyes', 'Nose', 'Mouth', 'Shirt', 'Arms'];

export class Character extends LitElement {
    static styles = css`
        .animated-char {
            animation: char-anim 2s infinite;
            animation-timing-function: cubic-bezier(0.28, 0.84, 0.42, 1);
            z-index: -1;
            position: relative;
            margin-top: 94px;
            margin-bottom: 0px;
            height: 280px;
        }
        @keyframes char-anim {
            0% {
                transform: scale(1, 1) translateY(0) translateZ(0);
            }
            10% {
                transform: scale(1.1, 0.9) translateY(0) translateZ(0);
            }
            30% {
                transform: scale(0.9, 1.1) translateY(-100px) translateZ(0);
            }
            50% {
                transform: scale(1.05, 0.95) translateY(0);
            }
            57% {
                transform: scale(1, 1) translateY(-7px);
            }
            64% {
                transform: scale(1, 1) translateY(0);
            }
            100% {
                transform: scale(1, 1) translateY(0);
            }
        }
        .teacher-screen {
            position: absolute;
            top: 130px;
            left: 30px;
        }
        .teacher-screen > * {
            height: 305px;
        }
        .student-screen {
            z-index: -1;
            position: absolute;
            height: 150px;
            bottom: 50px;
            transform: translateX(calc(114px * var(--questionOffset)));
            transition: transform 0.3s;
        }
        .third-place {
            animation: third-place-anim 0.3s forwards;
            animation-delay: 1s;
        }
        .third-place > * {
            position: absolute;
            left: 210px;
            top: -55px;
        }
        @keyframes third-place-anim {
            from {
                visibility: visible;
                transform: scale(0) translateY(-50%) translateX(-50%);
            }
            to {
                visibility: visible;
                transform: scale(1) translateY(-50%) translateX(-50%);
            }
        }
        .results-player {
            animation-timing-function: cubic-bezier(0.29, 0.09, 0.07, 1.4);
            position: absolute;
            top: 50%;
            left: 50%;
            visibility: hidden;
        }
        .second-place {
            animation: second-place-anim 1s forwards;
            animation-delay: 2.25s;
            top: 0;
        }
        .second-place > * {
            position: absolute;
            left: -60px;
            top: -260px;
        }
        @keyframes second-place-anim {
            from {
                visibility: visible;
                transform: translateY(-50vh) translateX(-50%);
            }
            to {
                visibility: visible;
                transform: translateY(50vh) translateX(-50%);
            }
        }
        .first-place {
            position: relative;
            animation: first-place-anim 3s forwards;
            animation-delay: 4s;
            transform-origin: 50% 78%;
        }
        @keyframes first-place-anim {
            0% {
                visibility: visible;
                opacity: 0;
                transform: scale(1);
            }
            10% {
                opacity: 1;
                transform: scale(1);
            }
            100% {
                visibility: visible;
                transform: scale(2);
            }
        }
    `;

    @property({
        attribute: 'data-character',
        type: Array,
    })
    characterConfig: number[] | undefined;

    @property({
        attribute: 'data-style',
        type: String,
    })
    charStyle: charStyles = '';

    /**
     * Get the src of the image that corresponds to the currently configured character.
     * @param string data
     */
    private getSrc(property: options): string {
        const lookupIndex = customOptions.indexOf(property);
        if (lookupIndex == -1) {
            return 'img/qIcon-0.svg';
        }
        return this.characterConfig ? `img/${property}-${this.characterConfig[lookupIndex].toString()}.${lookupIndex == 4 ? 'svg' : 'png'}` : 'data:,';
    }

    render() {
        return html`
            <div class="${this.charStyle}">
                <img alt="your arms" src="${this.getSrc('Arms')}" style="position: absolute" width="250" height="337" />
                <img alt="your eyes" src="${this.getSrc('Eyes')}" style="position: absolute" width="250" height="337" />
                <img alt="your nose" src="${this.getSrc('Nose')}" style="position: absolute" width="250" height="337" />
                <img alt="your mouth" src="${this.getSrc('Mouth')}" style="position: absolute" width="250" height="337" />
                <img alt="your shirt" src="${this.getSrc('Shirt')}" style="position: absolute" width="250" height="337" />
                <img alt="your profile picture" src="img/base.svg" width="250" height="337" />
            </div>
        `;
    }
}
