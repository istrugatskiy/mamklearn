import { CSSResultGroup, LitElement, css } from 'lit';
import { property } from 'lit/decorators';

/**
 * A base button class that can be extended to create different types of buttons
 * as well as non button content.
 */
export abstract class base_content extends LitElement {
    static styles: CSSResultGroup = [
        css`
            *:focus {
                outline: none;
            }
            h1 {
                font-size: 32px;
                margin: 5px;
            }
            p {
                font-size: 16px;
                margin: 5px;
            }
            .button,
            .content {
                -webkit-appearance: none;
                background-color: white;
                border: 2px solid white;
                text-decoration: none;
                border-radius: 30px;
                transform: scale(1);
                border-color: rgba(255, 255, 255, 0);
                color: black;
                text-align: center;
                font-family: 'Roboto Mono', monospace;
                font-size: 64px;
                transition: background-color 0.3s, border-radius 0.3s, color 0.3s, box-shadow 0.3s, transform 0.3s, width 0.3s, height 0.3s;
                box-shadow: 0px 0px 12px #000000;
            }
            .button {
                cursor: pointer;
            }
            .button > * {
                pointer-events: none;
            }
            .button:active {
                background-color: rgba(31, 42, 210, 0.25);
                border-radius: 12px;
                color: white;
                box-shadow: none;
            }
            .button:focus {
                background-color: rgba(31, 42, 210, 0.25);
                border-radius: 12px;
                color: white;
                box-shadow: none;
            }
            .button:disabled,
            :host([data-disabled]) .button {
                background-color: rgba(31, 42, 210, 0.25);
                border-radius: 12px;
                color: white;
                box-shadow: none;
                cursor: default;
            }
            @media (hover: hover) and (pointer: fine) {
                .button:hover {
                    background-color: rgba(31, 42, 210, 0.25);
                    border-radius: 12px;
                    color: white;
                }
            }
        `,
    ];

    connectedCallback() {
        super.connectedCallback();
        if (!this.halt_UI || !this.resume_UI) return;
        window.addEventListener('mamk-halt-ui', this.halt_UI);
        window.addEventListener('mamk-resume-ui', this.resume_UI);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (!this.halt_UI || !this.resume_UI) return;
        window.removeEventListener('mamk-halt-ui', this.halt_UI);
        window.removeEventListener('mamk-resume-ui', this.resume_UI);
    }

    abstract halt_UI?: () => void;

    abstract resume_UI?: () => void;

    @property({ type: Boolean, reflect: true, attribute: 'data-disabled' })
    disabled = false;
}
