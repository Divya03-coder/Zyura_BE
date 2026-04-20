import { NextFunction, Request, Response, Router } from "express";
import auth from "../../middlewares/auth";
import uploader from "../../middlewares/uploader";
import RequestValidator from "../../middlewares/request_validator";
import { AppError } from "../../utils/app_error";
import { clinical_case_controllers } from "./clinical_case.controller";
import { clinical_case_validations } from "./clinical_case.validation";

/** Multipart `data` field: JSON object with optional defaults, or omit if all columns are in the sheet */
const parse_bulk_upload_body = (req: Request, _res: Response, next: NextFunction) => {
  const raw = req.body?.data;
  if (raw === undefined || raw === null || raw === "") {
    req.body = {};
    return next();
  }
  if (typeof raw === "object" && !Buffer.isBuffer(raw)) {
    req.body = raw;
    return next();
  }
  if (typeof raw === "string") {
    const t = raw.trim();
    if (t === "") {
      req.body = {};
      return next();
    }
    if (t.startsWith("{") || t.startsWith("[")) {
      try {
        req.body = JSON.parse(t);
      } catch {
        return next(
          new AppError(
            'Form field `data` must be valid JSON (e.g. {"subject":"Medicine","system":"..."}) or leave it empty when the file has subject/system/topic/contentFor/profileType columns.',
            400,
          ),
        );
      }
      return next();
    }
    // Swagger/Postman default "string", typos, etc. — not JSON; defaults from sheet only
    req.body = {};
    return next();
  }
  req.body = {};
  next();
};

const clinical_route = Router();

clinical_route.post(
  "/create-new",
  auth("ADMIN"),
  RequestValidator(clinical_case_validations.create),
  clinical_case_controllers.create_new_clinical_case,
);
clinical_route.post(
  "/upload-bulk",
  auth("ADMIN"),
  uploader.single("file"),
  parse_bulk_upload_body,
  clinical_case_controllers.upload_bulk_clinical_cases,
);
clinical_route.get(
  "/",
  auth("ADMIN", "STUDENT", "PROFESSIONAL", "MENTOR"),
  clinical_case_controllers.get_all_clinical_case,
);
clinical_route.get(
  "/:caseId",
  auth("ADMIN", "STUDENT", "PROFESSIONAL", "MENTOR"),
  clinical_case_controllers.get_single_clinical_case,
);
clinical_route.patch(
  "/:caseId",
  auth("ADMIN", "PROFESSIONAL", "MENTOR"),
  RequestValidator(clinical_case_validations.update),
  clinical_case_controllers.update_clinical_case_by_id,
);
clinical_route.delete(
  "/:caseId",
  auth("ADMIN", "PROFESSIONAL", "MENTOR"),
  clinical_case_controllers.delete_clinical_case_by_id,
);

export default clinical_route;
