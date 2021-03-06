import axios from "axios";
import { POSTFETCH } from "../Container/LandingPage/interface";

interface Config {
  onComplete: (data: POSTFETCH) => void;
  onError: (err: POSTFETCH) => void;
}

export const usePostRequest = (config: Config) => {
  const SendPOSTRequest = async (uri: string, POSTdata: object) => {
    const { data }: { data: POSTFETCH } = await axios.post(uri, POSTdata);
    if (data.error === false) {
      config.onComplete(data);
    } else {
      config.onError(data);
    }
  };

  return { SendPOSTRequest };
};
