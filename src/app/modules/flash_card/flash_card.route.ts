import { Router } from "express";
import auth from "../../middlewares/auth";
import RequestValidator from "../../middlewares/request_validator";
import uploader from "../../middlewares/uploader";
import { flash_card_controller } from "./flash_card.controller";
import { flash_card_validation } from "./flash_card.validation";

const flash_card_router = Router();


flash_card_router.post(
  "/bulk-create",
  auth("ADMIN"),
  uploader.single("file"),
  (req, res, next) => {
    if (req.body?.data) {
      req.body = JSON.parse(req.body.data)
    }
    next();
  },
  flash_card_controller.create_flash_card_post
);
flash_card_router.post(
  "/manual-create",
  auth("ADMIN"),
  RequestValidator(flash_card_validation.create),
  flash_card_controller.create_new_manual_flash_card
);
flash_card_router.get("/all", auth("ADMIN", "STUDENT", "MENTOR", "PROFESSIONAL"), flash_card_controller.get_all_flash_cards)
flash_card_router.get("/single/:flashCardId", auth("ADMIN", "STUDENT", "MENTOR", "PROFESSIONAL"), flash_card_controller.get_single_flash_card)
flash_card_router.get("/specific/:flashCardBankId/:flashCardId", auth("ADMIN", "STUDENT", "MENTOR", "PROFESSIONAL"), flash_card_controller.get_specific_flashcard_bank_with_index)
flash_card_router.patch("/update/:flashCardBankId/:flashCardId", auth("ADMIN"), RequestValidator(flash_card_validation.update), flash_card_controller.update_specific_flashcard)
flash_card_router.delete("/delete/:flashCardBankId", auth("ADMIN"), flash_card_controller.delete_flashCard_bank)
flash_card_router.delete("/delete-single/:flashCardBankId/:flashCardId", auth("ADMIN"), flash_card_controller.delete_single_flashcard)
flash_card_router.put(
  "/upload-more-flash-card/:flashCardBankId",
  auth("ADMIN"),
  uploader.single("file"),
  (req, res, next) => {
    if (req.body?.data) {
      req.body = JSON.parse(req.body.data)
    }
    next();
  },
  flash_card_controller.upload_more_flash_card_into_existing_bank)

export default flash_card_router;