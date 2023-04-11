import { customElement, state } from 'lit/decorators.js';
import { base_content } from '../components/templates/base-content.lit';
import { css, html } from 'lit';
import { onValue, ref } from 'firebase/database';
import { auth, db } from '../firebase-config';

@customElement('play-page')
export class play extends base_content {
    halt_UI = () => {
        this.disabled = true;
    };

    resume_UI = () => {
        this.disabled = false;
    };

    static styles = [base_content.styles, css``];

    char_listener?: () => void;

    @state()
    user_char: number[] = [0, 0, 0, 0, 0];

    connectedCallback() {
        super.connectedCallback();
        const user_char = ref(db, `userProfiles/${auth.currentUser?.uid}/charConfig`);
        this.char_listener = onValue(user_char, (snapshot) => {
            this.user_char = snapshot.val();
        });
    }

    render() {
        return html`<mamk-header>Game Text:</mamk-header>
        <form  id="joinQuizForm" name="joinQuizForm">
            <input autocomplete="off" class="titleTransitionBack formInput button" id="gameID" minlength="8" maxlength="9" name="gameID" pattern="^[0-9-]*$" placeholder="Game Code" required="" title="valid game ID"><br><br>
            <link-button  id="submitID" >Join </link-button></form>`;

    }
}
