import { property, state } from 'lit/decorators.js';
import { html, css, LitElement } from 'lit';
import common from '../styles/commons.styles';
import { Unsubscribe } from '@firebase/util';
import { getDatabase, onValue, ref } from '@firebase/database';
import { getAuth } from '@firebase/auth';
import { actuallyStartGame, networkKickPlayer } from '../networkEngine';
import { createLeaderboard, updateAudio } from '../make';

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
    private countdownNumber = '3';

    @state()
    private countdownAnim = 'scale-in';

    @state()
    private gameStarted = false;

    @state()
    private hideGameCode = false;

    private kickedPlayers: string[] = [];

    private countdown() {
        this.displayCountdown = true;
        let iterator = 3;
        const interval = setInterval(() => {
            iterator--;
            this.countdownAnim = 'countdown-disappear';
            setTimeout(() => {
                this.countdownNumber = iterator !== 0 ? iterator.toString() : 'GO!';
                this.countdownAnim = 'scale-in';
            }, 300);
            if (iterator == 0) {
                setTimeout(() => {
                    this.countdownAnim = 'countdown-disappear';
                    setTimeout(() => {
                        this.displayCountdown = false;
                    }, 300);
                }, 1000);
                clearInterval(interval);
            }
        }, 1000);
    }

    private personTracker: Unsubscribe | undefined;

    private stateTracker: Unsubscribe | undefined;

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
        this.stateTracker = onValue(ref(db, `actualGames/${auth.currentUser!.uid}/globalState`), (snapshot) => {
            const state = snapshot.val() as { isRunning: boolean; totalQuestions: number; gameEnd: number } | undefined;
            if (state?.isRunning) {
                this.startGame(true);
            }
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.personTracker?.();
        this.stateTracker?.();
    }

    private startGame(gameAlreadyStarted: boolean = false) {
        this.personTracker?.();
        this.stateTracker?.();
        this.gameStarted = true;
        Object.keys(this.playerData).forEach((key) => {
            this.playerData[key].toBeRemoved = true;
            this.kickedPlayers.push(key);
        });
        const transition = () => {
            setTimeout(() => {
                this.hideGameCode = true;
                setTimeout(() => {
                    this.countdown();
                }, 300);
            }, 300);
        };
        if (gameAlreadyStarted !== true) {
            actuallyStartGame(transition);
        } else {
            transition();
        }
        updateAudio('play');
        createLeaderboard();
        this.remove();
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
                <h1 class="${this.hideGameCode ? 'scale-out' : 'scale-in'} game-code">Game Code: ${this.gameCode}</h1>
                <button class="button ${this.hideGameCode ? 'scale-out' : 'scale-in'}" @click=${this.startGame} ?disabled=${Object.keys(this.playerData).length < 1 || this.gameStarted}>Start Game</button>
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
