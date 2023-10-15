import { customElement } from 'lit/decorators.js';
import { css, html } from 'lit';
import { base_content } from '../templates/base-content.lit';
import '../components/mamk-header.lit';
import '../components/button/link-button.lit';

/**
 * The play page where the user inputs the game code.
 */
@customElement('play-page')
export class play extends base_content {
    halt_ui = () => {
        this.disabled = true;
    };

    resume_ui = () => {
        this.disabled = false;
    };

    static styles = [
        base_content.styles,
        css`
            .input-button {
                cursor: text;
                margin-bottom: 20px;
            }
            link-button {
                width: 20px;
            }
            form {
                margin-bottom: 20px;
            }
        `,
    ];

    protected render() {
        return html`
            <mamk-header>Game Code:</mamk-header>
            <form>
                <input autocomplete="off" class="button input-button" minlength="8" maxlength="9" pattern="^[0-9-]*$" placeholder="Game Code" required title="valid game ID" />
                <link-button>Join</link-button>
            </form>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'play-page': play;
    }
}
