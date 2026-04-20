import { Request } from "express";
import { AppError } from "../../utils/app_error";
import uploadCloud from "../../utils/cloudinary";
import { resource_model_book, resource_model_career } from "./resource.schema";

const create_new_resource_into_db = async (req: Request) => {
    if (!req?.file) throw new AppError("File not found", 404)
    const { secure_url } = await uploadCloud(req?.file)
    const payload = req?.body;
    payload.mediaLink = secure_url;
    const result = await resource_model_career.create(payload);
    return result;
};

const get_all_career_resource_from_db = async (req: Request) => {
    const { searchTerm, category, page = "1", limit = "10" } = req.query;

    const query: any = {};

    // Search only by resourceName
    if (searchTerm) {
        query.resourceName = { $regex: searchTerm as string, $options: "i" };
    }

    // Category filter
    if (category) {
        query.category = category;
    }

    // Convert page & limit to number
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // Fetch data with pagination
    const result = await resource_model_career
        .find(query)
        .skip(skip)
        .limit(limitNum)
        .lean();

    // Count total documents for pagination metadata
    const total = await resource_model_career.countDocuments(query);

    return {
        data: result,
        meta: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    };
};

const get_single_career_resource_from_db = async (req: Request) => {
    const { id } = req.params;
    const result = await resource_model_career.findById(id).lean();
    return result;
}

const update_career_resource_into_db = async (req: Request) => {
    const { id } = req?.params;
    const payload = req?.body;
    if (req?.file) {
        const { secure_url } = await uploadCloud(req?.file)
        payload.mediaLink = secure_url;
    }
    const result = await resource_model_career.findByIdAndUpdate(id, payload, { new: true });
    return result;
};

const delete_single_career_resource_from_db = async (req: Request) => {
    const { id } = req.params;
    const result = await resource_model_career.findByIdAndDelete(id);
    return result;
}



// book part

const create_new_book_into_db = async (req: Request) => {
    if (!req?.file) throw new AppError("File not found", 404)
    const { secure_url } = await uploadCloud(req?.file)
    const payload = req?.body;
    payload.fileLink = secure_url;
    const result = await resource_model_book.create(payload);
    return result;
};


const get_all_books_from_db = async (req: Request) => {
    const { searchTerm, page = "1", limit = "10" } = req.query;

    const query: any = {};

    // Search only by resourceName
    if (searchTerm) {
        query.$or = [
            { title: { $regex: searchTerm as string, $options: "i" } },
            { author: { $regex: searchTerm as string, $options: "i" } },
        ];
    }

    // Convert page & limit to number
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // Fetch data with pagination
    const result = await resource_model_book
        .find(query)
        .skip(skip)
        .limit(limitNum)
        .lean();

    // Count total documents for pagination metadata
    const total = await resource_model_book.countDocuments(query);

    return {
        data: result,
        meta: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    };
};

const get_single_book_from_db = async (req: Request) => {
    const { id } = req.params;
    const result = await resource_model_book.findById(id).lean();
    return result;
}

const update_book_into_db = async (req: Request) => {
    const { id } = req?.params;
    const payload = req?.body;
    if (req?.file) {
        const { secure_url } = await uploadCloud(req?.file)
        payload.mediaLink = secure_url;
    }
    const result = await resource_model_book.findByIdAndUpdate(id, payload, { new: true });
    return result;
};

const delete_book_from_db = async (req: Request) => {
    const { id } = req.params;
    const result = await resource_model_book.findByIdAndDelete(id);
    return result;
}


export const resource_service = {
    create_new_resource_into_db,
    get_all_career_resource_from_db,
    get_single_career_resource_from_db,
    update_career_resource_into_db,
    delete_single_career_resource_from_db,

    //book part
    create_new_book_into_db,
    get_all_books_from_db,
    get_single_book_from_db,
    update_book_into_db,
    delete_book_from_db
};