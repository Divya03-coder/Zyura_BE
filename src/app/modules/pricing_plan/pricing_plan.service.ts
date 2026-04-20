import { Request } from "express";
import { pricing_plan_model } from "./pricing_plan.schema";

const create_new_pricing_plan_into_db = async (req: Request) => {
    const result = await pricing_plan_model.create(req?.body)
    return result;
};

const get_all_pricing_plan_from_db = async () => {
    const result = await pricing_plan_model.find();
    return result;
};

const get_single_pricing_plan_from_db = async (req: Request) => {
    const result = await pricing_plan_model.findById(req?.params?.id);
    return result;
}

const update_specific_pricing_plan_into_db = async (req: Request) => {
    const result = await pricing_plan_model.findOneAndUpdate({ _id: req?.params?.id }, req?.body, { new: true });
    return result;
}

const delete_specific_pricing_plan_from_db = async (req: Request) => {
    const result = await pricing_plan_model.findOneAndDelete({ _id: req?.params?.id });
    return result;
}

export const pricing_plan_service = {
    create_new_pricing_plan_into_db,
    get_all_pricing_plan_from_db,
    get_single_pricing_plan_from_db,
    update_specific_pricing_plan_into_db,
    delete_specific_pricing_plan_from_db
};