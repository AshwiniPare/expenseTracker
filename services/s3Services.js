const  AWS=require('aws-sdk');
exports.uploadTos3=async(data,filename)=>{
    const BUCKET_NAME=process.env.AWS_BUCKET_NAME;
    const IAM_ACCESS_KEY=process.env.AWS_SECRET_KEY;
    const IAM_SECRET_KEY=process.env.AWS_SECRET_PASSWORD;

    let s3Bucket= new AWS.S3({
        accessKeyId:IAM_ACCESS_KEY,
        secretAccessKey:IAM_SECRET_KEY,
    });

    const params={
        Bucket:BUCKET_NAME,
        Key:filename,
        Body:data,
        ACL:"public-read"
    }

    return new Promise(async(resolve,reject)=>{
        const s3Response = await s3Bucket.upload(params,(err,s3Response)=>{
            if(err){
                console.log(err);
                reject(err)
            }
            else{

                console.log(s3Response.Location);
                resolve(s3Response.Location);
            }
        })
    })

}