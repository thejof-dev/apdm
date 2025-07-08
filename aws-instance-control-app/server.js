const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1',
});

const ec2 = new AWS.EC2();
const INSTANCE_ID = process.env.EC2_INSTANCE_ID;

app.post('/api/ec2/start', async (req, res) => {
  try {
    await ec2.startInstances({ InstanceIds: [INSTANCE_ID] }).promise();
    res.json({ status: 'starting' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ec2/stop', async (req, res) => {
  try {
    await ec2.stopInstances({ InstanceIds: [INSTANCE_ID] }).promise();
    res.json({ status: 'stopping' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/ec2/status', async (req, res) => {
  try {
    const data = await ec2.describeInstances({ InstanceIds: [INSTANCE_ID] }).promise();
    const instance = data.Reservations[0].Instances[0];
    const state = instance.State.Name;
    let name = '';
    if (instance.Tags) {
      const nameTag = instance.Tags.find(tag => tag.Key === 'Name');
      name = nameTag ? nameTag.Value : '';
    }
    res.json({ status: state, name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const BACKEND_PORT = process.env.BACKEND_PORT || 5001;
app.listen(BACKEND_PORT, () => console.log(`Server running on port ${BACKEND_PORT}`));
