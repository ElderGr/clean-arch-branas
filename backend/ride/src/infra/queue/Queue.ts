import amqp from 'amqplib'

async function main(){
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    // cria a fila e define que ela será persistida mesmo que o servidor seja reiniciado
    channel.assertQueue("example", { durable: true });

    const input = {
        a: 1,
        b: 2,
        c: 3
    }

    channel.sendToQueue("example", Buffer.from(JSON.stringify(input)));
}

main();