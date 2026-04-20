import { Router } from "express";
import auth from "../../middlewares/auth";
import RequestValidator from "../../middlewares/request_validator";
import uploader from "../../middlewares/uploader";
import { resource_controller } from "./resource.controller";
import { resource_validations } from "./resource.validation";

const resource_router = Router();

resource_router.post(
  "/career",
  auth("ADMIN"),
  uploader.single("file"),
  (req, res, next) => {
    req.body = JSON.parse(req?.body?.data);
    next()
  },
  RequestValidator(resource_validations.create_career),
  resource_controller.create_new_resource
);

resource_router.get("/career", resource_controller.get_all_career_resource);
resource_router.get("/career/:id", resource_controller.get_single_career_resource);

resource_router.patch("/career/:id",
  auth("ADMIN"),
  uploader.single("file"),
  (req, res, next) => {
    req.body = JSON.parse(req?.body?.data);
    next()
  },
  RequestValidator(resource_validations.update_career),
  resource_controller.update_career_resource);

resource_router.delete("/career/:id", resource_controller.delete_single_career_resource);

// book part

resource_router.post(
  "/books",
  auth("ADMIN"),
  uploader.single("file"),
  (req, res, next) => {
    req.body = JSON.parse(req?.body?.data);
    next()
  },
  RequestValidator(resource_validations.upload_book),
  resource_controller.create_new_book
);

resource_router.get("/books", resource_controller.get_all_book);
resource_router.get("/books/:id", resource_controller.get_single_book);

resource_router.patch("/books/:id",
  auth("ADMIN"),
  uploader.single("file"),
  (req, res, next) => {
    req.body = JSON.parse(req?.body?.data);
    next()
  },
  RequestValidator(resource_validations.update_book),
  resource_controller.update_book);

resource_router.delete("/books/:id", resource_controller.delete_book);





export default resource_router;
