import { css, LitElement } from 'lit-element/lit-element';
import common from '../styles/commons.styles';

export class Leaderboard extends LitElement {
    static get styles() {
        return [
            common,
            css`
                .render {
                }
            `,
        ];
    }
}
