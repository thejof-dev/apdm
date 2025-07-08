const AWS = require('aws-sdk');

const configureAWS = () => {
    AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    });
};

const createInstance = async (instanceParams) => {
    const ec2 = new AWS.EC2();
    try {
        const data = await ec2.runInstances(instanceParams).promise();
        return data.Instances;
    } catch (error) {
        throw new Error(`Error creating instance: ${error.message}`);
    }
};

module.exports = {
    configureAWS,
    createInstance
};