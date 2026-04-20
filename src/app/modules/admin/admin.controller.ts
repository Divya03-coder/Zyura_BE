import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import { admin_services } from "./admin.service";

const get_all_overview_data = catchAsync(async (req, res) => {
    const result = await admin_services.get_all_overview_data_from_db_fro_admin(req);
    manageResponse(res, {
        statusCode: 200,
        success: true,
        message: "Data fetched successfully",
        data: result,
    });
});
const get_monthly_activities = catchAsync(async (req, res) => {
    const result = await admin_services.get_monthly_activities_from_db(req);
    manageResponse(res, {
        statusCode: 200,
        success: true,
        message: "Data fetched successfully",
        data: result,
    });
});
const get_all_student = catchAsync(async (req, res) => {
    const result = await admin_services.get_all_student_from_db_form_admin(req);
    manageResponse(res, {
        statusCode: 200,
        success: true,
        message: "Data fetched successfully",
        data: result?.data,
        meta: result?.meta
    });
});
const get_single_student = catchAsync(async (req, res) => {
    const result = await admin_services.get_single_student_from_db_form_admin(req?.params?.studentId as string);
    manageResponse(res, {
        statusCode: 200,
        success: true,
        message: "Data fetched successfully",
        data: result
    });
});
const delete_student = catchAsync(async (req, res) => {
    const result = await admin_services.delete_student_from_db_form_admin(req?.params?.studentId as string);
    manageResponse(res, {
        statusCode: 200,
        success: true,
        message: "Account delete successfully",
        data: result
    });
});
const get_all_professional = catchAsync(async (req, res) => {
    const result = await admin_services.get_all_professional_from_db_form_admin(req);
    manageResponse(res, {
        statusCode: 200,
        success: true,
        message: "Data fetched successfully",
        data: result?.data,
        meta: result?.meta
    });
});
const get_single_professional = catchAsync(async (req, res) => {
    const result = await admin_services.get_single_professional_from_db_form_admin(req?.params?.accountId as string);
    manageResponse(res, {
        statusCode: 200,
        success: true,
        message: "Data fetched successfully",
        data: result
    });
});
const delete_professional = catchAsync(async (req, res) => {
    const result = await admin_services.delete_professional_from_db_form_admin(req?.params?.accountId as string);
    manageResponse(res, {
        statusCode: 200,
        success: true,
        message: "Account delete successfully",
        data: result
    });
});

// for mentor
const get_all_mentor = catchAsync(async (req, res) => {
    const result = await admin_services.get_all_mentor_from_db_form_admin(req);
    manageResponse(res, {
        statusCode: 200,
        success: true,
        message: "Data fetched successfully",
        data: result?.data,
        meta: result?.meta
    });
});
const get_single_mentor = catchAsync(async (req, res) => {
    const result = await admin_services.get_single_mentor_from_db_form_admin(req?.params?.accountId as string);
    manageResponse(res, {
        statusCode: 200,
        success: true,
        message: "Data fetched successfully",
        data: result
    });
});
const delete_mentor = catchAsync(async (req, res) => {
    const result = await admin_services.delete_mentor_from_db_form_admin(req?.params?.accountId as string);
    manageResponse(res, {
        statusCode: 200,
        success: true,
        message: "Account delete successfully",
        data: result
    });
});

// for admin config
const get_all_admin = catchAsync(async (req, res) => {
    const result = await admin_services.get_all_admin_from_db();
    manageResponse(res, {
        statusCode: 200,
        success: true,
        message: "Data fetched successfully",
        data: result
    });
});
const create_new_admin = catchAsync(async (req, res) => {
    const result = await admin_services.create_new_admin_into_db(req);
    manageResponse(res, {
        statusCode: 200,
        success: true,
        message: "Admin created successfully",
        data: result
    });
});
const delete_admin = catchAsync(async (req, res) => {
    const result = await admin_services.delete_admin_from_db(req);
    manageResponse(res, {
        statusCode: 200,
        success: true,
        message: "Admin deleted successfully",
        data: result
    });
});


export const admin_controller = {
    get_all_overview_data,
    get_all_student,
    get_single_student,
    delete_student,
    get_all_professional,
    get_single_professional,
    delete_professional,
    get_all_mentor,
    get_single_mentor,
    delete_mentor,
    get_monthly_activities,
    get_all_admin,
    create_new_admin,
    delete_admin
};