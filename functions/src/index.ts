import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// Handles game initialization for teacher play screen
export const initGame = functions.runWith({ maxInstances: 3 }).https.onCall(async (data, context) => {
    if (context.auth && context.auth.token.email && context.auth.token.email.endsWith('mamkschools.org')) {
        const user = admin.database().ref(`userProfiles/${context.auth.token.uid}/`);
        const gameState = user.child('currentGameState/isInGame/');
        const isTeacher = user.child('currentGameState/isTeacher/');
        const gameCode = user.child('currentGameState/code');
        const snap = await gameState.once('value');
        if (snap.val() === true) {
            return {
                message: 'You are already in a game (try reloading the page, your client may have fallen out of sync with the server).',
                code: 400,
            };
        } else {
            // This works on the basis of a namespace like so, 12345/123
            // The system only listens to children of 12345/123
            // This decreases performance strain on firebase as well as decreasing the chance of collisions
            let failSafeCheck = false;
            let returnValue: string = '';
            const firstRand = Math.round(Math.random() * 99999)
                .toString()
                .padStart(5, '0');
            await admin
                .database()
                .ref(`currentGames/${firstRand}`)
                .transaction((currentValue) => {
                    if (currentValue) {
                        const list = Object.keys(currentValue);
                        let list2 = new Array();
                        for (let i = 0; i < 999; i++) {
                            if (!list.includes(i.toString())) {
                                list2.push(i.toString().padStart(3, '0'));
                            }
                        }
                        if (list2.length == 0) {
                            failSafeCheck = true;
                            return currentValue;
                        } else {
                            failSafeCheck = false;
                        }
                        const rand = list2[Math.floor(Math.random() * list2.length)];
                        returnValue = firstRand.toString() + rand;
                        currentValue[rand] = `actualGames/${context.auth!.uid}/`;
                    } else {
                        currentValue = {};
                        const rand = Math.round(Math.random() * 999);
                        currentValue[rand] = `actualGames/${context.auth!.uid}/`;
                        returnValue = firstRand.toString() + rand;
                    }
                    return currentValue;
                });
            if (!failSafeCheck) {
                await gameState.set(true);
                await isTeacher.set(true);
                await gameCode.set(returnValue);
                return {
                    message: returnValue,
                    code: 200,
                };
            } else {
                return {
                    message: 'Too many games exist (try again later).',
                    code: 500,
                };
            }
        }
    } else {
        return {
            message: 'Authentication check failed (maybe log out and log back in).',
            code: 401,
        };
    }
});
