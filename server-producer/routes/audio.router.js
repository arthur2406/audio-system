const sqs = new AWS.SQS({region: 'us-west-2'});
app.get('/audio/:id', (req, res) => {
   const params = {
       QueueUrl: 'https://sqs.us-west-2.amazonaws.com/123456789/audio-requests',
       MessageBody: JSON.stringify({
           audioId: req.params.id,
           userId: req.headers.userid
       })
   };
   sqs.sendMessage(params, (err, data) => {
       if(err) {
           return res.status(500).json({error: 'Failed to send message to SQS'});
       }
       res.json({message: 'Audio request sent to SQS'});
   });
});


