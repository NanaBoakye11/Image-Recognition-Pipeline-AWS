# Image-Recognition-Pipeline AWS

You have to build am image recognition pipeline in AWS, using two EC2 instances, S3, SQS, and Rekognition. The assignment must be done in Java on Amazon Linux VMs. For the rest of the description, you should refer to the figure below:

**Goal**: The purpose of this individual assignment is to learn how to use the Amazon AWS cloud platform and how to develop an AWS application that uses existing cloud services. Specifically, you will learn:
1. How to create VMs (EC2 instances) in the cloud.
2. How to use cloud storage (S3) in your applications.
3. How to communicate between VMs using a queue service (SQS).
4. How to program distributed applications in Java on Linux VMs in the cloud, and
5. How to use a machine learning service (AWS Rekognition) in the cloud.

![Project flow diagram](https://njit-bucket-image.s3.us-east-1.amazonaws.com/Screenshot%202023-10-29%20at%207.26.35%E2%80%AFPM.png?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLWVhc3QtMSJIMEYCIQDglzhV%2FGfoVzHIZvFPD6xXaO4Fmu8xQR6UgvK5vvC3MwIhANOkqSes2PeCo9p%2FofRo%2FBQP4djEqsv7TYdARLuPCfXnKogDCMv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQARoMMjMwNzYzMDcwNjE3Igy7uh0RJ1ESuj8MSCkq3AJGbcIIQ3pvHZDLtbYEz%2BcHRxonp17dVtKjraPygcTHJQSpAAUh5LvB1WAVVPiv7IV7UZWobajX8FPRrLEySbNi0po1Q5b%2BjtklHA2I3Fd5phRWb5HRzP0g%2B5BBipMQj2mD%2BWqaHuvm358WH4TQowTmwzjaihaOppyDivLIrXMwM45lK4RobTfOgb0HC%2BYb%2BXizpCukkRG4l3OaL0GPdPBw3tUx6AU8KBNw098cziUYf%2F9OPO5I51pqkfJ0HMonJk5h6qx2O9%2F4gzi%2FwvSPgoBG8xloAnWkTYzGdZwwqI%2F3T1C%2FWJXNKg2aF4pq3wqgFGP8trn%2BvM33FQT7qAML39P5DsLngGGxIKkW9iugTz7HlZDN%2BQq1J6nLgzq6%2B%2BkXHV1Q%2BrSi%2F6piWpVmWtSMiDU7BnEK61RxvOQ1Eo8UJra%2Fp29bxlqJRQY9ISF23y07kVzDfhPUhPxa9HgkU08w%2FZbPqwY6sgJxrm%2FRyYc%2BbtEdRAJrC34JYxrWegRMX4c58KQrQspKZL%2Fgfk4h3%2F865WS0cai5363NEuTu2F9vR45%2BhKo8y7mf%2F833pOrOPVjfA85oGU0fjLiGUkEjaZw2b5Z1PqzP5gT%2FauRawltuY9XSfYbW6LYkeHsDFk5X9dlpH6NGzYaxOIQ9%2BN8te%2FvmeAuJaCkltX3oMID31QPsf6SKiQkveBjsgl9b%2BSSmK08UJ6mhrdXzGsls4x7VV8AapDid4egvsrDGPBTIMalkatmbDcEyOQmG61O%2FBsvSyAHoTSi7X9ix2EX71yHVY7HY49Ku7QXEkAv2msUGxa2dIQW9MWRdbMT5bRAUtBQSJDRsdaxzKbB%2Buve4Apkqc2SUoUYa9ITEKSbekLKqM5k7rHnp54OKJKT1P%2BA%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20231209T025142Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIATLOUNASMRAUVEHK5%2F20231209%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=260f870a0382b22901762e12dbaabe09debee00bbcc548ebac72dc49a62ebc6c)

Your have to create 2 EC2 instances (EC2 A and B in the figure), with Amazon Linux AMI, that will work in parallel. Each instance will run a Java application. Instance A will read 10 images from an S3 bucket that we created (https://njit-cs-643.s3.us-east-1.amazonaws.com) and perform object detection in the images. When a car is detected using Rekognition, with confidence higher than 90%, the index of that image (e.g., 2.jpg) is stored in SQS. Instance B reads indexes of images from SQS as soon as these indexes become available in the queue, and performs text recognition on these images (i.e., downloads them from S3 one by one and uses Rekognition for text recognition). Note that the two instances work in parallel: for example, instance A is processing image 3, while instance B is processing image 1 that was recognized as a car by instance A. When instance A terminates its image processing, it adds index -1 to the queue to signal to instance B that no more indexes will come. When instance B finishes, it prints to a file, in its associated EBS, the indexes of the images that have both cars and text, and also prints the actual text in each image next to its index.


# Step 1

1. Login into AWS Vocareum portal to access Learner Lab. 
2. Click the 'Start Lab' button to spin up the AWS lab environment. Once the 'AWS' button go from red to green, the lab is ready for launch. 
3. Click 'AWS' to launch the AWS Mangement Console
4. Click 'AWS Details' to copy the access_key, secret_key, and session_token and paste it into your ~/.aws/credentials path. 

## Create two EC2 instances: 

1. Launch two Amazon Linux AMI instances on the AWS console.
2. Click "Launch instances" to create a new instance
3. Select "Amazon Linux 2 AMI" under AMI option
4. Use the same .pem key for both instances.
5. Configure the security group to allow incoming traffic on ports for SSH, HTTP, and HTTPS and select "My IP" to only allow traffic from your ip address. 
6. Leave the remaining settings as default
7. Select '2' as number of instances to create. (You can rename both instances after creation).

![Project flow diagram](https://njit-bucket-image.s3.us-east-1.amazonaws.com/Screenshot%202023-10-29%20at%207.26.35%E2%80%AFPM.png?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLWVhc3QtMSJIMEYCIQDglzhV%2FGfoVzHIZvFPD6xXaO4Fmu8xQR6UgvK5vvC3MwIhANOkqSes2PeCo9p%2FofRo%2FBQP4djEqsv7TYdARLuPCfXnKogDCMv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQARoMMjMwNzYzMDcwNjE3Igy7uh0RJ1ESuj8MSCkq3AJGbcIIQ3pvHZDLtbYEz%2BcHRxonp17dVtKjraPygcTHJQSpAAUh5LvB1WAVVPiv7IV7UZWobajX8FPRrLEySbNi0po1Q5b%2BjtklHA2I3Fd5phRWb5HRzP0g%2B5BBipMQj2mD%2BWqaHuvm358WH4TQowTmwzjaihaOppyDivLIrXMwM45lK4RobTfOgb0HC%2BYb%2BXizpCukkRG4l3OaL0GPdPBw3tUx6AU8KBNw098cziUYf%2F9OPO5I51pqkfJ0HMonJk5h6qx2O9%2F4gzi%2FwvSPgoBG8xloAnWkTYzGdZwwqI%2F3T1C%2FWJXNKg2aF4pq3wqgFGP8trn%2BvM33FQT7qAML39P5DsLngGGxIKkW9iugTz7HlZDN%2BQq1J6nLgzq6%2B%2BkXHV1Q%2BrSi%2F6piWpVmWtSMiDU7BnEK61RxvOQ1Eo8UJra%2Fp29bxlqJRQY9ISF23y07kVzDfhPUhPxa9HgkU08w%2FZbPqwY6sgJxrm%2FRyYc%2BbtEdRAJrC34JYxrWegRMX4c58KQrQspKZL%2Fgfk4h3%2F865WS0cai5363NEuTu2F9vR45%2BhKo8y7mf%2F833pOrOPVjfA85oGU0fjLiGUkEjaZw2b5Z1PqzP5gT%2FauRawltuY9XSfYbW6LYkeHsDFk5X9dlpH6NGzYaxOIQ9%2BN8te%2FvmeAuJaCkltX3oMID31QPsf6SKiQkveBjsgl9b%2BSSmK08UJ6mhrdXzGsls4x7VV8AapDid4egvsrDGPBTIMalkatmbDcEyOQmG61O%2FBsvSyAHoTSi7X9ix2EX71yHVY7HY49Ku7QXEkAv2msUGxa2dIQW9MWRdbMT5bRAUtBQSJDRsdaxzKbB%2Buve4Apkqc2SUoUYa9ITEKSbekLKqM5k7rHnp54OKJKT1P%2BA%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20231209T025142Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIATLOUNASMRAUVEHK5%2F20231209%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=260f870a0382b22901762e12dbaabe09debee00bbcc548ebac72dc49a62ebc6c)

## Create an SQS: 

1. Locate the Simple Queue Service by seaching in the AWS console
2. Click "Create queue" to create a new SQS
3. Enter a name for the SQS and leave the rest of the setting options as default
4. Save SQS and make note of SQS path


## Developing with Javascript/Node.js on AWS :

1. Connect to EC2 instances using SSH 
    	> locate the path where you saved youe .pem file for the 2 instances. 
        >  Grant read access a  `chmod 400 .pem` 
        >  `ssh -i <.pem> <ec2-user@ip-address-of-instances>` 
        >  Enter `Yes` when prompted to allow the ssh connection

2. Confingure AWS SDK on instances: 
        > Install the AWS SDK for JavaScript(AWS SDK for Node.js) on both EC2 instances.
        > Learn more on how to configure AWS SDK for your Javascript application. Follow the link - [AWS SDK for JavaScript](https://aws.amazon.com/sdk-for-javascript/ )
        > Make sure your copy and paste your credetials in both instances ./aws/credentials path
        > `cd ~/.aws`, `nano credentials`, paste credentials you copied from the AWS learner lab into the credential folder and save it.

3. Write a Javascript application for Server A (Object Detection)
        > Write a javascript code to access the S3 bucket (https://njit-cs-643.s3.us-east-1.amazonaws.com) and retrieve images.
        > Use the AWS SDK for Rekognition to perform object detection on the images. For each image that contains a car with a confidence higher than 90%, add the image index to the SQS queue you created.

4. Write a Javascript application for Server B (Text Recognition)
        > Write a Javascript application for EC2 Instance B.
        > Use the AWS SDK for Node.js to monitor the SQS queue for new image indexes.
        > Use the AWS SDK for Rekognition to perform text recognition on the downloaded image.
        > Store the indexes of images with both cars and text in a file on the associated EBS volume.
        > Print the actual text in each image next to its index in the same file.

5. Parellel Processing: 
        > When Instance A finishes processing all images, add a special message (e.g., index -1) to the SQS queue to signal to Instance B that no more indexes will be added.
        > Ensure that both EC2 instances work in parallel. Instance A should continue processing new images while Instance B processes images with text recognition.

6. Testing 
        > Test the application by running both EC2 intances and monitoring the output file for the desired results. 
        > Use the following command to run both node.js application on EC2 instances `node <filename.js>`
        > Once the AWS recognition detects the images that meets the condition, it sends the files to the SQS for proccessing. Once files are inserted in the queue, ServerB reads from the queue for text detection process until itreceives signal from Server A for last process. 
        
 ![Two EC2 for Parellel Processing](https://njit-bucket-image.s3.us-east-1.amazonaws.com/Screenshot%202023-10-29%20at%208.24.45%E2%80%AFPM.png?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLWVhc3QtMSJIMEYCIQDglzhV%2FGfoVzHIZvFPD6xXaO4Fmu8xQR6UgvK5vvC3MwIhANOkqSes2PeCo9p%2FofRo%2FBQP4djEqsv7TYdARLuPCfXnKogDCMv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQARoMMjMwNzYzMDcwNjE3Igy7uh0RJ1ESuj8MSCkq3AJGbcIIQ3pvHZDLtbYEz%2BcHRxonp17dVtKjraPygcTHJQSpAAUh5LvB1WAVVPiv7IV7UZWobajX8FPRrLEySbNi0po1Q5b%2BjtklHA2I3Fd5phRWb5HRzP0g%2B5BBipMQj2mD%2BWqaHuvm358WH4TQowTmwzjaihaOppyDivLIrXMwM45lK4RobTfOgb0HC%2BYb%2BXizpCukkRG4l3OaL0GPdPBw3tUx6AU8KBNw098cziUYf%2F9OPO5I51pqkfJ0HMonJk5h6qx2O9%2F4gzi%2FwvSPgoBG8xloAnWkTYzGdZwwqI%2F3T1C%2FWJXNKg2aF4pq3wqgFGP8trn%2BvM33FQT7qAML39P5DsLngGGxIKkW9iugTz7HlZDN%2BQq1J6nLgzq6%2B%2BkXHV1Q%2BrSi%2F6piWpVmWtSMiDU7BnEK61RxvOQ1Eo8UJra%2Fp29bxlqJRQY9ISF23y07kVzDfhPUhPxa9HgkU08w%2FZbPqwY6sgJxrm%2FRyYc%2BbtEdRAJrC34JYxrWegRMX4c58KQrQspKZL%2Fgfk4h3%2F865WS0cai5363NEuTu2F9vR45%2BhKo8y7mf%2F833pOrOPVjfA85oGU0fjLiGUkEjaZw2b5Z1PqzP5gT%2FauRawltuY9XSfYbW6LYkeHsDFk5X9dlpH6NGzYaxOIQ9%2BN8te%2FvmeAuJaCkltX3oMID31QPsf6SKiQkveBjsgl9b%2BSSmK08UJ6mhrdXzGsls4x7VV8AapDid4egvsrDGPBTIMalkatmbDcEyOQmG61O%2FBsvSyAHoTSi7X9ix2EX71yHVY7HY49Ku7QXEkAv2msUGxa2dIQW9MWRdbMT5bRAUtBQSJDRsdaxzKbB%2Buve4Apkqc2SUoUYa9ITEKSbekLKqM5k7rHnp54OKJKT1P%2BA%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20231209T025327Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIATLOUNASMRAUVEHK5%2F20231209%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=f45d7bf9efa1fdee96581b071df081ef5203b38a283539a5961e6e86e2301105)

![Two EC2 for Parellel Processing](https://njit-bucket-image.s3.us-east-1.amazonaws.com/Screenshot%202023-10-29%20at%208.52.17%E2%80%AFPM.png?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLWVhc3QtMSJIMEYCIQDglzhV%2FGfoVzHIZvFPD6xXaO4Fmu8xQR6UgvK5vvC3MwIhANOkqSes2PeCo9p%2FofRo%2FBQP4djEqsv7TYdARLuPCfXnKogDCMv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQARoMMjMwNzYzMDcwNjE3Igy7uh0RJ1ESuj8MSCkq3AJGbcIIQ3pvHZDLtbYEz%2BcHRxonp17dVtKjraPygcTHJQSpAAUh5LvB1WAVVPiv7IV7UZWobajX8FPRrLEySbNi0po1Q5b%2BjtklHA2I3Fd5phRWb5HRzP0g%2B5BBipMQj2mD%2BWqaHuvm358WH4TQowTmwzjaihaOppyDivLIrXMwM45lK4RobTfOgb0HC%2BYb%2BXizpCukkRG4l3OaL0GPdPBw3tUx6AU8KBNw098cziUYf%2F9OPO5I51pqkfJ0HMonJk5h6qx2O9%2F4gzi%2FwvSPgoBG8xloAnWkTYzGdZwwqI%2F3T1C%2FWJXNKg2aF4pq3wqgFGP8trn%2BvM33FQT7qAML39P5DsLngGGxIKkW9iugTz7HlZDN%2BQq1J6nLgzq6%2B%2BkXHV1Q%2BrSi%2F6piWpVmWtSMiDU7BnEK61RxvOQ1Eo8UJra%2Fp29bxlqJRQY9ISF23y07kVzDfhPUhPxa9HgkU08w%2FZbPqwY6sgJxrm%2FRyYc%2BbtEdRAJrC34JYxrWegRMX4c58KQrQspKZL%2Fgfk4h3%2F865WS0cai5363NEuTu2F9vR45%2BhKo8y7mf%2F833pOrOPVjfA85oGU0fjLiGUkEjaZw2b5Z1PqzP5gT%2FauRawltuY9XSfYbW6LYkeHsDFk5X9dlpH6NGzYaxOIQ9%2BN8te%2FvmeAuJaCkltX3oMID31QPsf6SKiQkveBjsgl9b%2BSSmK08UJ6mhrdXzGsls4x7VV8AapDid4egvsrDGPBTIMalkatmbDcEyOQmG61O%2FBsvSyAHoTSi7X9ix2EX71yHVY7HY49Ku7QXEkAv2msUGxa2dIQW9MWRdbMT5bRAUtBQSJDRsdaxzKbB%2Buve4Apkqc2SUoUYa9ITEKSbekLKqM5k7rHnp54OKJKT1P%2BA%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20231209T025555Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIATLOUNASMRAUVEHK5%2F20231209%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=07fdf1538fce0e7adab7e1796611e63c3c0192e5395451493ecdc05af82aa701)

![Server A & B for Parellel Communication](https://njit-bucket-image.s3.amazonaws.com/Screenshot+2023-10-29+at+8.52.17%E2%80%AFPM.png)


 ![SQS processing images stored from Server A output](https://njit-bucket-image.s3.amazonaws.com/Screenshot+2023-10-29+at+9.10.30%E2%80%AFPM.png)
 
 ![Messages in Queue](https://njit-bucket-image.s3.amazonaws.com/Screenshot+2023-10-29+at+9.21.15%E2%80%AFPM.png)
        
 ![Results](https://njit-bucket-image.s3.amazonaws.com/Screenshot+2023-10-29+at+9.30.11%E2%80%AFPM.png)
        




        


        



        


