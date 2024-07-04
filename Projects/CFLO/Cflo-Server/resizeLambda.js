const path = require('path');
var AWS = require('aws-sdk');
var sharp = require('sharp');
const axios = require('axios');

const isProd = false
// Set the REGION
AWS.config.update({
    region: "us-west-2"
});
var s3 = new AWS.S3();

const sizes = [{ height: 70, width:77}, { height: 200, width:220},{ height: 500, width:550}]


const devBucketNames = [
   'devthumb','devsmall','devmedium'
]

const prodBucketNames = [
   'prodthumb','prodsmall','prodmedium'
]

const bucketNames = isProd ? prodBucketNames:devBucketNames 

exports.handler = async (event, context, callback) => {
// Print the event that we got
    console.log(JSON.stringify(event));

  
    var records = event.Records;
    var size = records.length;
    for (var index = 0; index < size; index++) {
        var record = records[index];
        console.log(record);
        // Extract the file name, path and extension
        var fileName = path.parse(record.s3.object.key).name;

        var fileExt = path.parse(record.s3.object.key).ext;
        // Log file name, path and extension
        console.log( ", fileName:" + fileName + ", fileExt:" + fileExt);
        // Read the image object that was added to the S3 bucket
        var imageObjectParam = {
            Bucket: record.s3.bucket.name,
            Key: record.s3.object.key
        }
   
        var imageObject = await s3.getObject(imageObjectParam).promise();
        console.log(imageObject, 'is the imageObjectBody')
    
        
        try {
            
            const putResults = await Promise.allSettled(sizes.map(async (size, i) => {
                const height = size.height;
                const width = size.width;
                var buff = await sharp(imageObject.Body).resize(width,height).toBuffer();

                var putObjectParam1 = {
                    Body: buff,
                    Bucket: bucketNames[i],
                    Key: fileName,
                    ContentType: "image" 
                }
                
                console.log("putObjectParam1:" + JSON.stringify(putObjectParam1));
                var putResult = s3.putObject(putObjectParam1).promise();
                return putResult
            }))

            console.log(putResults,' are the putResults')
         
        } catch (error) {
            console.log(error,' is the error ');
            //return;
        }
        
    }
}

