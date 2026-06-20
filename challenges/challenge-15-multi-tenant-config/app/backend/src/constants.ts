export const ErrorCode = {
  MISSING_SLUG:      "MISSING_SLUG",
  SLUG_CONFLICT:     "SLUG_CONFLICT",
  VALIDATION_ERROR:  "VALIDATION_ERROR",
  INVALID_VERSION:   "INVALID_VERSION",
  NOT_FOUND:         "NOT_FOUND",
  INTERNAL_ERROR:    "INTERNAL_ERROR",
} as const;

export type ErrorCode = typeof ErrorCode[keyof typeof ErrorCode];

export const ErrorMessage: Record<ErrorCode, string> = {
  MISSING_SLUG:      "slug is required",
  SLUG_CONFLICT:     "Slug already in use",
  VALIDATION_ERROR:  "Validation error",
  INVALID_VERSION:   "version must be an integer",
  NOT_FOUND:         "Resource not found",
  INTERNAL_ERROR:    "Internal server error",
};
