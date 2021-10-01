import * as functions from 'firebase-functions';
import { database, initializeApp } from 'firebase-admin';
import { google } from '@google-cloud/tasks/build/protos/protos';

initializeApp();

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
export const initGame = functions.runWith({ maxInstances: 10 }).https.onCall(async (data, context) => {
    if (data && (typeof data === 'string' || data instanceof String)) {
        if (
            context.auth &&
            context.auth.token.email &&
            (/.*@mamkschools.org$/.test(context.auth.token.email) || /.*@student.mamkschools.org$/.test(context.auth.token.email) || /.*@mamklearn.com$/.test(context.auth.token.email) || context.auth.token.email == 'ilyastrug@gmail.com')
        ) {
            const db = database();
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

// Handles players leaving the game
export const leaveGame = functions.runWith({ maxInstances: 10 }).https.onCall(async (data, context) => {
    if (
        context.auth &&
        context.auth.token.email &&
        (/.*@mamkschools.org$/.test(context.auth.token.email) || /.*@student.mamkschools.org$/.test(context.auth.token.email) || /.*@mamklearn.com$/.test(context.auth.token.email) || context.auth.token.email == 'ilyastrug@gmail.com')
    ) {
        const db = database();
        const user = db.ref(`userProfiles/${context.auth.uid}/`);
        const gameState = user.child('currentGameState/');
        const snap = await gameState.once('value');
        if (snap.val() && snap.val().isInGame) {
            if (snap.val().isTeacher) {
                const students = await db.ref(`actualGames/${context.auth.uid}/players/`).once('value');
                if (students.val()) {
                    const studentKeys = Object.keys(students.val());
                    for (let i = 0; i < studentKeys.length; i++) {
                        await db.ref(`userProfiles/${studentKeys[i]}/currentGameState`).set(null);
                    }
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

// Handles students joining the game.
export const joinGameStudent = functions.runWith({ maxInstances: 10 }).https.onCall(async (data, context) => {
    if (typeof data !== 'string' || data.length !== 9 || !data.match(/^[0-9-]*$/)) {
        return {
            message: 'Malformed request sent from the client. You may be running an old version (try clearing your cache).',
            code: 400,
        };
    } else if (
        context.auth &&
        context.auth.token.email &&
        (/.*@mamkschools.org$/.test(context.auth.token.email) || /.*@student.mamkschools.org$/.test(context.auth.token.email) || /.*@mamklearn.com$/.test(context.auth.token.email) || context.auth.token.email == 'ilyastrug@gmail.com')
    ) {
        const db = database();
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

// This is for teacher kicking students.
export const kickPlayer = functions.runWith({ maxInstances: 10 }).https.onCall(async (data, context) => {
    if (typeof data !== 'string') {
        return {
            message: 'Malformed request sent from the client. You may be running an old version (try clearing your cache).',
            code: 400,
        };
    } else if (
        context.auth &&
        context.auth.token.email &&
        (/.*@mamkschools.org$/.test(context.auth.token.email) || /.*@student.mamkschools.org$/.test(context.auth.token.email) || /.*@mamklearn.com$/.test(context.auth.token.email) || context.auth.token.email == 'ilyastrug@gmail.com')
    ) {
        const db = database();
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

// For teacher starting game.
export const startGame = functions.runWith({ maxInstances: 10 }).https.onCall(async (data, context) => {
    if (
        context.auth &&
        context.auth.token.email &&
        (/.*@mamkschools.org$/.test(context.auth.token.email) || /.*@student.mamkschools.org$/.test(context.auth.token.email) || /.*@mamklearn.com$/.test(context.auth.token.email) || context.auth.token.email == 'ilyastrug@gmail.com')
    ) {
        const db = database();
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
            const players = Object.keys(playerList);
            for (let i = 0; i < players.length; i++) {
                const playerID = players[i];
                await db.ref(`actualGames/${context.auth!.uid}/players/${playerID}/currentQuestion`).set(playerObject);
                await db.ref(`actualGames/${context.auth!.uid}/players/${playerID}/currentQuestionNumber`).set(1);
                await db.ref(`actualGames/${context.auth!.uid}/leaderboards/${playerID}`).set({
                    currentQuestion: 1,
                    playerName: (values[i] as { playerName: string; playerConfig: number[] }).playerName,
                });
            }
            await db.ref(`actualGames/${context.auth.uid}/globalState/players`).set(values.length);
            await db.ref(`actualGames/${context.auth.uid}/globalState/playersTotal`).set(values.length);
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

// Synchronises time.
export const timeSync = functions.runWith({ maxInstances: 10 }).https.onCall(async (data, context) => {
    if (
        context.auth &&
        context.auth.token.email &&
        (/.*@mamkschools.org$/.test(context.auth.token.email) || /.*@student.mamkschools.org$/.test(context.auth.token.email) || /.*@mamklearn.com$/.test(context.auth.token.email) || context.auth.token.email == 'ilyastrug@gmail.com')
    ) {
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

export const submitQuestion = functions.runWith({ maxInstances: 10 }).https.onCall(async (data, context) => {
    if (
        context.auth &&
        context.auth.token.email &&
        (/.*@mamkschools.org$/.test(context.auth.token.email) || /.*@student.mamkschools.org$/.test(context.auth.token.email) || /.*@mamklearn.com$/.test(context.auth.token.email) || context.auth.token.email == 'ilyastrug@gmail.com')
    ) {
        if (typeof data === 'string' || typeof data === 'number') {
            const db = database();
            let hasGameEnded = false;
            const userState = await db.ref(`userProfiles/${context.auth.uid}/currentGameState`).once('value');
            if (!userState.val()?.isInGame || userState.val()?.isTeacher) {
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
            if ((await db.ref(`${location.val()}finalResults/${context.auth.uid}`).once('value')).val()) {
                return {
                    message: 'You have already completed all questions',
                    code: 500,
                };
            }
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
                const totalPlayers = (await db.ref(`${location.val()}globalState/playersTotal`).once('value')).val();
                const firstName = (context.auth!.token.name as string).split(' ')[0];
                const lastName = (context.auth!.token.name as string).split(' ')[1];
                // We use transactions here because increment didn't play nicely with it.
                let externalInput = 0;
                await db.ref(`${location.val()}globalState/players`).transaction((input) => {
                    if (typeof input === 'number') {
                        input--;
                        externalInput = input;
                    }
                    return input;
                });
                const userConfig = await db.ref(`userProfiles/${context.auth.uid}/charConfig`).once('value');
                await db.ref(`${location.val()}finalResults/${context.auth.uid}`).set({
                    place: totalPlayers - externalInput,
                    name: `${firstName} ${lastName.charAt(0)}.`,
                    playerConfig: userConfig.val(),
                });
                await db.ref(`${location.val()}leaderboards/${context.auth.uid}`).remove();
                const shouldGameEnd = (await db.ref(`${location.val()}globalState/players`).once('value')).val() <= 0;
                const { CloudTasksClient } = await import('@google-cloud/tasks');
                const client = new CloudTasksClient();
                if (!(await db.ref(`${location.val()}globalState/gameEnd`).once('value')).val() && !shouldGameEnd) {
                    await db.ref(`${location.val()}globalState/gameEnd`).set(Date.now());
                    const project = JSON.parse(process.env.FIREBASE_CONFIG!).projectId;
                    const queue = 'mamklearn-game-end';
                    const projectLocation = 'us-central1';
                    const functionName = 'handleGameEnd';
                    const url = `https://${projectLocation}-${project}.cloudfunctions.net/${functionName}`;
                    const serviceAccountEmail = 'temp43outof45@mamaroneck-learn.iam.gserviceaccount.com';
                    const payload = {
                        location: location.val(),
                        totalPlayers: totalPlayers,
                        gameCode: (userState.val().code as number).toString(),
                    };
                    const parent = client.queuePath(project, projectLocation, queue);
                    const task = {
                        httpRequest: {
                            httpMethod: 'POST',
                            url,
                            oidcToken: {
                                serviceAccountEmail,
                            },
                            body: Buffer.from(JSON.stringify(payload)).toString('base64'),
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        },
                        scheduleTime: {
                            seconds: 15 + Date.now() / 1000,
                        },
                    };
                    const [response] = await client.createTask({ parent, task } as google.cloud.tasks.v2.ICreateTaskRequest, { maxRetries: 3 });
                    await db.ref(`${location.val()}__internal__/name`).set(response.name);
                } else if (shouldGameEnd) {
                    const taskID = (await db.ref(`${location.val()}__internal__/name`).once('value')).val();
                    if (taskID && typeof taskID === 'string') {
                        await client.deleteTask({ name: taskID });
                    }
                    await gameEnd(location.val(), totalPlayers, (userState.val().code as number).toString());
                    hasGameEnded = true;
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
            if (!hasGameEnded) {
                await db.ref(`${location.val()}players/${context.auth!.uid}`).set(playerObject);
            }
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

export const handleGameEnd = functions.runWith({ maxInstances: 10 }).https.onRequest(async (req, res) => {
    const body = req.body as {
        location: string;
        totalPlayers: number;
        gameCode: string;
    };
    try {
        await gameEnd(body.location, body.totalPlayers, body.gameCode);
        await database().ref(`${body.location}__internal__/name`).set(null);
        res.send(200);
    } catch (e) {
        functions.logger.log(e);
        res.send(200);
    }
});

async function gameEnd(location: string, totalPlayers: number, gameCode: string) {
    const db = database();
    if ((await db.ref(`${location}players/`).once('value')).val()) {
        const sortArray = (input: { [key: string]: { currentQuestion: number; playerName: string } }) => {
            let tempArray: { key: string; currentQuestion: number; playerName: string }[] = [];
            for (const [key, value] of Object.entries(input)) {
                tempArray.push({
                    key: key,
                    currentQuestion: value.currentQuestion,
                    playerName: value.playerName,
                });
            }
            return tempArray.sort((a, b) => {
                const firstEl = a as { currentQuestion: number; playerName: string };
                const secondEl = b as { currentQuestion: number; playerName: string };
                return secondEl.currentQuestion - firstEl.currentQuestion;
            });
        };
        const leaderboards = await db.ref(`${location}leaderboards`).once('value');
        const userList = (await db.ref(`${location}players/`).once('value')).val() as { [key: string]: { playerName: string; playerConfig: number[] } };
        if (leaderboards.val()) {
            const sortedArray = sortArray(leaderboards.val());
            // Can't use foreach because it isn't asynchronous.
            for (let i = 0; i < sortedArray.length; i++) {
                const { playerName, key } = sortedArray[i];
                let finalInput = 0;
                await db.ref(`${location}globalState/players`).transaction((input) => {
                    input--;
                    finalInput = input;
                    return input;
                });
                const firstName = playerName.split(' ')[0];
                const lastName = playerName.split(' ')[1];
                await db.ref(`${location}finalResults/${key}`).set({
                    place: totalPlayers - finalInput,
                    name: `${firstName} ${lastName.charAt(0)}.`,
                    playerConfig: userList[key].playerConfig,
                });
                await db.ref(`${location}leaderboards/${key}`).remove();
            }
        }
        await db.ref(`${location}finalResults/hasRendered/`).set(true);
        const userListKeys = Object.keys(userList);
        for (let i = 0; i < userListKeys.length; i++) {
            await db.ref(`userProfiles/${userListKeys[i]}/currentGameState/`).set(null);
        }
        await db.ref(`currentGames/${gameCode.slice(0, 5)}/${gameCode.slice(5)}`).set(null);
        await db.ref(location).remove();
        await db.ref(`userProfiles/${location.replace('actualGames/', '')}currentGameState/`).set(null);
    }
}
