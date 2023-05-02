import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { base_content } from '../templates/base-content.lit';

@customElement('not-found-page')
export class not_found extends base_content {
    resume_ui?: (() => void) | undefined;
    halt_ui?: (() => void) | undefined;

    static styles = [
        base_content.styles,
        css`
            .content {
                font-size: 32px;
            }
        `,
    ];

    render() {
        return html` <div class="content">
            <h1>Resource not found!</h1>
            <p>The page '${window.location.pathname}' could not be found!</p>
        </div>`;
    }
}
