import { connect } from 'amqplib';

const connection = await connect('amqp://localhost'); // connect to rabbitMQ

const channel = await connection.createChannel(); // create a channel

const queue = 'messages';
const message = 'Hi Mom!';

await channel.assertQueue(queue, {durable: false}); // assert the queue

channel.sendToQueue(queue, Buffer.from(message)); // send the message
console.log(`Sent: ${message}`);

setTimeout(() => {
    connection.close();
    process.exit(0);
}, 500);

