import axios from 'axios';

interface Config {
    onComplete: (data: object) => void
    onError: (err: object) => void
}

export const usePostRequest = (config: Config) => {
    const SendPOSTRequest = async(uri: string, POSTdata: object) => {
        const { data } = await axios.post(uri, POSTdata);
        if (JSON.stringify(data) !== JSON.stringify({error: true})) {
            config.onComplete(data);
        } else {
            config.onError(data);
        }
    }

    return { SendPOSTRequest };
};