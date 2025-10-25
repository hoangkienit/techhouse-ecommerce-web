import express from "express";
import { Authenticate } from "../middlewares/verify.middleware";
import { AsyncHandler } from "../utils/async.handler";
import AddressController from "../controllers/address.controller";
import { validate } from "../middlewares/validate.middleware";
import { addressCreateSchema, addressUpdateSchema } from "../validators/address.validator";

const router = express.Router();

router.get("/", Authenticate, AsyncHandler(AddressController.List));
router.post("/", Authenticate, validate(addressCreateSchema), AsyncHandler(AddressController.Create));
router.put("/:addressId", Authenticate, validate(addressUpdateSchema), AsyncHandler(AddressController.Update));
router.delete("/:addressId", Authenticate, AsyncHandler(AddressController.Delete));
router.patch("/:addressId/default", Authenticate, AsyncHandler(AddressController.SetDefault));

export default router;
