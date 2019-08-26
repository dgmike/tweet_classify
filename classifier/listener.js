const waitOn = require('wait-on');
const amqplib = require('amqplib');
const execa = require('execa');

const listener = async () => {
  amqplib
    .connect(`amqp://${process.env.RABBITMQ_HOST || 'localhost'}:${process.env.RABBITMQ_PORT || '5672'}`)
    .then((conn) => {
      return conn.createChannel();
    })
    .then((channel) => {
      channel.prefetch(1);
      channel.assertExchange(process.env.RABBITMQ_EXCHANGE, `${process.env.RABBITMQ_EXCHANGE_TYPE || 'fanout'}`, { durable: false });

      channel.assertQueue('fetch-tweets', { exclusive: false })
        .then((queue) => {
          channel.bindQueue(queue.queue, process.env.RABBITMQ_EXCHANGE);

          channel.consume(queue.queue, async (msg) => {
            console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());

            if (msg.fields.routingKey !== process.env.RABBITMQ_FETCH_FINISHED_ROUTING_KEY) {
              console.log('     skipped.')
              channel.ack(msg);
              return;
            }

            try {
              let subprocess = await execa.node('classify.js');
              console.log(`     ${subprocess.all.replace(/\n/g, '\n     ')}`);
            } catch (err) {
              console.log('Error execuring run.js script\n', err);
            }

            channel.ack(msg);
          });
        });
    });
};

const resources = [
  `tcp:${process.env.RABBITMQ_HOST || 'localhost'}:${process.env.RABBITMQ_PORT || '5672'}`,
  `tcp:${process.env.MONGODB_HOST || 'localhost'}:${process.env.MONGODB_PORT || '27017'}`,
];

const options = {
  resources,
  delay: 1000,      // initial delay in ms, default 0
  interval: 250,    // poll interval in ms, default 250ms
  timeout: 60000,   // timeout in ms, default Infinity
  tcpTimeout: 1000, // tcp timeout in ms, default 300ms
  window: 1000,     // stabilization time in ms, default 750ms
};

console.log('Waiting for external services...', JSON.stringify(options));
waitOn(options)
  .then(listener)
  .catch((err) => {
    console.error('Error waiting for external resources.\n', err);
  });
