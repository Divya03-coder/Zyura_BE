import { Request } from "express";
import { web_setting_model } from "./web_setting.schema";

const create_new_web_setting_into_db = async (req: Request) => {
    const isSettingExists = await web_setting_model.findOne({});
    if (isSettingExists) {
        // Update existing settings
        const updatedSetting = await web_setting_model.findByIdAndUpdate(
            isSettingExists._id,
            req.body,
            { new: true }
        );
        return updatedSetting;
    } else {
        // Create new settings
        const newSetting = new web_setting_model(req.body);
        await newSetting.save();
        return newSetting;
    }
};

const get_web_setting_from_db = async () => {
    const result = await web_setting_model.findOne({});
    return result;
};

export const web_setting_service = {
    create_new_web_setting_into_db,
    get_web_setting_from_db
};