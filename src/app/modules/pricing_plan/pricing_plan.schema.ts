import { Schema, model } from "mongoose";
import { T_PricingPlan } from "./pricing_plan.interface";

const features_schema = new Schema({
    featureName: {
        type: String,
        required: true,
    },
    featureLimit: {
        type: String,
        required: true,
    },
}, { versionKey: false, _id: false });

const pricing_plan_schema = new Schema<T_PricingPlan>(
    {
        planName: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        billingCycle: {
            type: String,
            enum: ["Monthly", "Yearly"],
            required: true,
        },
        userType: {
            type: String,
            required: true,
        },
        planFeatures: [features_schema],
    }, { timestamps: true, versionKey: false });

export const pricing_plan_model = model("pricing_plan", pricing_plan_schema);
