import app from './app';
// import cluster from 'cluster';
// import os from 'os';
import { ENV } from './config/env';

const PORT = ENV.PORT || 3000;

// const numCPUs = os.cpus().length;

// if (process.env.NODE_ENV === 'development') {
//     if (cluster.isPrimary) {
//         console.log(`Primary ${process.pid} is running`);

//         for (let i = 0; i < numCPUs; i++) {
//             cluster.fork();
//         }

//         cluster.on('exit', (worker) => {
//             console.log(`Worker ${worker.process.pid} died. Restarting...`);
//             cluster.fork();
//         });
//     } else {
//         app.listen(PORT, () => {
//             console.log(`Worker ${process.pid} listening on port ${PORT}`);
//         });
//     }
// }
if (process.env.NODE_ENV === 'development') {

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
export default app;
