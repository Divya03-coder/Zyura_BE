import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs";
import { configs } from "../configs";

type IFile = {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
};

const s3 = new S3Client({
    credentials: {
        accessKeyId: configs.aws.access_key_id as string,
        secretAccessKey: configs.aws.secret_access_key as string
    },
    region: configs.aws.region
});

const uploadCloud = async (file: IFile) => {
    const fileBuffer = fs.readFileSync(file.path);
    const ext = file.originalname.split(".").pop();
    const uniqueKey = `${Date.now()}.${ext}`;


    const params = {
        Bucket: configs.aws.bucket as string,
        Key: uniqueKey,
        Body: fileBuffer,
        ContentType: file.mimetype
    }

    const command = new PutObjectCommand(params);
    await s3.send(command);

    // Delete local file (optional)
    fs.unlinkSync(file.path);

    // ⭐ Create public URL
    const publicUrl = `https://${configs.aws.bucket}.s3.${configs.aws.region}.amazonaws.com/${uniqueKey}`;

    return {
        public_id: uniqueKey,
        secure_url: publicUrl
    };
}

export default uploadCloud;
