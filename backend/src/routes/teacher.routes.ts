import { Router } from "express";
import { TeacherController } from "../controllers/teacher.controller";
import { validateCreateOffering, validateAddSessions } from "../validations/teacher.validation";

const router = Router();
const controller = new TeacherController();

// Create a new offering
router.post(
  "/:teacherId/offerings",
  validateCreateOffering,
  controller.createOffering
);

// Add sessions to an offering
router.post(
  "/:teacherId/offerings/:offeringId/sessions",
  validateAddSessions,
  controller.addSessions
);

// Get teacher offerings
router.get(
  "/:teacherId/offerings",
  controller.getOfferings
);

export default router;
