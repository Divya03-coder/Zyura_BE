import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import { CareerResourceService } from "./career_resource.service";

const create_career_resource = catchAsync(async (req, res) => {
    const result = await CareerResourceService.create_career_resource_into_db(req)
    manageResponse(res, {
        statusCode: 201,
        message: "Career resource created!",
        success: true,
        data: result
    })
})

export const CareerResourceController = {
    create_career_resource
}