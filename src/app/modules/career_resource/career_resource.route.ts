import { Router } from "express";
import auth from "../../middlewares/auth";
import RequestValidator from "../../middlewares/request_validator";
import { career_resource_validation } from "./career_resource.validation";
import { CareerResourceController } from "./career_resource.controller";

const careerResourceRoute = Router();

careerResourceRoute.post(
    "/",
    auth("ADMIN", "MENTOR", "STUDENT"),
    RequestValidator(career_resource_validation.create),
    CareerResourceController.create_career_resource
)



export default careerResourceRoute