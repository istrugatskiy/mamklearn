/**
 * @license mamkEngine Copyright (c) 2021 Ilya Strugatskiy. All rights reserved.
 */
import { getAuth } from 'firebase/auth';

const functions = {
    location: 'https://us-central1-mamaroneck-learn.cloudfunctions.net/',
    token: '',
};

/**
 * Initializes the functions API, (it needs the users token which needs to be loaded).
 */
export const initFunctions = async () => {
    await getAuth()
        .currentUser!.getIdToken()
        .then((data) => {
            functions.token = data;
        });
};
/**
 * Creates a callable instance of the specified cloud function.
 *
 * @param {string} functionName The name of the cloud function you want to call.
 * @return {Promise<Any>}
 */
export const httpsCallable = (functionName: string) => {
    return async (payload?: any) => {
        const parsedPayload = {
            data: typeof payload === 'undefined' ? '' : payload,
        };
        const response = await fetch(functions.location + functionName, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${functions.token}`,
            },
            body: JSON.stringify(parsedPayload),
        });
        return new Promise<any>((resolve, reject) => {
            response
                .json()
                .then((val) =>
                    resolve({
                        data: val.result,
                    })
                )
                .catch((e) => {
                    reject(e);
                });
        });
    };
};
