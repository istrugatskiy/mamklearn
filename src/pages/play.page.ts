import { customElement } from 'lit/decorators.js';
import { css, html } from 'lit';
import { base_content } from '../templates/base-content.lit';
import '../components/mamk-header.lit';
import '../components/button/link-button.lit';

@customElement('play-page')
export class play extends base_content {
    halt_UI = () => {
        this.disabled = true;
    };

    resume_UI = () => {
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
        `,
    ];

    render() {
        return html`<mamk-header>Game Code:</mamk-header>
            <form>
                <input autocomplete="off" class="button input-button" minlength="8" maxlength="9" pattern="^[0-9-]*$" placeholder="Game Code" required title="valid game ID" />
                <link-button>Join</link-button>
            </form>`;
    }
}
