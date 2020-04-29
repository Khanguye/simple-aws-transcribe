const express = require('express');
const aws = require('aws-sdk');

const app = express();
app.set('views', './views');
app.use(express.static('./static'));
app.engine('html', require('ejs').renderFile);
app.listen(process.env.PORT || 8080); 

const S3_BUCKET = process.env.S3_BUCKET || 'kh-transcribe-media';
//Read from environment
if (process.env.AWS_ACCESSKEY) { 
    aws.config.update({
        secretAccessKey: process.env.AWS_SECRETKEY,
        accessKeyId: process.env.AWS_ACCESSKEY,
        region: process.env.AWS_REGION
    });
} else { // If not use our local credentials
    var credentials = new aws.SharedIniFileCredentials({ profile: 'kh-transcriber-user' });
    aws.config.credentials = credentials;
    aws.config.region = 'us-west-1';
}

// Attach our index file at the root
app.get('/', (req, res) => res.render('index.html'));

//route to give us a temp signed url for uploading directly to s3
app.get('/get-signed-url', (req, res) => {
    const s3 = new aws.S3();
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
   
    const options = {
        Bucket: S3_BUCKET,
        Key: `${Math.floor(Math.random()*100)}_${fileName}`,
        Expires: 900,
        ContentType: fileType,
        ACL: 'private'
    };

    s3.getSignedUrl('putObject', options, (err, data) => {
        if (err) {
            console.log(err);
            return res.end();
        }
        const returnData = {
            signedRequest: data
        };
        res.write(JSON.stringify(returnData));
        res.end();
    });


});