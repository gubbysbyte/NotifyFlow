// server.ts will connect to RabbitMQ and start the server

import app from "./app.js";
import { config } from './config/index.js';
import rabbitmqclient from './rabbitmq/client.js'

const startServer = async () => {
    try{
        await rabbitmqclient.connect();
        app.listen(config.port, () => {
            console.log(`Producer API running on port ${config.port}`);
        });
    } catch(error) {
        console.error(`Failed to start server:`, error);
        process.exit(-1);
    }
};

startServer();