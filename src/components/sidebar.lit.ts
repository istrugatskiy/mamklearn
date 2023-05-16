import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { base_content } from '../templates/base-content.lit';
import { routes } from '../routing/routes';
import './button/sidebar-button.lit';

// Fixes customElementRegistry being written to twice.
if (module.hot) {
    module.hot.dispose(() => {
        window.location.reload();
    });
}

/**
 * A sidebar element displayed on the left side of the screen. It generates content from the routes.
 * @element side-bar
 */
@customElement('side-bar')
export class side_bar extends base_content {
    // Probably will make fixed to right side of screen.
    // And remove the top bar when in mobile view.
    static styles = [
        base_content.styles,
        css`
            @keyframes slide-in-from-left {
                0% {
                    transform: translateX(-100%);
                }
                100% {
                    transform: translateX(0);
                }
            }
            :host {
                display: block;
                /* background-color: white; */
                border-radius: 10px;
                margin: 10px;
                width: 100%;
                max-width: 300px;
                animation: slide-in-from-left 0.3s cubic-bezier(0.29, 0.09, 0.07, 1.2);
                animation-fill-mode: forwards;
                background-color: rgba(0, 0, 0, 0.2);
                height: 100vh;
            }
            h1 {
                font-size: 32px;
                color: white;
                font-family: Chelsea Market, cursive;
                text-align: center;
                height: min-content;
            }
            ul {
                padding: 20px;
            }
            li {
                list-style-type: none;
            }
            .large-icon {
                font-size: 32px;
                text-decoration: none;
            }
        `,
    ];

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('mamk-route-change', this.on_route_change);
        this.mql.addEventListener('change', this.on_media_change);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('mamk-route-change', this.on_route_change);
        this.mql.removeEventListener('change', this.on_media_change);
    }

    private on_route_change = () => {
        this.requestUpdate();
    };

    private on_media_change = (event: MediaQueryListEvent) => {
        if (event.matches) {
            this.halt_ui();
        } else {
            this.resume_ui();
        }
    };

    private mql = window.matchMedia('(max-width: 1150px)');

    halt_ui = () => {
        this.disabled = true;
    };

    resume_ui = () => {
        this.disabled = false;
    };

    protected render() {
        return html`<mamk-header>Mamklearn v2</mamk-header>
            <ul>
                ${Object.entries(routes.layout)
                    .filter(([, value]) => value.show_user)
                    .map(
                        ([key, value]) =>
                            html`<li>
                                <sidebar-button ?data-disabled=${window.location.pathname == key || this.disabled} data-href="${key}"><mat-icon class="large-icon">${value.icon}</mat-icon>${value.title}</sidebar-button>
                            </li>`
                    )}
            </ul>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'side-bar': side_bar;
    }
}
