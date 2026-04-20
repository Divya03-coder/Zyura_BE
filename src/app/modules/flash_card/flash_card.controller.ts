import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import { flash_card_services } from "./flash_card.service";

const create_flash_card_post = catchAsync(async (req, res) => {
  const result = await flash_card_services.create_new_flash_card_in_db(req);
  manageResponse(res, {
    statusCode: 201,
    message: "flash card created success!",
    success: true,
    data: result,
  });
});
const create_new_manual_flash_card = catchAsync(async (req, res) => {
  const result = await flash_card_services.create_new_manual_flash_card_in_db(req);
  manageResponse(res, {
    statusCode: 201,
    message: "flash card created success!",
    success: true,
    data: result,
  });
});
const get_all_flash_cards = catchAsync(async (req, res) => {
  const result = await flash_card_services.get_all_flash_cards_from_db(req);
  manageResponse(res, {
    statusCode: 200,
    message: "Flash card fetch  success!",
    success: true,
    data: result?.data,
    meta: result?.meta
  });
});
const get_single_flash_card = catchAsync(async (req, res) => {
  const result = await flash_card_services.get_single_flash_card_from_db(req);
  manageResponse(res, {
    statusCode: 200,
    message: "Flash card fetch  success!",
    success: true,
    data: result?.data,
    meta: result?.meta
  });
});
const get_specific_flashcard_bank_with_index = catchAsync(async (req, res) => {
  const result = await flash_card_services.get_specific_flashcard_bank_with_index_from_db(req);
  manageResponse(res, {
    statusCode: 200,
    message: "Flash card fetch  success!",
    success: true,
    data: result
  });
});
const update_specific_flashcard = catchAsync(async (req, res) => {
  const { flashCardBankId, flashCardId } = req.params;
  const result = await flash_card_services.update_specific_flashcard_into_db(flashCardBankId as string, flashCardId as string, req.body);
  manageResponse(res, {
    statusCode: 200,
    message: "Flash card update success!",
    success: true,
    data: result
  });
});
const delete_flashCard_bank = catchAsync(async (req, res) => {
  const { flashCardBankId } = req.params;
  const result = await flash_card_services.delete_flashCard_bank_from_db(flashCardBankId as string);
  manageResponse(res, {
    statusCode: 200,
    message: "Flash Card bank delete success!",
    success: true,
    data: result
  });
});
const delete_single_flashcard = catchAsync(async (req, res) => {
  const result = await flash_card_services.delete_single_flashcard_from_db(req);
  manageResponse(res, {
    statusCode: 200,
    message: "Flash Card delete success!",
    success: true,
    data: result
  });
});
const upload_more_flash_card_into_existing_bank = catchAsync(async (req, res) => {
  const result = await flash_card_services.upload_more_flash_card_into_existing_bank_in_db(req);
  manageResponse(res, {
    statusCode: 200,
    message: "Flash Card updated success!",
    success: true,
    data: result
  });
});



export const flash_card_controller = {
  create_flash_card_post,
  get_all_flash_cards,
  get_single_flash_card,
  get_specific_flashcard_bank_with_index,
  update_specific_flashcard,
  delete_flashCard_bank,
  delete_single_flashcard,
  create_new_manual_flash_card,
  upload_more_flash_card_into_existing_bank
};
