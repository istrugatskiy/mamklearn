import { property, state } from 'lit/decorators.js';
import { html, css, LitElement } from 'lit';
import common from '../styles/commons.styles';
import { startGameTeacher } from '../make';

export class StudentList extends LitElement {
    static get styles() {
        return [
            common,
            css`
                .countdown {
                    font-size: 128px;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, 0);
                }
                .character-list {
                    text-align: center;
                    margin: 100px;
                }
                @media screen and (max-width: 1000px) {
                    .character-list {
                        margin: 10px;
                    }
                }
                .play-screen {
                    top: 10%;
                }
                .game-code {
                    -webkit-user-select: text;
                    -ms-user-select: text;
                    user-select: text;
                }
                .countdown-disappear {
                    transition: transform 0.3s;
                    transform: scale(0) rotate(360deg);
                }
            `,
        ];
    }

    @property({
        attribute: 'data-code',
        type: String,
    })
    gameCode: string = '*****-***';

    @property()
    playerList: { playerName: string; playerConfig: number[] }[] = [];

    @state()
    private displayCountdown = false;

    @state()
    private countdownNumber = 3;

    @state()
    private countdownAnim = 'scale-in';

    countdown() {
        this.displayCountdown = true;
        let iterator = 3;
        const interval = setInterval(() => {
            this.countdownNumber = iterator;
            this.countdownAnim = 'countdown-disappear';
            setTimeout(() => {
                this.countdownAnim = 'scale-in';
            }, 300);
            if (iterator == 1) {
                this.displayCountdown = false;
                setTimeout(() => {
                    this.countdownAnim = 'countdown-disappear';
                }, 1000);
                clearInterval(interval);
            }
            iterator--;
        }, 1000);
    }

    private startGame() {
        startGameTeacher(false);
    }

    render() {
        return html`
            <div class="title" class="play-screen">
                <h1 class="scale-in" class="game-code">Game Code: ${this.gameCode}</h1>
                <button class="button scale-in" @click=${this.startGame}>Start Game</button>
                <div class="character-list">
                    ${this.playerList.map(({ playerConfig, playerName }) => {
                        return html`<teacher-screen-player data-character="${playerConfig}" data-name="${playerName}"></teacher-screen-player>`;
                    })}
                </div>
                <div style="display: ${this.displayCountdown ? 'block' : 'none'}" class="countdown">
                    <h1 class="${this.countdownAnim}">${this.countdownNumber}</h1>
                </div>
            </div>
        `;
    }
}
