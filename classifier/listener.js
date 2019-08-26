const amqplib = require('amqplib');
const execa = require('execa');

let connection;

amqplib
  .connect(`amqp://${process.env.RABBITMQ_HOST || 'localhost'}:${process.env.RABBITMQ_PORT || '5672'}`)
  .then((conn) => {
    connection = conn;
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
            let subprocess = await execa.node('run.js');
            console.log(`     ${subprocess.all.replace(/\n/g, '\n     ')}`);
          } catch (err) {
            console.log('Error execuring run.js script\n', err);
          }

          channel.ack(msg);
        });
      });
  });
