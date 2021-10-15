import { LitElement, css, html } from 'lit-element';
import { property } from 'lit-element/decorators.js';

export class Player extends LitElement {
    static styles = css`
        .student {
            width: 300px;
            display: inline-block;
            height: 420px;
            margin-bottom: 25px;
            margin-left: 10px;
            margin-right: 10px;
        }
        .student-button {
            position: absolute;
            width: 300px;
            height: 420px;
        }
        .kick-player {
            transform: scale(0);
            position: absolute;
            top: 130px;
            transition: transform 0.3s;
        }
        .student-button > * {
            transition: transform 0.3s;
        }
        .student-button:hover > * {
            transform: scale(0);
        }
        .student-button:active > * {
            transform: scale(0);
        }
        .student-button:focus > * {
            transform: scale(0);
        }
        .student-button:hover > .kick-player {
            transform: scale(1);
        }
        .student-button:active > .kick-player {
            transform: scale(1);
            text-decoration: underline;
        }
        .student-button:focus > .kick-player {
            transform: scale(1);
            text-decoration: underline;
        }
    `;

    @property({
        attribute: 'data-character',
        type: Array,
    })
    characterConfig: number[] | undefined;

    @property({
        attribute: 'data-name',
        type: String,
    })
    name: string | undefined;

    render() {
        return html`
            <div class="student">
                <div class="button student-button titleTransitionBack" tabindex="0" role="button">
                    <p class="notifyTextChar">${this.name}</p>
                    <user-char data-style="teacher-screen" data-character="${this.characterConfig}"></user-char>
                    <div class="kick-player">Kick Player</div>
                </div>
            </div>
        `;
    }
}
