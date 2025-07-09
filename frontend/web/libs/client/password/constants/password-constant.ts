export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_MAX_LENGTH = 50

// At least 1 Capital letter, 1 lowercase letter, 1 digit, 1 special character
export const PASSWORD_VERIFY_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;