import { Router } from "express";
import auth from "../../middlewares/auth";
import RequestValidator from "../../middlewares/request_validator";
import uploader from "../../middlewares/uploader";
import { auth_controllers } from "./auth.controller";
import { auth_validation } from "./auth.validation";

const authRoute = Router();

authRoute.post("/register", RequestValidator(auth_validation.register_validation), auth_controllers.register_user);
authRoute.post("/login", RequestValidator(auth_validation.login_validation), auth_controllers.login_user);
// authRoute.post("/verified-account", RequestValidator(auth_validation.verified_account), auth_controllers.verified_account);
// authRoute.post("/new-verification-otp", RequestValidator(auth_validation.newVerificationOtp), auth_controllers.get_new_verification_otp);
authRoute.post("/forgot-password", RequestValidator(auth_validation.forgotPassword), auth_controllers.forget_password);
authRoute.post("/reset-password", RequestValidator(auth_validation.resetPassword), auth_controllers.reset_password);
authRoute.post("/change-password", auth("STUDENT", "MENTOR", "PROFESSIONAL", "ADMIN"), RequestValidator(auth_validation.changePassword), auth_controllers.change_password);
authRoute.post("/change-status", auth("ADMIN"), RequestValidator(auth_validation.change_profile_status), auth_controllers.change_profile_status);
authRoute.post("/sign-in-with-google", RequestValidator(auth_validation.sign_in_with_google), auth_controllers.sign_in_with_google);
authRoute.get('/me', auth("STUDENT", "MENTOR", "PROFESSIONAL", "ADMIN"), auth_controllers.get_my_profile);
authRoute.post('/refresh-token', auth_controllers.refresh_token);
authRoute.patch(
    "/update-initial-profile",
    auth("STUDENT", "MENTOR", "PROFESSIONAL", "ADMIN"),
    uploader.single("image"),
    (req, res, next) => {
        if (req?.body) {
            req.body = JSON.parse(req?.body?.data);
        }
        next();
    },
    RequestValidator(auth_validation.updateProfile),
    auth_controllers.update_student_profile
);
authRoute.put('/update-profiles',
    auth("STUDENT", "MENTOR", "PROFESSIONAL"),
    uploader.single("image"),
    (req, res, next) => {
        if (req?.body) {
            req.body = JSON.parse(req?.body?.data);
        }
        next();
    },
    auth_controllers.update_profiles);

export default authRoute;
