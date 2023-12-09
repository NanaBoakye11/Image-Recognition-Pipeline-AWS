const AWS = require('aws-sdk');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

AWS.config.update({
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key,
    region: 'us-east-1',
  });

const s3 = new AWS.S3();
const rekognition = new AWS.Rekognition();
const sqs = new AWS.SQS();

const queueUrl = 'https://sqs.us-east-1.amazonaws.com/971444391045/imageQueue';
const ebsVolumePath = '/home/ec2-user';
const resultsFilePath = `${ebsVolumePath}/results.txt`;


// Function to Monitor SQS queue // 

async function monitorQueue() {
    while (true) {
        const receiveParams = {
            QueueUrl: queueUrl,
            MaxNumberOfMessages: 1, 
            WaitTimeSeconds: 20,
        }; 

        try {
            const data = await sqs.receiveMessage(receiveParams).promise();

            if (data.Messages && data.Messages.length > 0) {
                const message = data.Messages[0];
                const MessageBody = JSON.parse(message.Body);

                if (MessageBody.id === 'end-processing') {
                    console.log('Termination signal received, Terminating!');
                    break;   
                }
                
                const imageKey = MessageBody.imageKey;
                const image = await s3.getObject({ Bucket: 'njit-cs-643', Key: imageKey}).promise();

                const textParams = {
                    Image: {
                        Bytes: image.Body,
                    },
                };


                const textResult = await rekognition.detectText(textParams).promise();

                if (textResult.TextDetections.length > 0) {
                    const text = textResult.TextDetections[0].DetectedText;
                    const index = MessageBody.id;

                    const resultLine = `Image Index: ${index}, Text: ${text}\n`;

                    // Check and create the directory if it doesn't exist
                    if (!fs.existsSync(ebsVolumePath)) {
                        fs.mkdirSync(ebsVolumePath);
                    }
                        // Then write to the file
                    // fs.appendFileSync(resultsFilePath, resultLine);
                    
                    fs.appendFileSync(resultsFilePath, resultLine);
                }

                await sqs.deleteMessage({ QueueUrl: queueUrl, ReceiptHandle: message.ReceiptHandle }).promise();
            } 
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

monitorQueue();
