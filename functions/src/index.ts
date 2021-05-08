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
                code: 400,
            };
        } else {
            // This works on the basis of a namespace like so, 12345/123
            // The system only listens to children of 12345/123
            // This decreases performance strain on firebase as well as decreasing the chance of collisions
            const returnValue = await admin
                .database()
                .ref(`currentGames/${Math.round(Math.random() * 99999)}`)
                .transaction((currentValue) => {
                    const list = Object.keys(currentValue);
                    let list2 = new Array();
                    for (let i = 0; i < 999; i++) {
                        if (!list.includes(`${i}`)) {
                            list2.push(i);
                        }
                    }
                    const rand = list2[Math.floor(Math.random() * list2.length)];
                    currentValue[rand] = `actualGames/${context.auth!.uid}/`;
                    return currentValue;
                });
            return {
                message: returnValue,
            };
        }
    } else {
        return {
            message: 'nice try lol',
            code: 401,
        };
    }
});
