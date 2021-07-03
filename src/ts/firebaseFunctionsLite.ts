/**
 * @license mamkEngine Copyright (c) 2021 Ilya Strugatskiy. All rights reserved.
 */

import { networkManager } from './networkEngine';

const location = 'https://us-central1-mamaroneck-learn.cloudfunctions.net/';

/**
 * Creates a callable instance of the specified cloud function.
 *
 * @param {string} functionName The name of the cloud function you want to call.
 * @return {Promise<Any>}
 */
export const httpsCallable = (functionName: string) => {
    return async (payload?: any) => {
        const token = await networkManager.authInstance.currentUser!.getIdToken();
        const parsedPayload = {
            data: typeof payload === 'undefined' ? '' : payload,
        };
        const response = await fetch(location + functionName, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
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
