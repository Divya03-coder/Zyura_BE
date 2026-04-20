import { Schema, model } from "mongoose";
import { T_WebSetting } from "./web_setting.interface";

const web_setting_schema = new Schema<T_WebSetting>({
    platformName: { type: String, },
    tagline: { type: String, },
    description: { type: String, },
    platformLogo: { type: String, },
    favicon: { type: String, },
    primaryColor: { type: String, },
    accentColor: { type: String, },
    supportEmail: { type: String, },
    websiteURL: { type: String, },
}, { timestamps: true, versionKey: false });

export const web_setting_model = model("web_setting", web_setting_schema);
