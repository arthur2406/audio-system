import { Connection, createConnection } from 'typeorm';
import { Playlist } from './entity/Playlist';
import { SQS } from 'aws-sdk';


const sqs = new SQS();


let connection: Connection;


const handleSQSMessage = async (message: SQS.Types.Message) => {
   try {
       // parse message body
       const { name, audioIds, icon } = JSON.parse(message.body);

       // create new playlist
       const playlist = new Playlist();
       playlist.name = name;
       playlist.audioIds = audioIds;
       playlist.icon = icon;

       // open connection to database
       connection = await createConnection();

       // save playlist to database
       await connection.manager.save(playlist);

       return { success: true, data: playlist };
   } catch (err) {
       console.log(err);
       return { success: false, error: err };
   } finally {
       if (connection) {
           await connection.close();
       }
   }
};



// Receive message from SQS
sqs.receiveMessage({
    QueueUrl: 'https://sqs.us-east-1.amazonaws.com/123456789/audio-requests'
   }, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    // Get audio file ID from message
    const audioId = data.Messages[0].audioId;
    // Get audio file from S3
    s3.getObject({
      Bucket: 'audio-bucket',
      Key: audioId
    }, (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      // Return audio file to client
      return data.Body;
    });
   });

createConnection().then(async connection => {
    const msg = await sqs.receiveMessage({
        QueueUrl: 'https://sqs.us-west-2.amazonaws.com/123456789012/queueName'
    }).promise();


    if(msg.Messages){
        const user = JSON.parse(msg.Messages[0].Body);
        const newUser = new User();
        newUser.username = user.username;
        newUser.email = user.email;
        newUser.password = user.password;

        await connection.manager.save(newUser);


        // delete the message from the queue
    await sqs.deleteMessage({
            QueueUrl: 'https://sqs.us-west-2.amazonaws.com/123456789012/queueName',
            ReceiptHandle: msg.Messages[0].ReceiptHandle
        }).promise();
    }
 });
