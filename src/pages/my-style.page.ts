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
import { mamk_math, sleep } from '@istrugatskiy/mamk-utils';
import { animate, fadeIn as fade_in, fadeOut as fade_out } from '@lit-labs/motion';

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
                grid-template: 'content content' 1fr / 1fr;
                grid-gap: 20px;
                margin: 10px auto;
                max-width: 650px;
            }
            @media screen and (width <= 650px) {
                .grid {
                    grid-template: 'content' 1fr / 1fr;
                    max-width: 300px;
                    justify-items: center;
                    grid-gap: 0;
                }
                h1 {
                    display: none;
                }
                .char-container {
                    padding-left: 0;
                    padding-right: 0;
                }
                .right-bar {
                    padding-left: 0;
                    padding-right: 0;
                }
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
                border: none;
                transition: box-shadow 0.1s, border-color 0.3s;
                margin: 5px;
                box-shadow: 0 0 12px #000;
                border-radius: 10px;
                background-color: rgb(0 0 0 / 10%);
            }
            .arrow-button[disabled] {
                cursor: not-allowed;
                opacity: 0.5;
            }
            .arrow-button > * {
                pointer-events: none;
            }
            .arrow-button:active,
            .arrow-button:focus,
            .arrow-button[disabled] {
                box-shadow: none;
            }
            .right-bar {
                flex-flow: column wrap;
                margin-bottom: 10px;
            }
            .customize-options {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                align-items: center;
            }
            .preview-button {
                margin: 10px;
                border-color: transparent;
                border-width: 4px;
                border-style: solid;
                width: 75px;
                height: 75px;
                overflow: hidden;
            }
            .current-preview {
                box-shadow: none;
                border-color: black;
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

    private change_current_item = async (go_left: boolean) => {
        let current_item = go_left ? this.current_item - 1 : this.current_item + 1;
        await sleep(300);
        if (current_item < 0) {
            current_item = custom_options.length - 1;
        }
        if (current_item >= custom_options.length) {
            current_item = 0;
        }
        this.current_item = current_item;
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
                    <div class="content char-container">
                        <mamk-char data-style="animated-char" .character_config="${this.user_char}"></mamk-char>
                    </div>
                    <div class="inline-flex content">
                        <button @click=${this.change_item_left} class="arrow-button" ?disabled=${this.disabled}>
                            <mat-icon>arrow_back</mat-icon>
                        </button>
                        <p>${custom_options[this.current_item]}</p>
                        <button @click=${this.change_item_right} class="arrow-button" ?disabled=${this.disabled}>
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
                                    aria-label="${none_option ? `${current_option} option ${i + 1}` : `No ${current_option}`}"
                                    ?disabled=${this.disabled}
                                    ${animate({
                                        keyframeOptions: {
                                            duration: 300,
                                        },
                                        in: fade_in,
                                        out: fade_out,
                                    })}
                                >
                                    ${none_option ? html`<img src="${get_src(custom_options[this.current_item], five_items)}" alt=${`${current_option} option ${i}`} height="200" width="148" decoding="async" />` : html`<mat-icon>block</mat-icon> `}
                                </button>`;
                            })
                        }
                    </div>
                </div>
            </div>
        `;
    }
}
