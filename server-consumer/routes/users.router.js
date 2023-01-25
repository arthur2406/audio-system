var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/auth/register', async (req, res) => {
  try {
      const { email, password } = req.body;


      // validation
      if (!email || !password) {
          return res.status(400).json({ message: 'Email and password are required.' });
      }


      // send request to SQS
      const sqsParams = {
          MessageBody: JSON.stringify({ email, password }),
          QueueUrl: process.env.SQS_REGISTER_URL
      };
      await sqs.sendMessage(sqsParams).promise();


      return res.status(201).json({ message: 'Registration request sent successfully.' });
  } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error.' });
  }
});


router.post('/auth/login', async (req, res) => {
  try {
      const { email, password } = req.body;


      // validation
      if (!email || !password) {
          return res.status(400).json({ message: 'Email and password are required.' });
      }


      // send request to SQS
      const sqsParams = {
          MessageBody: JSON.stringify({ email, password }),
          QueueUrl: process.env.SQS_REGISTER_URL
      };
      await sqs.sendMessage(sqsParams).promise();


      return res.status(201).json({ message: 'Authorization request sent successfully.' });
  } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error.' });
  }
});


module.exports = router;
