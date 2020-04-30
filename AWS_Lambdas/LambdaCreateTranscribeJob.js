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