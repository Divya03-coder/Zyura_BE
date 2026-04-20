import { Router } from "express";
import auth from "../../middlewares/auth";
import RequestValidator from "../../middlewares/request_validator";
import { admin_controller } from "./admin.controller";
import { Admin_Validation } from "./admin.validation";

const adminRouter = Router();

adminRouter.get("/overview", auth("ADMIN"), admin_controller.get_all_overview_data)
adminRouter.get("/monthly-activities", auth("ADMIN"), admin_controller.get_monthly_activities)

// for student
adminRouter.get("/students", auth("ADMIN", "MENTOR", "PROFESSIONAL"), admin_controller.get_all_student)
adminRouter.get("/student/:studentId", auth("ADMIN", "STUDENT", "MENTOR", "PROFESSIONAL"), admin_controller.get_single_student)
adminRouter.delete("/student/:studentId", auth("ADMIN"), admin_controller.delete_student)

// for professional
adminRouter.get("/professionals", auth("ADMIN", "STUDENT", "MENTOR", "PROFESSIONAL"), admin_controller.get_all_professional)
adminRouter.get("/professional/:accountId", auth("ADMIN", "STUDENT", "MENTOR", "PROFESSIONAL"), admin_controller.get_single_professional)
adminRouter.delete("/professional/:accountId", auth("ADMIN"), admin_controller.delete_professional)

// for mentor
adminRouter.get("/mentors", auth("ADMIN", "STUDENT", "PROFESSIONAL"), admin_controller.get_all_mentor)
adminRouter.get("/mentor/:accountId", auth("ADMIN", "STUDENT", "MENTOR", "PROFESSIONAL"), admin_controller.get_single_mentor)
adminRouter.delete("/mentor/:accountId", auth("ADMIN"), admin_controller.delete_mentor)

// for admin config
adminRouter.get("/admins", auth("ADMIN"), admin_controller.get_all_admin)
adminRouter.post("/admins/create-new-admin", auth("ADMIN"), RequestValidator(Admin_Validation.create_new_admin_validation), admin_controller.create_new_admin)
adminRouter.delete("/admins/:adminId", auth("ADMIN"), admin_controller.delete_admin)

export default adminRouter;