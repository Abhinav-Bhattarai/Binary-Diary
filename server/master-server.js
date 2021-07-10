import cluster from "cluster";
export const RunMasterServer = (processor_count) => {
  for (let processor = 0; processor < processor_count; processor++) {
    cluster.fork();
  }
};
