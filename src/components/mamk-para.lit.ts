import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

/**
 * A paragraph element that is styled for use on the mamklearn website.
 * @element mamk-para
 * @slot The content of the paragraph.
 */
@customElement('mamk-para')
export class mamk_para extends LitElement {
    static styles = [
        css`
            p {
                font-size: 16px;
                color: white;
                text-align: center;
                height: min-content;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
        `,
    ];

    protected render() {
        return html`<p><slot></slot></p>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'mamk-para': mamk_para;
    }
}
