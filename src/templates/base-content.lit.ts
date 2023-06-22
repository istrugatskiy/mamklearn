import { CSSResultGroup, LitElement, css } from 'lit';
import { property } from 'lit/decorators';

/**
 * A base button class that can be extended to create different types of buttons
 * as well as non button content.
 */
export abstract class base_content extends LitElement {
    static styles: CSSResultGroup = [
        css`
            :host {
                height: fit-content;
            }
            *[hidden] {
                display: none !important;
            }
            *:focus {
                outline: none;
            }
            p {
                color: white;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                font-size: 16px;
                margin: 5px;
                padding: 10px; /* Safari */ /* IE 10 and IE 11 */
                user-select: text;
                word-break: break-word;
            }
            .button,
            .content {
                appearance: none;
                background-color: white;
                border: 2px solid white;
                text-decoration: none;
                padding: 20px;
                border-radius: 30px;
                transform: scale(1);
                border-color: rgb(255 255 255 / 0%);
                color: black;
                text-align: center;
                font-family: 'Roboto Mono', monospace;
                font-size: 24px;
                transition: background-color 0.3s, border-radius 0.3s, color 0.3s, box-shadow 0.3s, transform 0.3s, width 0.3s, height 0.3s;
                box-shadow: 0 0 12px #000;
            }
            .button {
                cursor: pointer;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
            }
            .button > * {
                pointer-events: none;
            }
            .button:active {
                background-color: rgb(31 42 210 / 25%);
                border-radius: 12px;
                color: white;
                box-shadow: none;
            }
            .button:focus {
                background-color: rgb(31 42 210 / 25%);
                border-radius: 12px;
                color: white;
                box-shadow: none;
            }
            .button:disabled,
            :host([data-disabled]) .button {
                background-color: rgb(31 42 210 / 25%);
                border-radius: 12px;
                color: white;
                box-shadow: none;
                cursor: default;
            }
            @media (hover: hover) and (pointer: fine) {
                .button:hover {
                    background-color: rgb(31 42 210 / 25%);
                    border-radius: 12px;
                    color: white;
                }
            }
            @media screen and (width <= 900px) {
                .button,
                .content {
                    font-size: 24px;
                }
                p {
                    font-size: 14px;
                }
            }
        `,
    ];

    connectedCallback() {
        super.connectedCallback();
        if (!this.halt_ui || !this.resume_ui) return;
        window.addEventListener('mamk-halt-ui', this.halt_ui);
        window.addEventListener('mamk-resume-ui', this.resume_ui);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (!this.halt_ui || !this.resume_ui) return;
        window.removeEventListener('mamk-halt-ui', this.halt_ui);
        window.removeEventListener('mamk-resume-ui', this.resume_ui);
    }

    abstract halt_ui?: () => void;

    abstract resume_ui?: () => void;

    @property({ type: Boolean, reflect: true, attribute: 'data-disabled' })
    disabled = false;
}
