import axios from 'axios';
import { POSTFETCH } from '../Container/LandingPage/landingpage';

interface Config {
    onComplete: (data: POSTFETCH) => void
    onError: (err: POSTFETCH) => void
}

export const usePostRequest = (config: Config) => {
    const SendPOSTRequest = async(uri: string, POSTdata: object) => {
        const { data }: { data: POSTFETCH } = await axios.post(uri, POSTdata);
        if (JSON.stringify(data) !== JSON.stringify({error: true})) {
            config.onComplete(data);
        } else {
            config.onError(data);
        }
    }

    return { SendPOSTRequest };
};