import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { base_content } from '../templates/base-content.lit';

/**
 * The page from which users can view and manage their quizzes.
 * @element my-quizzes-page
 */
@customElement('my-quizzes-page')
export class my_quizzes extends base_content {
    resume_ui?: () => void;
    halt_ui?: () => void;

    static styles = [
        base_content.styles,
        css`
            .content {
                font-size: 32px;
            }
        `,
    ];

    connectedCallback() {
        super.connectedCallback();
    }

    protected render() {
        return html``;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'my-quizzes-page': my_quizzes;
    }
}
