import { html, LitElement, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

// Typescript gets really confused by glob imports.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as images from './images/**';

export const custom_options: char_options[] = ['Eyes', 'Nose', 'Mouth', 'Shirt', 'Arms'];

/**
 * Get the src of the image that corresponds to the currently configured character.
 * @param property - The property to get the image for.
 * @param character_config -  The character configuration to get the image for.
 * @returns - The src of the image.
 */
export const get_src = (property: char_options, character_config?: number[]): string | URL => {
    const lookup_index = custom_options.indexOf(property);
    if (lookup_index == -1) {
        return new URL('/src/images/quiz-icon-0.svg', import.meta.url);
    }
    return character_config ? images[`${property.toLowerCase()}-${character_config[lookup_index].toString()}.${lookup_index == 4 ? 'svg' : 'png'}`] : new URL('data:,');
};

/**
 * The character component.
 * @element mamk-char
 */
@customElement('mamk-char')
export class mamk_char extends LitElement {
    static styles = css`
        :host {
            display: block;
            overflow: hidden;
        }
        img {
            position: absolute;
            /* Compensate for original images being off */
            bottom: -065px;
            left: 10px;
        }
        .animated-char {
            display: flex;
            animation: char-anim 2s infinite;
            animation-timing-function: cubic-bezier(0.28, 0.84, 0.42, 1);
            z-index: -1;
            height: 400px;
            width: 250px;
            align-self: flex-end;
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
        .base {
            position: block;
        }
    `;

    /**
     * The character configuration.
     * @example [0, 0, 0, 0, 0]
     */
    @property({
        attribute: 'data-character',
        type: Array,
    })
    character_config?: number[];

    protected render() {
        const base = new URL('./images/base.svg', import.meta.url).href;
        return html`
            <div class="animated-char main">
                ${custom_options.map((option) => html`<img alt="your ${option}" src="${get_src(option, this.character_config)}" style="z-index: ${option === 'Shirt' ? 1 : 0}" width="250" height="337" />`)}
                <img alt="your profile picture" src="${base}" decoding="async" class="base" width="250" height="337" />
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'mamk-char': mamk_char;
    }
}
