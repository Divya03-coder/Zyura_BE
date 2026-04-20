import { Request } from "express";

const create_career_resource_into_db = async (req: Request) => {
    const payload = req?.body;
    return payload
}


export const CareerResourceService = {
    create_career_resource_into_db
}