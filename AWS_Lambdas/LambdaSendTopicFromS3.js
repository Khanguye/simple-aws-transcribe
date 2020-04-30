const AWS= require('aws-sdk');

exports.handler = async (event,context) => {
    const s3 = new AWS.S3();
    const record = event.Records[0];
   
    if (record.s3.object.key.endsWith('temp'))
    {
        return {
            statusCode: 400,
            body : JSON.stringify("Do not process temp file.")
        };
    }
    
    let options = {
        Bucket: record.s3.bucket.name,
        Key: record.s3.object.key
    };
    
    console.log(options);
    try{
        let data = await s3.getObject(options).promise();
        let params = {
                Message :  JSON.parse(data.Body.toString('utf-8')).results.transcripts[0].transcript,
                Subject :  record.s3.object.key,
                TopicArn : "arn:aws:sns:::Topic"
            };
        console.log(params);
        
        const sns = new AWS.SNS();
        
        await sns.publish(params).promise();
        
        console.log("Success to SNS");
        
        return {
                statusCode: 200,
                body: JSON.stringify("Successful Sent Text Business Group")
        };
        
    }
    catch(error){
       return {
                statusCode: 500,
                body: JSON.stringify("Error Sent Text Business Group")
        };
    }
};