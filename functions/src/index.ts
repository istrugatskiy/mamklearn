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
interface studentQuestion {
    questionName: string;
    answers: string[];
    startTime: number;
    endTime: number;
}
interface tempSubmitQuestion {
    timePenaltyEnd: number | null;
    timePenaltyStart: number | null;
    playerConfig: [number, number, number, number, number];
    playerName: string;
    currentQuestion: studentQuestion;
    currentQuestionNumber: number;
}

// Handles game initialization for teacher play screen
export const initGame = functions.runWith({ maxInstances: 1 }).https.onCall(async (data, context) => {
    if (data && (typeof data === 'string' || data instanceof String)) {
        if (context.auth && context.auth.token.email && context.auth.token.email.endsWith('mamkschools.org')) {
            const db = admin.database();
            const user = db.ref(`userProfiles/${context.auth.uid}/`);
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
                await db.ref(`actualGames/${context.auth!.uid}/quiz`).set(otherSnap.val());
                let failSafeCheck = false;
                let returnValue: string = '';
                const firstRand = Math.round(Math.random() * 99999)
                    .toString()
                    .padStart(5, '0');
                await db.ref(`currentGames/${firstRand}`).transaction((currentValue) => {
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
        const db = admin.database();
        const user = db.ref(`userProfiles/${context.auth.uid}/`);
        const gameState = user.child('currentGameState/');
        const snap = await gameState.once('value');
        if (snap.val() && snap.val().isInGame) {
            if (snap.val().isTeacher) {
                const students = await db.ref(`actualGames/${context.auth.uid}/players/`).once('value');
                if (students.val()) {
                    Object.keys(students.val()).forEach(async (student) => {
                        await db.ref(`userProfiles/${student}/currentGameState`).set(null);
                    });
                }
                await db.ref(`currentGames/${snap.val().code.slice(0, 5)}/${snap.val().code.slice(5)}`).set(null);
                await db.ref(`actualGames/${context.auth!.uid}/`).set(null);
            } else {
                const location = await db.ref(`currentGames/${snap.val().code.slice(0, 5)}/${snap.val().code.slice(5)}`).once('value');
                await db.ref(`${location.val()}players/${context.auth!.uid}`).set(null);
                await db.ref(`${location.val()}leaderboards/${context.auth!.uid}`).remove();
                const otherSnap = (await db.ref(`${location.val()}globalState/isRunning`).once('value')).val();
                if (!(await db.ref(`${location.val()}leaderboards/`).once('value')).val() && otherSnap) {
                    await db.ref(`currentGames/${snap.val().code.slice(0, 5)}/${snap.val().code.slice(5)}`).set(null);
                    await db.ref(location.val()).set(null);
                    await db.ref(`userProfiles/${(location.val() as string).replace('actualGames/', '')}currentGameState/`).set(null);
                }
            }
            await db.ref(`userProfiles/${context.auth!.uid}/currentGameState/`).set(null);
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
        const db = admin.database();
        const user = db.ref(`userProfiles/${context.auth.uid}`);
        const gameState = user.child('currentGameState/isInGame');
        const gameCode = user.child('currentGameState/code');
        const gameLocation = db.ref(`currentGames/${data.slice(0, 5)}/${data.slice(6)}`);
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
                if ((await db.ref(`${gameVal.val()}globalState/isRunning`).once('value')).val() === true) {
                    return {
                        message: 'Cannot join a game that is already in progress.',
                        code: 302,
                    };
                }
                const charConfig = await user.child('charConfig').once('value');
                await db.ref(`${gameVal.val()}players/${context.auth!.uid}`).set({
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
        const db = admin.database();
        if ((await db.ref(`actualGames/${context.auth.uid}/globalState/isRunning`).once('value')).val()) {
            return {
                message: 'Cannot kick players after a game started.',
                code: 400,
            };
        }
        const currentValue = await db.ref(`actualGames/${context.auth.uid}/players/${data}`).once('value');
        if (currentValue.val()) {
            await db.ref(`actualGames/${context.auth.uid}/players/${data}`).set(null);
            await db.ref(`userProfiles/${data}/currentGameState`).set(null);
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
        const db = admin.database();
        const playerList = (await db.ref(`actualGames/${context.auth.uid}/players`).once('value')).val();
        if (playerList !== null) {
            const allQuestions = (await db.ref(`actualGames/${context.auth.uid}/quiz/questionObjects/`).once('value')).val() as questionObject[];
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
            if ((await db.ref(`actualGames/${context.auth.uid}/globalState/isRunning`).once('value')).val() === true) {
                return {
                    message: 'Game has already started (your client may have fallen out of sync with the server).',
                    code: 500,
                };
            }
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
                await db.ref(`actualGames/${context.auth!.uid}/players/${playerID}/currentQuestion`).set(playerObject);
                await db.ref(`actualGames/${context.auth!.uid}/players/${playerID}/currentQuestionNumber`).set(1);
                await db.ref(`actualGames/${context.auth!.uid}/leaderboards/${playerID}`).set({
                    currentQuestion: 1,
                    playerName: (values[index] as { playerName: string; playerConfig: number[] }).playerName,
                });
            });
            await db.ref(`actualGames/${context.auth.uid}/globalState/players`).set(values.length);
            await db.ref(`actualGames/${context.auth.uid}/globalState/totalQuestions`).set(allQuestions.length);
            await db.ref(`actualGames/${context.auth.uid}/globalState/isRunning`).set(true);
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

export const submitQuestion = functions.runWith({ maxInstances: 1 }).https.onCall(async (data, context) => {
    if (context.auth && context.auth.token.email && context.auth.token.email.endsWith('mamkschools.org')) {
        if (typeof data === 'string' || typeof data === 'number') {
            const db = admin.database();
            const userState = await db.ref(`userProfiles/${context.auth.uid}/currentGameState`).once('value');
            if (!userState.val().isInGame || userState.val().isTeacher) {
                return {
                    message: 'User is not in a game',
                    code: 500,
                };
            }
            let isCorrect = false;
            let timePenalty = 0;
            const location = await db.ref(`currentGames/${userState.val().code.slice(0, 5)}/${userState.val().code.slice(5)}`).once('value');
            let playerObject: tempSubmitQuestion = (await db.ref(`${location.val()}players/${context.auth!.uid}`).once('value')).val();
            const questionData = (await db.ref(`${location.val()}quiz/questionObjects/${playerObject.currentQuestionNumber - 1}`).once('value')).val() as questionObject;
            if (playerObject.timePenaltyEnd && playerObject.timePenaltyEnd > Date.now() + 1000) {
                return {
                    message: 'Time penalty still in effect',
                    code: 500,
                };
            } else {
                playerObject.timePenaltyEnd = null;
                playerObject.timePenaltyStart = null;
            }
            if (questionData) {
                if (questionData.shortAnswer) {
                    isCorrect = true;
                } else {
                    if (Number.isInteger(data) && questionData.Answers[data as number] && questionData.Answers[data as number].correct) {
                        isCorrect = true;
                    } else {
                        timePenalty = 10;
                    }
                }
            }
            const startVal = playerObject.currentQuestion.startTime;
            const endVal = playerObject.currentQuestion.endTime;
            if (Date.now() - 1000 > endVal && endVal && endVal != -1) {
                timePenalty += Math.floor((Date.now() - endVal) / 2 / 1000);
            }
            const nextQuestion = (await db.ref(`${location.val()}quiz/questionObjects/${playerObject.currentQuestionNumber}`).once('value')).val() as questionObject;
            if (isCorrect && nextQuestion) {
                let safeAnswers: string[] = [];
                nextQuestion.Answers.forEach((answer) => {
                    safeAnswers.push(answer.answer!);
                });
                const question = {
                    questionName: nextQuestion.questionName,
                    answers: nextQuestion.shortAnswer ? [] : safeAnswers,
                    startTime: nextQuestion.timeLimit ? Date.now() : -1,
                    endTime: nextQuestion.timeLimit ? Date.now() + Number.parseInt(nextQuestion.timeLimit.toString()) * 1000 : -1,
                };
                await db.ref(`${location.val()}leaderboards/${context.auth.uid}/currentQuestion`).set(playerObject.currentQuestionNumber + 1);
                playerObject.currentQuestion = question;
                playerObject.currentQuestionNumber++;
            } else if (isCorrect && !nextQuestion) {
                playerObject.currentQuestionNumber++;
                isCorrect = true;
                await db.ref(`${location.val()}globalState/players`).set(admin.database.ServerValue.increment(-1));
                const shouldGameEnd = (await db.ref(`${location.val()}globalState/players`).once('value')).val() <= 0;
                if (!(await db.ref(`${location.val()}globalState/gameEnd`).once('value')).val() && !shouldGameEnd) {
                    await db.ref(`${location.val()}globalState/gameEnd`).set(Date.now());
                } else if (shouldGameEnd) {
                    functions.logger.log('Game Ended');
                }
            }
            if (timePenalty > 0) {
                if (startVal !== -1 && !isCorrect) {
                    const difference = endVal - startVal;
                    playerObject.currentQuestion.startTime = timePenalty * 1000 + Date.now();
                    playerObject.currentQuestion.endTime = difference + timePenalty * 1000 + Date.now();
                }
                playerObject.timePenaltyStart = Date.now();
                playerObject.timePenaltyEnd = Date.now() + timePenalty * 1000;
            }
            await db.ref(`${location.val()}players/${context.auth!.uid}`).set(playerObject);
            return {
                message: isCorrect ? 'correct' : 'incorrect',
                timePenalty: timePenalty,
                code: 200,
            };
        } else {
            return {
                message: 'Malformed request sent from the client. You may be running an old version (try clearing your cache).',
                code: 400,
            };
        }
    } else {
        return {
            message: 'Authentication check failed (maybe log out and log back in).',
            code: 401,
        };
    }
});
