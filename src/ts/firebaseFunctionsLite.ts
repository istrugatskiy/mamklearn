import { getAuth } from 'firebase/auth';

const functions = {
    location: 'https://us-central1-mamaroneck-learn.cloudfunctions.net/',
    token: '',
};
export const initFunctions = () => {
    getAuth()
        .currentUser!.getIdToken()
        .then((data) => {
            functions.token = data;
        });
};

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
