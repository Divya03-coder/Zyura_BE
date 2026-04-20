import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import { clinical_case_services } from "./clinical_case.service";

const create_new_clinical_case = catchAsync(async (req, res) => {
    const result = await clinical_case_services.create_new_clinical_case_and_save_on_db(req)
    manageResponse(res, {
        statusCode: 201,
        message: "Clinical case created!",
        success: true,
        data: result
    })
})
const get_all_clinical_case = catchAsync(async (req, res) => {
    const result = await clinical_case_services.get_all_clinical_case_from_db(req)
    manageResponse(res, {
        statusCode: 200,
        message: "Clinical case fetched!",
        success: true,
        data: result?.data,
        meta: result?.meta
    })
})
const get_single_clinical_case = catchAsync(async (req, res) => {
    const result = await clinical_case_services.get_single_clinical_case_from_db(req?.params?.caseId as string)
    manageResponse(res, {
        statusCode: 200,
        message: "Clinical case fetched!",
        success: true,
        data: result
    })
})
const update_clinical_case_by_id = catchAsync(async (req, res) => {
    const result = await clinical_case_services.update_clinical_case_by_id_into_db(req)
    manageResponse(res, {
        statusCode: 200,
        message: "Clinical case updated!",
        success: true,
        data: result
    })
})
const delete_clinical_case_by_id = catchAsync(async (req, res) => {
    const result = await clinical_case_services.delete_clinical_case_by_id_from_db(req?.params?.caseId as string)
    manageResponse(res, {
        statusCode: 200,
        message: "Clinical case deleted!",
        success: true,
        data: result
    })
})

const upload_bulk_clinical_cases = catchAsync(async (req, res) => {
    const result = await clinical_case_services.upload_bulk_clinical_cases_into_db(req)
    manageResponse(res, {
        statusCode: 201,
        message: "Clinical cases uploaded",
        success: true,
        data: result
    })
})


export const clinical_case_controllers = {
    create_new_clinical_case,
    upload_bulk_clinical_cases,
    get_all_clinical_case,
    get_single_clinical_case,
    update_clinical_case_by_id,
    delete_clinical_case_by_id
}