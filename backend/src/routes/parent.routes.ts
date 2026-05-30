import { Router } from "express";
import { ParentController } from "../controllers/parent.controller";
import { validateBookOffering } from "../validations/parent.validation";

const router = Router();
const controller = new ParentController();

router.get(
  "/:parentId/offerings",
  controller.getAvailableOfferings
);

// Book an offering
router.post(
  "/:parentId/bookings",
  validateBookOffering,
  controller.bookOffering
);

// Get bookings
router.get(
  "/:parentId/bookings",
  controller.getBookings
);

export default router;
