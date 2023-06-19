import {Worker} from 'worker-threads';
import {cpus} from 'os';
import {join, dirname} from "path";
import {fileURLToPath} from 'url';

export const performCalculations = async () => {
    const number_of_cpus = cpus().length;
    const workers = [];
    for (let i = 0; i < number_of_cpus; i++) {
        workers[i] = new Promise((resolve, reject) => {
            const worker = new Worker(join(dirname(fileURLToPath(import.meta.url)), 'worker.js'),
                { workerData: 10 + i });
            worker.on('message', msg => {
                resolve(msg);
            });
            worker.on('error', msg => {
                reject(msg);
            });
        })
    }
    const result = await Promise.allSettled(workers);
    console.log(result);
};

performCalculations();
