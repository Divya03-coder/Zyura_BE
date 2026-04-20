import catchAsync from "../../utils/catch_async"
import manageResponse from "../../utils/manage_response"
import { student_services } from "./student.service"

const update_student_profile = catchAsync(async (req, res) => {
    const result = await student_services.update_student_profile_into_db(req)
    manageResponse(res, {
        success: true,
        statusCode: 200,
        message: "Profile update successful",
        data: result
    })
})

export const student_controllers = {
    update_student_profile
}