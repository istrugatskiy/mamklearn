import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Handles game initialization for teacher play screen
export const initGame = functions.https.onCall(async (data, context) => {
    if (context.auth && context.auth.token.email && context.auth.token.email.endsWith('mamkschools.org')) {
        const user = admin.database().ref(`userProfiles/${context.auth.token.uid}/`);
        const gameState = user.child('currentGameState/isInGame/');
        const snap = await gameState.once('value');
        if (snap.val() === true) {
            return {
                message: 'You are already in a game.',
            };
        } else {
            return {
                message: 2763,
            };
        }
    } else {
        return {
            message: 'nice try lol',
            code: '401',
        };
    }
});
