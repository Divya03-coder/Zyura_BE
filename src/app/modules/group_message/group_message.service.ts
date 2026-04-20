import { Request } from "express";
import { AppError } from "../../utils/app_error";
import uploadCloud from "../../utils/cloudinary";
import { group_message_model } from "./group_message.schema";

const create_new_group_message_into_db = async (req: Request) => {
    const body = req.body;
    body.senderId = req?.user?.accountId;
    // if file sent then upload file
    if (req?.file) {
        const cloudRes = await uploadCloud(req?.file);
        body.file = {
            fileName: req?.file?.originalname,
            fileType: req?.file?.mimetype?.split("/")?.[0],
            fileUrl: cloudRes?.secure_url
        }
    }

    const result = await group_message_model.create(body);
    return result;
};

const get_all_group_messages_from_db = async (
    groupId: string,
    page = 1,
    limit = 50
) => {
    const skip = (page - 1) * limit;

    const result = await group_message_model
        .find({ groupId })
        .sort({ createdAt: -1 }) // latest first
        .skip(skip)
        .limit(limit)
        .populate({
            path: "senderId",
            select: "profile_type profile_id",
            populate: {
                path: "profile_id",
                select: "firstName profile_photo",
            },
        })
        .lean();

    const total = await group_message_model.countDocuments({ groupId });

    return {
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
        data: result,
    };
};

const update_reaction_on_message_into_db = async (req: Request) => {
    const messageId = req?.params?.messageId;
    const accountId = req?.user?.accountId as any;
    // check message exist or not;
    const isMessageExist = await group_message_model.findById(messageId);
    if (!isMessageExist) {
        throw new AppError("Message not found", 404);
    }
    if (isMessageExist?.likes?.includes(accountId)) {
        await group_message_model.findByIdAndUpdate(messageId, {
            $pull: { likes: accountId },
        }, {
            new: true,
        });
        return "Like removed successfully";
    }
    else {
        await group_message_model.findByIdAndUpdate(messageId, {
            $push: { likes: accountId },
        }, {
            new: true,
        });
        return "Like added successfully";
    }
};

export const group_message_service = {
    create_new_group_message_into_db,
    get_all_group_messages_from_db,
    update_reaction_on_message_into_db
};