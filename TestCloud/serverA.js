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

const s3BucketName = 'njit-cs-643';
const sqsQueueUrl= 'https://sqs.us-east-1.amazonaws.com/971444391045/imageQueue';


async function processImage() {
    const params = {
        Bucket: s3BucketName,
        MaxKeys: 10
    };

    try {
        const data = await s3.listObjectsV2(params).promise();

        for (const item of data.Contents) {
            const s3BucketObject = item.Key;

            const rekognitionParams = {
                Image: {
                    S3Object:{
                        Bucket: s3BucketName,
                        Name: s3BucketObject
                    },
                },
                MinConfidence: 90,
            };
            const detectionResult = await rekognition.detectLabels(rekognitionParams).promise();

            // Check if Car is detected with confidence > 90% // 
            const carDetected = detectionResult.Labels.some(label => label.Name === 'Car' && label.Confidence > 90);

            if(carDetected) {
                const sqsParams = {
                    MessageBody: JSON.stringify({ imageKey: s3BucketObject, id: uuidv4()}),
                    QueueUrl: sqsQueueUrl,
                };
                await sqs.sendMessage(sqsParams).promise();
                console.log('Message sent to the Queue for image: ', s3BucketObject);
            }
        }
    } catch (error) {
        console.log('Error: ', error);        
    }

    // Signal Message at the End of Proccessing 

const specialMessage = { imageKey: '-1', id: 'end-processing' };
const sqsParams = {
    MessageBody: JSON.stringify(specialMessage),
    QueueUrl: sqsQueueUrl, 
};

await sqs.sendMessage(sqsParams).promise();
console.log("No more images being processed!");
}

processImage();






































