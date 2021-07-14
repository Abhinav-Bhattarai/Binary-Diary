import os from 'os';
import cluster from 'cluster';
import { RunServerClusters } from './worker-server.js';
import { RunMasterServer } from './master-server.js';
const processor_count = os.cpus().length - 3;

if (cluster.isMaster) {
  RunMasterServer(processor_count);
} else {
  RunServerClusters();
};