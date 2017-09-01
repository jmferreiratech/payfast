import app from './config/custom-express';
import cluster from "cluster";
import os from "os";

const PORT = 3000;
const CPUS = os.cpus();

if (cluster.isMaster) {
    CPUS.forEach(cluster.fork);

    cluster.on('exit', worker => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    console.log(`Starting worker ${process.pid}`);
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
