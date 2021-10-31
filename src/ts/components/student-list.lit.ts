import { property, state } from 'lit/decorators.js';
import { html, css, LitElement } from 'lit';
import common from '../styles/commons.styles';
import { Unsubscribe } from '@firebase/util';
import { getDatabase, onValue, ref } from '@firebase/database';
import { getAuth } from '@firebase/auth';
import { actuallyStartGame, networkKickPlayer } from '../networkEngine';

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

    @state()
    private playerData: { [key: string]: { playerName: string; playerConfig: number[]; toBeRemoved?: boolean } } = {};

    @state()
    private displayCountdown = false;

    @state()
    private countdownNumber = 3;

    @state()
    private countdownAnim = 'scale-in';

    @state()
    private gameStarted = false;

    private kickedPlayers: string[] = [];

    private countdown() {
        this.displayCountdown = true;
        let iterator = 3;
        const interval = setInterval(() => {
            iterator--;
            this.countdownAnim = 'countdown-disappear';
            setTimeout(() => {
                this.countdownNumber = iterator;
                this.countdownAnim = 'scale-in';
            }, 300);
            if (iterator == 0) {
                this.displayCountdown = false;
                setTimeout(() => {
                    this.countdownAnim = 'countdown-disappear';
                }, 1000);
                clearInterval(interval);
            }
        }, 1000);
    }

    private personTracker: Unsubscribe | undefined;

    connectedCallback() {
        super.connectedCallback();
        const db = getDatabase();
        const auth = getAuth();
        const playersList = ref(db, `actualGames/${auth.currentUser!.uid}/players/`);
        this.personTracker = onValue(playersList, (snapshot) => {
            const players = (snapshot.val() || {}) as { [key: string]: { playerName: string; playerConfig: number[]; toBeRemoved?: boolean } };
            let playersRemoved = false;
            Object.keys(this.playerData).forEach((key) => {
                if (!players[key]) {
                    playersRemoved = true;
                    this.playerData[key].toBeRemoved = true;
                } else {
                    this.playerData[key].toBeRemoved = false;
                }
            });
            if (!playersRemoved) {
                this.kickedPlayers = [];
                this.playerData = players;
            } else {
                // Lit doesn't understand that this.playerData has changed, so we need to force rerender.
                this.playerData = { ...this.playerData };
                setTimeout(() => {
                    this.kickedPlayers = [];
                    this.playerData = players;
                }, 300);
            }
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.personTracker) {
            this.personTracker();
        }
    }

    private startGame() {
        this.gameStarted = true;
        Object.keys(this.playerData).forEach((key) => {
            this.playerData[key].toBeRemoved = true;
            this.kickedPlayers.push(key);
        });
        this.countdown();
    }

    private kickPlayer(event: Event) {
        const el = event.currentTarget as HTMLElement;
        const id = el.dataset.id!;
        if (!this.kickedPlayers.includes(id)) {
            this.kickedPlayers.push(id);
            networkKickPlayer(id);
        }
    }

    render() {
        return html`
            <div class="title" class="play-screen">
                <h1 class="scale-in game-code">Game Code: ${this.gameCode}</h1>
                <button class="button scale-in" @click=${this.startGame} ?disabled=${Object.keys(this.playerData).length < 1 || this.gameStarted}>Start Game</button>
                <div class="character-list">
                    ${Object.entries(this.playerData).map(([id, { playerName, playerConfig, toBeRemoved }]) => {
                        return html`<teacher-screen-player data-character="${JSON.stringify(playerConfig)}" data-name="${playerName}" ?data-disappear=${toBeRemoved} @click="${this.kickPlayer}" data-id="${id}"></teacher-screen-player>`;
                    })}
                </div>
                <div style="display: ${this.displayCountdown ? 'block' : 'none'}" class="countdown">
                    <h1 class="${this.countdownAnim}">${this.countdownNumber}</h1>
                </div>
            </div>
        `;
    }
}
