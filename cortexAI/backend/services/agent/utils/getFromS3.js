import { GetObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/s3.js"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const getFromS3 = async (filename, expiresIn = 600) => {
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filename
    })
    const url = await getSignedUrl(s3, command, { expiresIn })
    return url
}
