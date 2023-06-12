import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

/**
 * A material icon element that is styled for use on the mamklearn website.
 * @element mat-icon
 * @slot A string representing the icon to display.
 */
@customElement('mat-icon')
export class mat_icon extends LitElement {
    static styles = [
        css`
            :host {
                display: inline-flex;
            }
            .material-symbols-outlined {
                /* stylelint-disable-next-line font-family-no-missing-generic-family-keyword */
                font-family: 'Material Symbols Outlined';
                font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48;
                user-select: none;
            }
        `,
    ];

    protected render() {
        return html`<span class="material-symbols-outlined"><slot></slot></span>`;
    }
}
