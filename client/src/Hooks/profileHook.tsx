import { useEffect, useState } from "react";

const SplitProfilePath = (path: string) => {
  const pathFragments: Array<string> = path.split("/");
  return {
    id: pathFragments[2],
    owned: pathFragments[3],
  };
};

const useProfileParams = () => {
  const [params, setParams] = useState<{id: string, owned: string} | null>(null);
  useEffect(() => {
    const param = SplitProfilePath(window.location.pathname);
    setParams(param);
  }, // eslint-disable-next-line 
  [window.location.pathname]);

  return params;
};

export default useProfileParams;