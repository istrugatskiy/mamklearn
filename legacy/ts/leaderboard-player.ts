import { property } from 'lit/decorators.js';
import { css, html, LitElement } from 'lit-element/lit-element';
import common from '../styles/commons.styles';

export class Leaderboard extends LitElement {
    static get styles() {
        return [
            common,
            css`
                :host {
                    max-width: 600px;
                    animation: intro-anim 0.3s;
                    animation-delay: calc(0.1s * var(--c));
                    opacity: 0;
                    animation-fill-mode: forwards;
                    animation-timing-function: cubic-bezier(0.29, 0.09, 0.07, 1.4);
                }
                @keyframes intro-anim {
                    from {
                        transform: translateX(450px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `,
        ];
    }

    @property({
        type: Number,
        attribute: 'data-place',
    })
    place: number | undefined;

    @property({
        type: String,
        attribute: 'data-name',
    })
    name: string | undefined;

    private anim() {}

    render() {
        return html`${this.place}. ${this.name}`;
    }
}
