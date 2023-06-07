import { customElement, state } from 'lit/decorators.js';
import { base_content } from '../templates/base-content.lit';
import { css, html } from 'lit';
import { onValue, ref, update } from 'firebase/database';
import { auth, db } from '@istrugatskiy/mamk-firewrap';
import '../components/mamk-header.lit';
import '../components/character/mamk-char.lit';
import '../components/button/mamk-button.lit';
import '../components/material-icon.lit';
import { custom_options, get_src } from '../components/character/mamk-char.lit';
import { mamk_math } from '@istrugatskiy/mamk-utils';

/**
 * The page that allows the user to customize their character.
 * @element my-style
 */
@customElement('my-style-page')
export class my_style extends base_content {
    halt_ui = () => {
        this.disabled = true;
    };

    resume_ui = () => {
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
                margin-left: 10px;
                margin-right: 10px;
            }
            .content {
                text-align: unset;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .grid {
                display: grid;
                grid-template-columns: 0.5fr 1fr;
                grid-template-rows: 1fr;
                grid-template-areas: 'content content';
                grid-gap: 20px;
                margin: 10px auto;
                max-width: 650px;
            }
            .inline-flex {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 10px auto;
                flex-direction: row;
            }
            .arrow-button {
                font-size: 30px;
                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 50px;
                height: 50px;
                background-color: white;
                border: none;
                transition: box-shadow 0.1s;
                margin: 5px;
                box-shadow: 0px 0px 12px #000000;
                border-radius: 10px;
            }
            .arrow-button[disabled] {
                cursor: not-allowed;
                opacity: 0.5;
            }
            .arrow-button > * {
                pointer-events: none;
            }
            .arrow-button:active,
            .arrow-button:focus {
                outline: none;
                box-shadow: none;
            }
            .right-bar {
                flex-direction: column;
                flex-wrap: wrap;
            }
            .customize-options {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                align-items: center;
            }
            .preview-button {
                width: 200px;
                height: 200px;
                margin: 10px;
                border-color: black;
                border-width: 0;
                border-style: solid;
                background-color: rgba(0, 0, 0, 0.1);
                width: 75px;
                height: 75px;
                overflow: hidden;
            }
            .current-preview {
                border-width: 4px;
                box-shadow: none;
            }
            .eyes,
            .nose,
            .mouth {
                align-items: start;
            }
            .shirt {
                align-items: center;
            }
            .shirt > img {
                transform: translateX(7px);
            }
            h1 {
                font-size: 28px;
            }
            .none-option {
                align-items: center;
            }
            .shirt-8 > img {
                transform: scale(0.7);
            }
            .arms > img {
                align-items: center;
                transform: scale(0.5) translateX(10px);
            }
        `,
    ];

    char_listener?: () => void;

    @state()
    user_char: number[] = [0, 0, 0, 0, 0];

    @state()
    current_item = 0;

    connectedCallback() {
        super.connectedCallback();
        const user_char = ref(db, `userProfiles/${auth.currentUser?.uid}/charConfig`);
        this.char_listener = onValue(user_char, (snapshot) => {
            this.user_char = snapshot.val() ?? [0, 0, 0, 0, 0];
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.char_listener?.();
    }

    private change_current_item = (go_left: boolean) => {
        this.current_item = go_left ? this.current_item - 1 : this.current_item + 1;
        if (this.current_item < 0) {
            this.current_item = custom_options.length - 1;
        }
        if (this.current_item >= custom_options.length) {
            this.current_item = 0;
        }
    };

    private change_item_left = () => {
        this.change_current_item(true);
    };

    private change_item_right = () => {
        this.change_current_item(false);
    };

    private select_item = (e: Event) => {
        const index = parseInt((e.target as HTMLButtonElement).dataset.index ?? '-1');
        this.user_char[this.current_item] = index;
        this.user_char = [...this.user_char];
        update(ref(db, `userProfiles/${auth.currentUser?.uid}/charConfig`), Object.assign({}, this.user_char));
    };

    protected render() {
        const current_option = custom_options[this.current_item];
        return html`
            <mamk-header>My Style</mamk-header>
            <div class="grid">
                <div>
                    <div class="content">
                        <mamk-char data-style="animated-char" .character_config="${this.user_char}"></mamk-char>
                    </div>
                    <div class="inline-flex content">
                        <button @click=${this.change_item_left} class="arrow-button">
                            <mat-icon>arrow_back</mat-icon>
                        </button>
                        <p>${custom_options[this.current_item]}</p>
                        <button @click=${this.change_item_right} class="arrow-button">
                            <mat-icon>arrow_forward</mat-icon>
                        </button>
                    </div>
                </div>
                <div class="content right-bar">
                    <h1>Choose Your ${current_option}</h1>
                    <div class="customize-options">
                        ${
                            // Map the numbers 0-9 to buttons containing the ten possible character options.
                            mamk_math.range(0, 9).map((i) => {
                                const five_items = mamk_math.range(0, 4);
                                five_items[this.current_item] = i;
                                const none_option = i !== 9 || current_option === 'Arms';
                                return html`<button
                                    data-index="${i}"
                                    @click=${this.select_item}
                                    class="arrow-button preview-button ${none_option ? current_option.toLowerCase() : 'none-option'} ${current_option.toLowerCase()}-${i} ${this.user_char[this.current_item] === i ? 'current-preview' : ''}"
                                >
                                    ${none_option ? html`<img src="${get_src(custom_options[this.current_item], five_items)}" height="200" width="148" />` : html`<mat-icon>block</mat-icon> `}
                                </button>`;
                            })
                        }
                    </div>
                </div>
            </div>
        `;
    }
}
