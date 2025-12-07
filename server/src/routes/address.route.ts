import express from "express";
import { Authenticate } from "../middlewares/verify.middleware";
import { AsyncHandler } from "../utils/async.handler";
import AddressController from "../controllers/address.controller";
import { validate } from "../middlewares/validate.middleware";
import { addressCreateSchema, addressUpdateSchema } from "../validators/address.validator";

const router = express.Router();

/**
 * POST /api/v1/address
 * @description Lấy danh sách địa chỉ đã lưu của người dùng
 * @access Authenticated
 */
router.get("/", Authenticate, AsyncHandler(AddressController.List));
router.get("/:userId", Authenticate, AsyncHandler(AddressController.ListAddressByUserId));

/**
 * POST /api/v1/address
 * @description Thêm địa chỉ mới
 * @body street: string, city: string, country: string, state?, postalCode?, label?, fullName?, phone?, isDefault?
 * @access Authenticated
 */
router.post("/", Authenticate, validate(addressCreateSchema), AsyncHandler(AddressController.Create));

/**
 * PUT /api/v1/address/:addressId
 * @description Cập nhật địa chỉ đã lưu
 * @param addressId: string
 * @body các trường địa chỉ (tùy chọn)
 * @access Authenticated
 */
router.put("/:addressId", Authenticate, validate(addressUpdateSchema), AsyncHandler(AddressController.Update));

/**
 * DELETE /api/v1/address/:addressId
 * @description Xoá địa chỉ
 * @param addressId: string
 * @access Authenticated
 */
router.delete("/:addressId", Authenticate, AsyncHandler(AddressController.Delete));

/**
 * PATCH /api/v1/address/:addressId/default
 * @description Đặt địa chỉ làm mặc định
 * @param addressId: string
 * @access Authenticated
 */
router.patch("/:addressId/default", Authenticate, AsyncHandler(AddressController.SetDefault));

export default router;
