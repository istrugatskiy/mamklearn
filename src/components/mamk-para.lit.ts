import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

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

    render() {
        return html`<p><slot></slot></p>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'mamk-para': mamk_para;
    }
}
