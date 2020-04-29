/// s3 and Transcribe Policy
/*
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": "s3:ListBucket",
            "Resource": [
                "arn:aws:s3:::kh-transcribe-media",
                "arn:aws:s3:::kh-transcribe-output"
            ]
        },
        {
            "Sid": "VisualEditor1",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject"
            ],
            "Resource": [
                "arn:aws:s3:::kh-transcribe-media/*",
                "arn:aws:s3:::kh-transcribe-output/*"
            ]
        },
        {
            "Sid": "VisualEditor2",
            "Effect": "Allow",
            "Action": [
                "transcribe:StartTranscriptionJob",
                "transcribe:ListTranscriptionJobs"
            ],
            "Resource": "*"
        }
    ]
}
*/
const AWS= require('aws-sdk');

exports.handler = async (event) => {
	const transcribeService = new AWS.TranscribeService();

	const record = event.Records[0];
	const uri = 'https://' + record.s3.bucket.name + '.s3.amazonaws.com/' + record.s3.object.key;
	const params = {
		LanguageCode: 'en-US',
		Media: {
			MediaFileUri: uri
		},
		TranscriptionJobName: 'kh-t-'+ record.s3.object.key,
		OutputBucketName: 'kh-transcribe-output'
		};

	try{
		await transcribeService.startTranscriptionJob(params).promise();
		const response = {
			statusCode: 200,
			body: JSON.stringify("Created the job")
		};
		return response;
	}
	catch(err){
		const response = {
			statusCode: 500,
			body: JSON.stringify("Failed to created the job")
		};
		return response;
	}
};