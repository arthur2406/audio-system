app.post('/playlist', (req, res) => {
    const { name, audio_ids, icon } = req.body;
    if (!name || !audio_ids) {
      return res.status(400).json({ message: 'Name and audio_ids are required' });
    }
    const playlist = { name, audio_ids, icon };
    // send request to SQS
    sqs.sendMessage({
      QueueUrl: 'queue_url',
      MessageBody: JSON.stringify(playlist)
    }, (err, data) => {
      if (err) {
        return res.status(500).json({ message: 'Error creating playlist' });
      }
      return res.json({ message: 'Playlist created successfully' });
    });
   });
