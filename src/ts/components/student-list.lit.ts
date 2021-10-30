import { property, state } from 'lit/decorators.js';
import { html, css, LitElement } from 'lit';
import common from '../styles/commons.styles';
import { startGameTeacher } from '../make';
import { Unsubscribe } from '@firebase/util';
import { getDatabase, onValue, ref } from '@firebase/database';
import { getAuth } from '@firebase/auth';

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
    private playerList: { playerName: string; playerConfig: number[] }[] = [];

    @state()
    private playerIDs: string[] = [];

    @state()
    private displayCountdown = false;

    @state()
    private countdownNumber = 3;

    @state()
    private countdownAnim = 'scale-in';

    @state()
    private removalList: string[] = [];

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

    private personTracker: Unsubscribe | undefined;

    connectedCallback() {
        super.connectedCallback();
        const db = getDatabase();
        const auth = getAuth();
        const playersList = ref(db, `actualGames/${auth.currentUser!.uid}/players/`);
        this.personTracker = onValue(playersList, (snapshot) => {
            this.removalList = [];
            Object.values(this.playerIDs).forEach((id) => {
                this.removalList.push(id);
            });
            this.playerList = Object.values(snapshot.val() || []);
            this.playerIDs = Object.keys(snapshot.val() || []);
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.personTracker) {
            this.personTracker();
        }
    }

    private startGame() {
        startGameTeacher(false);
    }

    render() {
        return html`
            <div class="title" class="play-screen">
                <h1 class="scale-in game-code">Game Code: ${this.gameCode}</h1>
                <button class="button scale-in" @click=${this.startGame} ?disabled=${this.playerList.length < 1}>Start Game</button>
                <div class="character-list">
                    ${this.playerList.map(({ playerConfig, playerName }) => {
                        return html`<teacher-screen-player data-character="${JSON.stringify(playerConfig)}" data-name="${playerName}" data-disappear="false"></teacher-screen-player>`;
                    })}
                </div>
                <div style="display: ${this.displayCountdown ? 'block' : 'none'}" class="countdown">
                    <h1 class="${this.countdownAnim}">${this.countdownNumber}</h1>
                </div>
            </div>
        `;
    }
}
