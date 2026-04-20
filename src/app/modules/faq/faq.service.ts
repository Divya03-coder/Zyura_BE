import { Request } from "express";
import { AppError } from "../../utils/app_error";
import { T_Faq } from "./faq.interface";
import { faq_model } from "./faq.schema";

const create_new_faq_into_db = async (req: Request) => {
    const result = await faq_model.create(req?.body);
    return result;
};

const get_all_faqs_from_db = async () => {
    const result = await faq_model.find();
    return result;
};

// Get single faq by id
const get_single_faq_from_db = async (id: string) => {
    const result = await faq_model.findById(id);
    if (!result) {
        throw new AppError("Faq not found", 404);
    }
    return result;
};

// Update a single faq
const update_faq_into_db = async (id: string, updatedFaq: Partial<T_Faq>) => {
    const result = await faq_model.findByIdAndUpdate(id, updatedFaq, { new: true });
    if (!result) {
        throw new AppError("Faq not found", 404);
    }
    return result;
};

// Delete a single faq
const delete_faq_from_db = async (id: string) => {
    const result = await faq_model.findByIdAndDelete(id);
    if (!result) {
        throw new AppError("Faq not found", 404);
    }
    return result;
};

export const faq_service = {
    create_new_faq_into_db,
    get_all_faqs_from_db,
    get_single_faq_from_db,
    update_faq_into_db,
    delete_faq_from_db
};