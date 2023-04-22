import cluster, { Cluster } from 'cluster';
import os from 'os';
import bodyParser from 'body-parser';
import { routeInitizlization } from '../modules/routes/root-routes.js';
import * as core from 'express-serve-static-core';

const port = 3800;

export function serverStarter(app: core.Express) {
  

  app.use(bodyParser.urlencoded({ extended: false }));

  // parse application/json
  app.use(bodyParser.json());

  routeInitizlization('components', app);

  if (cluster.isMaster) {    

    // TODO - forprod
    const cpus = os.cpus().length;

    for (let i = 0; i < cpus / cpus; i++) cluster.fork();

    cluster.on('exit', (worker: Cluster, code) => {
      app.listen(port, () => {        
        console.log(`Worker ${cluster.worker?.id} launched`);
      });
    });
  } else {
    app.listen(port, () => {
      console.log(`Worker ${cluster.worker?.id} launched`);
    });
  }
}
