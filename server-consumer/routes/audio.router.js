const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'audio_uploads/' });
const AWS = require('aws-sdk');


const sqs = new AWS.SQS({
 accessKeyId: process.env.AWS_ACCESS_KEY_ID,
 secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
 region: 'us-west-2'
});


router.post('/', upload.single('audio'), (req, res) => {
 const file = req.file;
 const audio = {
   originalname: file.originalname,
   mimetype: file.mimetype,
   filename: file.filename,
   path: file.path
 };
  const params = {
   MessageBody: JSON.stringify(audio),
   QueueUrl: 'https://sqs.us-west-2.amazonaws.com/123456789/audio_upload_queue'
 };
  sqs.sendMessage(params, (err, data) => {
   if (err) {
     res.status(500).json({ error: err });
   } else {
     res.status(200).json({ message: 'Audio file uploaded and sent to SQS' });
   }
 });
});
