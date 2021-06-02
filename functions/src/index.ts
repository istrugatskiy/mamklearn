import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

interface questionObject {
    questionName: string;
    shortAnswer: boolean;
    timeLimit: string | boolean;
    Answers: [answer, answer, answer, answer];
}
interface answer {
    answer: string | null;
    correct: boolean;
}

// Handles game initialization for teacher play screen
export const initGame = functions.runWith({ maxInstances: 3 }).https.onCall(async (data, context) => {
    if (data && (typeof data === 'string' || data instanceof String)) {
        if (context.auth && context.auth.token.email && context.auth.token.email.endsWith('mamkschools.org')) {
            const user = admin.database().ref(`userProfiles/${context.auth.token.uid}/`);
            const gameState = user.child('currentGameState/isInGame/');
            const isTeacher = user.child('currentGameState/isTeacher/');
            const gameCode = user.child('currentGameState/code');
            const otherSnap = await user.child(`quizData/${data}`).once('value');
            if (!otherSnap.val() || typeof otherSnap.val().quizName !== 'string') {
                return {
                    message: 'Quiz does not exist.',
                    code: 501,
                };
            }
            const snap = await gameState.once('value');
            if (snap.val() === true) {
                const code = await gameCode.once('value');
                return {
                    message: code.val(),
                    code: 300,
                };
            } else {
                // This works on the basis of a namespace like so, 12345/123
                // The system only listens to children of 12345/123
                // This decreases performance strain on firebase as well as decreasing the chance of collisions
                await admin.database().ref(`actualGames/${context.auth!.uid}/quiz`).set(otherSnap.val());
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
                                    const temp = i.toString().padStart(3, '0');
                                    list2.push(temp);
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
                            const rand = Math.round(Math.random() * 999)
                                .toString()
                                .padStart(3, '0');
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
    } else {
        return {
            message: 'Malformed request sent from the client. You may be running an old version (try clearing your cache).',
            code: 400,
        };
    }
});

export const leaveGame = functions.runWith({ maxInstances: 1 }).https.onCall(async (data, context) => {
    if (context.auth && context.auth.token.email && context.auth.token.email.endsWith('mamkschools.org')) {
        const user = admin.database().ref(`userProfiles/${context.auth.token.uid}/`);
        const gameState = user.child('currentGameState/');
        const snap = await gameState.once('value');
        if (snap.val() && snap.val().isInGame) {
            if (snap.val().isTeacher) {
                const students = await admin.database().ref(`actualGames/${context.auth.token.uid}/players/`).once('value');
                if (students.val()) {
                    Object.keys(students.val()).forEach(async (student) => {
                        await admin.database().ref(`userProfiles/${student}/currentGameState`).set(null);
                    });
                }
                await admin
                    .database()
                    .ref(`currentGames/${snap.val().code.slice(0, 5)}/${snap.val().code.slice(5)}`)
                    .set(null);
                await admin.database().ref(`actualGames/${context.auth!.uid}/`).set(null);
            } else {
                const location = await admin
                    .database()
                    .ref(`currentGames/${snap.val().code.slice(0, 5)}/${snap.val().code.slice(5)}`)
                    .once('value');
                await admin.database().ref(`${location.val()}players/${context.auth!.uid}`).set(null);
                await admin.database().ref(`${location.val()}leaderboards/${context.auth!.uid}`).remove();
                functions.logger.log((await admin.database().ref(`${location.val()}leaderboards/`).once('value')).val());
                if (!(await admin.database().ref(`${location.val()}leaderboards/`).once('value')).val()) {
                    await admin
                        .database()
                        .ref(`currentGames/${snap.val().code.slice(0, 5)}/${snap.val().code.slice(5)}`)
                        .set(null);
                    await admin.database().ref(`actualGames/${location.val()}`).set(null);
                    await admin.database().ref(`userProfiles/${location.val()}/currentGameState/`).set(null);
                }
            }
            await admin.database().ref(`userProfiles/${context.auth!.uid}/currentGameState/`).set(null);
        } else {
            return {
                message: 'Client and server out of sync (try reloading the page).',
                code: 500,
            };
        }
        return {
            message: 'ok',
            code: 200,
        };
    } else {
        return {
            message: 'Authentication check failed (maybe log out and log back in).',
            code: 401,
        };
    }
});

export const joinGameStudent = functions.runWith({ maxInstances: 1 }).https.onCall(async (data, context) => {
    if (typeof data !== 'string' || data.length !== 9 || !data.match(/^[0-9-]*$/)) {
        return {
            message: 'Malformed request sent from the client. You may be running an old version (try clearing your cache).',
            code: 400,
        };
    } else if (context.auth && context.auth.token.email && context.auth.token.email.endsWith('mamkschools.org')) {
        const user = admin.database().ref(`userProfiles/${context.auth.token.uid}`);
        const gameState = user.child('currentGameState/isInGame');
        const gameCode = user.child('currentGameState/code');
        const gameLocation = admin.database().ref(`currentGames/${data.slice(0, 5)}/${data.slice(6)}`);
        const snap = await gameState.once('value');
        if (snap.val() === true) {
            const code = await gameCode.once('value');
            return {
                message: code.val(),
                code: 300,
            };
        } else {
            const gameVal = await gameLocation.once('value');
            if (gameVal.val()) {
                if ((await admin.database().ref(`${gameVal.val()}globalState/isRunning`).once('value')).val() === true) {
                    return {
                        message: 'Cannot join a game that is already in progress.',
                        code: 302,
                    };
                }
                const charConfig = await user.child('charConfig').once('value');
                await admin.database().ref(`${gameVal.val()}players/${context.auth!.uid}`).set({
                    playerName: context.auth.token.name,
                    playerConfig: charConfig.val(),
                });
                await gameState.set(true);
                await gameCode.set(data.slice(0, 5) + data.slice(6));
                return {
                    message: 'ok',
                    code: 200,
                };
            } else {
                return {
                    message: 'Game does not exist.',
                    code: 404,
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

export const kickPlayer = functions.runWith({ maxInstances: 1 }).https.onCall(async (data, context) => {
    if (typeof data !== 'string') {
        return {
            message: 'Malformed request sent from the client. You may be running an old version (try clearing your cache).',
            code: 400,
        };
    } else if (context.auth && context.auth.token.email && context.auth.token.email.endsWith('mamkschools.org')) {
        const currentValue = await admin.database().ref(`actualGames/${context.auth.uid}/players/${data}`).once('value');
        if (currentValue.val()) {
            await admin.database().ref(`actualGames/${context.auth.uid}/players/${data}`).set(null);
            await admin.database().ref(`userProfiles/${data}/currentGameState`).set(null);
            return {
                message: 'ok',
                code: 200,
            };
        } else {
            return {
                message: 'User not found (your client may have fallen out of sync with the server).',
                code: 500,
            };
        }
    } else {
        return {
            message: 'Authentication check failed (maybe log out and log back in).',
            code: 401,
        };
    }
});

export const startGame = functions.runWith({ maxInstances: 1 }).https.onCall(async (data, context) => {
    if (context.auth && context.auth.token.email && context.auth.token.email.endsWith('mamkschools.org')) {
        const playerList = (await admin.database().ref(`actualGames/${context.auth.uid}/players`).once('value')).val();
        if (playerList !== null) {
            const allQuestions = (await admin.database().ref(`actualGames/${context.auth.uid}/quiz/questionObjects/`).once('value')).val() as questionObject[];
            if (!allQuestions || !Array.isArray(allQuestions)) {
                return {
                    mesage: 'Quiz is malformed.',
                    code: 500,
                };
            }
            const firstQuestion = allQuestions[0];
            if (!firstQuestion || typeof firstQuestion.questionName !== 'string') {
                return {
                    mesage: 'Quiz is malformed.',
                    code: 500,
                };
            }
            if ((await (await admin.database().ref(`actualGames/${context.auth.uid}/globalState/isRunning`).once('value')).val()) === true) {
                return {
                    message: 'Game has already started (your client may have fallen out of sync with the server).',
                };
            }
            await admin.database().ref(`actualGames/${context.auth.uid}/globalState/isRunning`).set(true);
            await admin.database().ref(`actualGames/${context.auth.uid}/globalState/totalQuestions`).set(allQuestions.length);
            let safeAnswers: string[] = [];
            firstQuestion.Answers.forEach((answer) => {
                safeAnswers.push(answer.answer!);
            });
            const values = Object.values(playerList);
            const playerObject = {
                questionName: firstQuestion.questionName,
                answers: firstQuestion.shortAnswer ? [] : safeAnswers,
                startTime: firstQuestion.timeLimit ? Date.now() : -1,
                endTime: firstQuestion.timeLimit ? Date.now() + Number.parseInt(firstQuestion.timeLimit.toString()) * 1000 : -1,
            };
            Object.keys(playerList).forEach(async (playerID, index) => {
                await admin.database().ref(`actualGames/${context.auth!.uid}/players/${playerID}/currentQuestion`).set(playerObject);
                await admin.database().ref(`actualGames/${context.auth!.uid}/players/${playerID}/currentQuestionNumber`).set(1);
                await admin
                    .database()
                    .ref(`actualGames/${context.auth!.uid}/leaderboards/${playerID}`)
                    .set({
                        currentQuestion: 1,
                        playerName: (values[index] as { playerName: string; playerConfig: number[] }).playerName,
                    });
            });
            return {
                message: 'ok',
                code: 200,
            };
        } else {
            return {
                message: 'Game not found (your client may have fallen out of sync with the server)',
                code: 500,
            };
        }
    } else {
        return {
            message: 'Authentication check failed (maybe log out and log back in).',
            code: 401,
        };
    }
});

export const timeSync = functions.runWith({ maxInstances: 1 }).https.onCall(async (data, context) => {
    if (context.auth && context.auth.token.email && context.auth.token.email.endsWith('mamkschools.org')) {
        return {
            message: Date.now(),
            code: 200,
        };
    } else {
        return {
            message: 'Authentication check failed (maybe log out and log back in).',
            code: 401,
        };
    }
});
