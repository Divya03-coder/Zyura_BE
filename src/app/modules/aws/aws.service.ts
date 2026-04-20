import { Request } from "express";
import { AppError } from "../../utils/app_error";
import uploadCloud from "../../utils/cloudinary";

const create_new_aws_into_db = async (req: Request) => {
    if (!req?.file) {
        throw new AppError("File not found", 404)
    }
    const res = await uploadCloud(req?.file)
    return {
        fileId: res?.public_id,
        fileUrl: res?.secure_url
    }
};

export const aws_service = { create_new_aws_into_db };