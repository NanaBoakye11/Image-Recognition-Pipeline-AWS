# Image-Recognition-Pipeline AWS

You have to build am image recognition pipeline in AWS, using two EC2 instances, S3, SQS, and Rekognition. The assignment must be done in Java on Amazon Linux VMs. For the rest of the description, you should refer to the figure below:

**Goal**: The purpose of this individual assignment is to learn how to use the Amazon AWS cloud platform and how to develop an AWS application that uses existing cloud services. Specifically, you will learn:
1. How to create VMs (EC2 instances) in the cloud.
2. How to use cloud storage (S3) in your applications.
3. How to communicate between VMs using a queue service (SQS).
4. How to program distributed applications in Java on Linux VMs in the cloud, and
5. How to use a machine learning service (AWS Rekognition) in the cloud.

![Project flow diagram](https://njit-bucket-image.s3.amazonaws.com/Screenshot+2023-10-29+at+7.26.35%E2%80%AFPM.png)

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

![Project flow diagram](https://njit-bucket-image.s3.us-east-1.amazonaws.com/Screenshot%202023-10-29%20at%208.24.45%E2%80%AFPM.png?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJIMEYCIQDVILWPw5aXTbZHE726Av5nmOuuNp6UqFDRTj%2FAr4yibwIhAIRtyArbL6nsjgQXHGr2BjK5JYB9z9hJ%2BPOLoySEmJYaKogDCMn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMMjMwNzYzMDcwNjE3IgxFuGQIPM%2B4l1C3kT0q3AKA0g9%2BPatrwFOfAbByFyegffpbeQxE7J%2B6GQRpB69qWKFfIBcFA0OVu9T3w3ZRlaCRebtXCT82BcQCf4UrGZ04ejogSZdG9MJNZry5jb01Z7qNXU8i7gNbSKbnwnVpUcwV1MHKfPE6BEv21IjBXdqNorQf6vlPGD%2Fd8i7HJGSnjstPHIg1R%2Bf3esdIWGCDLlJx5R8I%2BzrSjLATLKioilgEVyODs6aFq%2BW3fTZv40UfvJ635Ixonq5COI6thEtWeCLi6CUeRlGPMLXRdTNNmbs2%2FpSV3q5WaIVG1nmLN8shH2J7Q%2FhWdu%2Bb97%2FF3izlpUvmxRszV2oO5hmfvZBTjNHObRKIB59Z17RaLhlSjfoito0G68aO%2FfM30oaR06KfPfqF4dDobQ7wZ%2B%2FUTKmxovv63I%2BLfCPdYkDkD1P%2FVHQ7AKj7SNWjq3HzJ9W6tVyR4%2BLOISjlmNdvO%2FiLunMwmfP6qQY6sgILe5qIKFQf3lAeQLAmGm%2BTzuGpUhrQutS1Pn7CnmR0AOmj%2B13RxuBl1YQdHouVz54uyOFc6ziJGC1Dx2qXrsoOia4%2FKyPi4J4chMW5vXAVD%2BkgtdIiE05KHUnAqiEER069OOlYYlwhSTl54YaeeO5%2FqPVgGmNWX3Ktg48xC7uOH6SEu%2Fl46iN7nqYPpCVrIzd9xGP3uB3HB82S27btfYzE6m67M1iu6ffZtSTv6rU8jfHfsrsDhCbwBM5e4%2Fn9yyfrXIQsEgM1URvaRZtprXX1zXcO0uzkXw%2BAIUZI7wl4Nmc0ICtWYCq4hOXTEqDmwgEER%2BZ7jS6xKwHEDybYRCKU%2FTtDP6X7a7r6HUnxH%2FUxvNI9%2FcXjxsyEowQ8szcUqUZMNPp22epRT7A05huHqMppzAk%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20231030T002740Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIATLOUNASMQ2INHC6Y%2F20231030%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=59db7a3560ee77bd203776696549e91ae9c0d35f14ebff59cb454f0cd38869b8)

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
        
 ![Two EC2 for Parellel Processing](https://njit-bucket-image.s3.us-east-1.amazonaws.com/Screenshot%202023-10-29%20at%208.52.17%E2%80%AFPM.png?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJIMEYCIQDVILWPw5aXTbZHE726Av5nmOuuNp6UqFDRTj%2FAr4yibwIhAIRtyArbL6nsjgQXHGr2BjK5JYB9z9hJ%2BPOLoySEmJYaKogDCMn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMMjMwNzYzMDcwNjE3IgxFuGQIPM%2B4l1C3kT0q3AKA0g9%2BPatrwFOfAbByFyegffpbeQxE7J%2B6GQRpB69qWKFfIBcFA0OVu9T3w3ZRlaCRebtXCT82BcQCf4UrGZ04ejogSZdG9MJNZry5jb01Z7qNXU8i7gNbSKbnwnVpUcwV1MHKfPE6BEv21IjBXdqNorQf6vlPGD%2Fd8i7HJGSnjstPHIg1R%2Bf3esdIWGCDLlJx5R8I%2BzrSjLATLKioilgEVyODs6aFq%2BW3fTZv40UfvJ635Ixonq5COI6thEtWeCLi6CUeRlGPMLXRdTNNmbs2%2FpSV3q5WaIVG1nmLN8shH2J7Q%2FhWdu%2Bb97%2FF3izlpUvmxRszV2oO5hmfvZBTjNHObRKIB59Z17RaLhlSjfoito0G68aO%2FfM30oaR06KfPfqF4dDobQ7wZ%2B%2FUTKmxovv63I%2BLfCPdYkDkD1P%2FVHQ7AKj7SNWjq3HzJ9W6tVyR4%2BLOISjlmNdvO%2FiLunMwmfP6qQY6sgILe5qIKFQf3lAeQLAmGm%2BTzuGpUhrQutS1Pn7CnmR0AOmj%2B13RxuBl1YQdHouVz54uyOFc6ziJGC1Dx2qXrsoOia4%2FKyPi4J4chMW5vXAVD%2BkgtdIiE05KHUnAqiEER069OOlYYlwhSTl54YaeeO5%2FqPVgGmNWX3Ktg48xC7uOH6SEu%2Fl46iN7nqYPpCVrIzd9xGP3uB3HB82S27btfYzE6m67M1iu6ffZtSTv6rU8jfHfsrsDhCbwBM5e4%2Fn9yyfrXIQsEgM1URvaRZtprXX1zXcO0uzkXw%2BAIUZI7wl4Nmc0ICtWYCq4hOXTEqDmwgEER%2BZ7jS6xKwHEDybYRCKU%2FTtDP6X7a7r6HUnxH%2FUxvNI9%2FcXjxsyEowQ8szcUqUZMNPp22epRT7A05huHqMppzAk%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20231030T012327Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIATLOUNASMQ2INHC6Y%2F20231030%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=8182da03d5ae15641a1e4daafbc6b8a8a7040693a2350070dfdd261c38155947)

![Two EC2 for Parellel Processing](https://njit-bucket-image.s3.us-east-1.amazonaws.com/Screenshot%202023-10-29%20at%209.10.30%E2%80%AFPM.png?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJIMEYCIQDVILWPw5aXTbZHE726Av5nmOuuNp6UqFDRTj%2FAr4yibwIhAIRtyArbL6nsjgQXHGr2BjK5JYB9z9hJ%2BPOLoySEmJYaKogDCMn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMMjMwNzYzMDcwNjE3IgxFuGQIPM%2B4l1C3kT0q3AKA0g9%2BPatrwFOfAbByFyegffpbeQxE7J%2B6GQRpB69qWKFfIBcFA0OVu9T3w3ZRlaCRebtXCT82BcQCf4UrGZ04ejogSZdG9MJNZry5jb01Z7qNXU8i7gNbSKbnwnVpUcwV1MHKfPE6BEv21IjBXdqNorQf6vlPGD%2Fd8i7HJGSnjstPHIg1R%2Bf3esdIWGCDLlJx5R8I%2BzrSjLATLKioilgEVyODs6aFq%2BW3fTZv40UfvJ635Ixonq5COI6thEtWeCLi6CUeRlGPMLXRdTNNmbs2%2FpSV3q5WaIVG1nmLN8shH2J7Q%2FhWdu%2Bb97%2FF3izlpUvmxRszV2oO5hmfvZBTjNHObRKIB59Z17RaLhlSjfoito0G68aO%2FfM30oaR06KfPfqF4dDobQ7wZ%2B%2FUTKmxovv63I%2BLfCPdYkDkD1P%2FVHQ7AKj7SNWjq3HzJ9W6tVyR4%2BLOISjlmNdvO%2FiLunMwmfP6qQY6sgILe5qIKFQf3lAeQLAmGm%2BTzuGpUhrQutS1Pn7CnmR0AOmj%2B13RxuBl1YQdHouVz54uyOFc6ziJGC1Dx2qXrsoOia4%2FKyPi4J4chMW5vXAVD%2BkgtdIiE05KHUnAqiEER069OOlYYlwhSTl54YaeeO5%2FqPVgGmNWX3Ktg48xC7uOH6SEu%2Fl46iN7nqYPpCVrIzd9xGP3uB3HB82S27btfYzE6m67M1iu6ffZtSTv6rU8jfHfsrsDhCbwBM5e4%2Fn9yyfrXIQsEgM1URvaRZtprXX1zXcO0uzkXw%2BAIUZI7wl4Nmc0ICtWYCq4hOXTEqDmwgEER%2BZ7jS6xKwHEDybYRCKU%2FTtDP6X7a7r6HUnxH%2FUxvNI9%2FcXjxsyEowQ8szcUqUZMNPp22epRT7A05huHqMppzAk%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20231030T012647Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIATLOUNASMQ2INHC6Y%2F20231030%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=1571172f16c197ff56faec02c52c275dbc7f7212b4ccf03e027e62b1bcf5bc32)

![Server A & B for Parellel Communication](https://njit-bucket-image.s3.amazonaws.com/Screenshot+2023-10-29+at+8.52.17%E2%80%AFPM.png)


 ![SQS processing images stored from Server A output](https://njit-bucket-image.s3.amazonaws.com/Screenshot+2023-10-29+at+9.10.30%E2%80%AFPM.png)
 
 ![Messages in Queue](https://njit-bucket-image.s3.amazonaws.com/Screenshot+2023-10-29+at+9.21.15%E2%80%AFPM.png)
        
 ![Results](https://njit-bucket-image.s3.amazonaws.com/Screenshot+2023-10-29+at+9.30.11%E2%80%AFPM.png)
        




        


        



        


