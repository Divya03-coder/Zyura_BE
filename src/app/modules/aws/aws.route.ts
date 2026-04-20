import { Router } from "express";
import uploader from "../../middlewares/uploader";
import { aws_controller } from "./aws.controller";

const aws_router = Router();

aws_router.post(
  "/upload-single-image",
  uploader.single("image"),
  aws_controller.create_new_aws
);

export default aws_router;
