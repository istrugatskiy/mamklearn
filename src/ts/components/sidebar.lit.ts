import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { base_content } from './templates/base-content.lit';
import { routes } from '../routing/routes';

// Fixes customElementRegistry being written to twice.
if (module.hot) {
    module.hot.dispose(() => {
        window.location.reload();
    });
}
@customElement('side-bar')
export class side_bar extends base_content {
    static styles = [
        base_content.styles,
        css`
            :host {
                display: block;
                /* background-color: white; */
                border-radius: 10px;
                margin: 10px;
                width: 100%;
                max-width: 350px;
            }
            h1 {
                font-size: 32px;
                color: white;
                font-family: Chelsea Market, cursive;
                text-align: center;
            }
            ul {
                padding: 20px;
            }
            li {
                list-style-type: none;
            }
        `,
    ];

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('mamk-route-change', this.on_route_change);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('mamk-route-change', this.on_route_change);
    }

    private on_route_change = () => {
        this.requestUpdate();
    };

    halt_UI = () => {
        this.disabled = true;
    };

    resume_UI = () => {
        this.disabled = false;
    };

    render() {
        return html`<h1>Mamklearn v2</h1>
            <ul>
                ${Object.entries(routes.layout)
                    .filter(([, value]) => value.show_user)
                    .map(([key, value]) => html`<li><sidebar-button ?data-disabled=${window.location.pathname == key || this.disabled} data-href="${key}">${value.title}</sidebar-button></li>`)}
            </ul>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'side-bar': side_bar;
    }
}
