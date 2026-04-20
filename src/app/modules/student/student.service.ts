import { Request } from "express";
import uploadCloud from "../../utils/cloudinary";
import { isAccountExist } from "../../utils/isAccountExist";
import { Student_Model } from "./student.schema";

const update_student_profile_into_db = async (req: Request) => {
    const user = req?.user;
    const payload = req?.body;
    if (req?.file) {
        const cloudRes = await uploadCloud(req?.file)
        payload.profile_photo = cloudRes?.secure_url
    }
    const isStudentExist = await isAccountExist(user?.email as string);
    const result = await Student_Model.findOneAndUpdate(
        { accountId: isStudentExist._id },
        payload,
        { new: true }
    )

    return result
}


export const student_services = {
    update_student_profile_into_db
}