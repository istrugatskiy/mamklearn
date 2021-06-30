import { getAuth } from '@firebase/auth';

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
        payload = {
            data: payload,
        };
        const response = await fetch(functions.location + functionName, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${functions.token}`,
            },
            body: JSON.stringify(payload),
        });
        return response.json();
    };
};
