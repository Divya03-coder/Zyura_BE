import { Router } from "express";
import auth from "../../middlewares/auth";
import uploader from "../../middlewares/uploader";
import { student_controllers } from "./student.controller";
import RequestValidator from "../../middlewares/request_validator";
import { student_validation } from "./student.validation";

const studentRoute = Router()


studentRoute.patch(
    "/update",
    auth("STUDENT"),
    uploader.single("image"),
    (req, res, next) => {
        req.body = JSON.parse(req?.body?.data);
        next()
    },
    RequestValidator(student_validation.update),
    student_controllers.update_student_profile
)



export default studentRoute;