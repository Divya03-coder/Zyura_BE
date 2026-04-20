import httpStatus from 'http-status';
import { configs } from "../../configs";
import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import { auth_services } from "./auth.service";

const register_user = catchAsync(async (req, res) => {
    const result = await auth_services.register_user_into_db(req?.body)
    manageResponse(res, {
        success: true,
        message: "Account registered successful",
        statusCode: httpStatus.CREATED,
        data: result
    })
})

const verified_account = catchAsync(async (req, res) => {
    const result = await auth_services.verified_account_into_db(req?.body)
    res.cookie('accessToken', result.accessToken, {
        secure: configs.env == 'production',
        httpOnly: true,
    });
    manageResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Account Verification successful.",
        data: result
    })
})

const get_new_verification_otp = catchAsync(async (req, res) => {
    const result = await auth_services.get_new_verification_otp_from_db(req?.body?.email)
    manageResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "New OTP is sent to email.",
        data: result
    })
})


const login_user = catchAsync(async (req, res) => {
    const result = await auth_services.login_user_from_db(req.body);

    res.cookie('refreshToken', result.refreshToken, {
        secure: configs.env == 'production',
        httpOnly: true,
    });
    res.cookie('accessToken', result.accessToken, {
        secure: configs.env == 'production',
        httpOnly: true,
    });
    manageResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User is logged in successful !',
        data: {
            accessToken: result.accessToken,
            role: result?.role
        },
    });
});

const update_student_profile = catchAsync(async (req, res) => {
    const result = await auth_services.update_student_profile_into_db(req);
    manageResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Profile updated successfully!',
        data: result,
    });
});
const get_my_profile = catchAsync(async (req, res) => {
    const { email } = req.user!;
    const result = await auth_services.get_my_profile_from_db(email);
    manageResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Profile info fetched successfully!',
        data: result,
    });
});

const refresh_token = catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies;
    const result = await auth_services.refresh_token_from_db(refreshToken);
    res.cookie("accessToken", result, {
        secure: configs.env == 'production',
        httpOnly: true,
    });
    manageResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Access token generated successfully!',
        data: { accessToken: result },
    });
});

const change_password = catchAsync(async (req, res) => {
    const user = req?.user;
    const result = await auth_services.change_password_from_db(user!, req.body);
    manageResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Password changed successfully!',
        data: result,
    });
});

const forget_password = catchAsync(async (req, res) => {
    const { email } = req?.body
    await auth_services.forget_password_from_db(email);
    manageResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'We sent a OTP to your email!',
        data: null,
    });
});

const reset_password = catchAsync(async (req, res) => {
    const { otp, newPassword, email } = req.body;
    const result = await auth_services.reset_password_into_db(
        otp,
        email,
        newPassword,
    );
    manageResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Password reset successfully!',
        data: result,
    });
});

const change_profile_status = catchAsync(async (req, res) => {
    const { status, email } = req.body;
    await auth_services.change_profile_status_from_db(status, email);
    manageResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Now this account is ${status}`,
        data: null,
    });
});
const sign_in_with_google = catchAsync(async (req, res) => {
    const result = await auth_services.sign_in_with_google_and_save_in_db(req?.body);
    res.cookie('refreshToken', result.refreshToken, {
        secure: configs.env == 'production',
        httpOnly: true,
    });
    res.cookie('accessToken', result.accessToken, {
        secure: configs.env == 'production',
        httpOnly: true,
    });
    manageResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User is logged in successful !',
        data: {
            accessToken: result.accessToken,
            role: result?.role
        },
    });
});


const update_profiles = catchAsync(async (req, res) => {
    const result = await auth_services.update_profiles_from_db(req);
    manageResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Profile updated successfully!`,
        data: result,
    });
});


export const auth_controllers = {
    register_user,
    login_user,
    get_my_profile,
    refresh_token,
    change_password,
    reset_password,
    forget_password,
    verified_account,
    get_new_verification_otp,
    update_student_profile,
    change_profile_status,
    sign_in_with_google,
    update_profiles
}