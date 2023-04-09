import { customElement, state } from 'lit/decorators.js';
import { base_content } from '../templates/base-content.lit';
import { css, html } from 'lit';
import { onValue, ref } from 'firebase/database';
import { auth, db } from '../scripts/firebase-config';

@customElement('my-style')
export class my_style extends base_content {
    halt_UI = () => {
        this.disabled = true;
    };

    resume_UI = () => {
        this.disabled = false;
    };

    static styles = [
        base_content.styles,
        css`
            p {
                color: unset;
                font-family: unset;
            }
            .button {
                flex-direction: column;
            }
        `,
    ];

    char_listener?: () => void;

    @state()
    user_char: number[] = [0, 0, 0, 0, 0];

    connectedCallback() {
        super.connectedCallback();
        const user_char = ref(db, `userProfiles/${auth.currentUser?.uid}/charConfig`);
        this.char_listener = onValue(user_char, (snapshot) => {
            this.user_char = snapshot.val();
        });
    }

    render() {
        return html` <mamk-header>Home</mamk-header>
            <div class="button" tabindex="0">
                <p>Tap to customize...</p>
                <mamk-char data-style="animated-char" data-character="${JSON.stringify(this.user_char)}"></mamk-char>
                <p class="notifyTextChar" id="customType">
                    <a class="arrow left" href="javascript:void(0)" id="leftCustomizeArrow"> </a>
                    <a href="javascript:void(0)" id="customButtonChange">Eyes</a>
                    <a class="arrow right" href="javascript:void(0)" id="arrowCustomizeRight"> </a>
                </p>
                <img alt="Tap to change button..." width="195" height="90" id="customButtonChange2" src="img/tapToChange.svg" style="cursor: pointer; pointer-events: all" />
            </div>`;
    }
}
