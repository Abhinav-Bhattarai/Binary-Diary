import { RunServerClusters } from './worker-server.js';
const PORT = [8000, 9000, 10000, 11000];
for (let port of PORT) {
  RunServerClusters(port);
}