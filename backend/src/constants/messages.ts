export const SUCCESS_MESSAGES = {
  OFFERING_CREATED: "Offering created successfully",
  SESSIONS_ADDED: "Sessions added to offering successfully",
  TEACHER_OFFERINGS_FETCHED: "Teacher offerings retrieved successfully",
  AVAILABLE_OFFERINGS_FETCHED: "Available offerings retrieved successfully",
  BOOKING_SUCCESSFUL: "Offering booked successfully",
  BOOKINGS_FETCHED: "Bookings retrieved successfully",
} as const;

export const ERROR_MESSAGES = {
  TEACHER_NOT_FOUND: "Teacher not found",
  PARENT_NOT_FOUND: "Parent not found",
  COURSE_NOT_FOUND: "Course not found",
  OFFERING_NOT_FOUND: "Offering not found",
  OFFERING_NOT_AVAILABLE: "Offering is no longer available for booking",
  SESSION_OVERLAP_CONFLICT: "Booking failed: One or more sessions in this offering overlap with your existing bookings",
  INVALID_INPUT: "Invalid input provided",
  ROUTE_NOT_FOUND: "Requested resource not found",
  INTERNAL_SERVER_ERROR: "An unexpected error occurred",
} as const;
