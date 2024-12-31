import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "crypto";
import {
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import jwt from "jsonwebtoken";
import { TOKEN_TYPES } from "../constants.js";
import { config } from "../../config/index.js";

// Method to validate an email
export const validateEmail = (email) => {
  try {
    return validator.isEmail(email);
  } catch (error) {
    console.error(`Error in validateEmail: ${error.message}`);
    return false;
  }
};

// Method to validate a password
export const validatePassword = (password) => {
  try {
    return validator.isStrongPassword(password);
  } catch (error) {
    console.error(`Error in validatePassword: ${error.message}`);
    return false;
  }
};

// Method to validate a phone number
export const validatePhoneNumber = (phoneNumber) => {
  try {
    return isValidPhoneNumber(phoneNumber);
  } catch (error) {
    console.error(`Error in validatePhoneNumber: ${error.message}`);
    return false;
  }
};

// Method to validate json body
export const validateIncomingJson = (jsonBody) => {
  try {
    return validator.isJSON(JSON.stringify(jsonBody));
  } catch (error) {
    console.error(`Error in validateIncomingJson: ${error.message}`);
    return false;
  }
};

// Method to validate a number
export const validateNumeric = (numericValue) => {
  return validator.isInt(numericValue);
};

// Method to format a phone number
export const formatPhoneNumber = (phoneNumber) => {
  const parsedPhoneNumber = parsePhoneNumber(phoneNumber);

  const transformedPhoneNumber = `+${parsedPhoneNumber.countryCallingCode}-${parsedPhoneNumber.nationalNumber}`;

  return transformedPhoneNumber;
};

// Method to generate otp
export const generateRandomOTP = async (OTP_DIGITS = 6) => {
  return crypto.randomInt(111111, 999999).toString();
};

// Method to validate a name
export const validatePureName = (name) => {
  try {
    return validator.isAlpha(name.replace(/\s/g, ""));
  } catch (error) {
    console.error(`Error in validateName: ${error.message}`);
    return false;
  }
};

// Method to validate alphanumeric string
export const validateAlphanumeric = (string) => {
  try {
    return validator.isAlphanumeric(string.replace(/\s/g, ""));
  } catch (error) {
    console.error(`Error in validateAlphanumeric: ${error.message}`);
    return false;
  }
};

// Method to validate alphanumeric string with allowed special characters
export const validateAlphanumericWithSpecialChars = (string) => {
  try {
    return validator.isAlphanumeric(string.replace(/\s/g, ""), "en-US", {
      ignore: "-'#$@!_*&^%(){}|\\/",
    });
  } catch (error) {
    console.error(
      `Error in validateAlphanumericWithSpecialChars: ${error.message}`
    );
    return false;
  }
};

// Validate and parse phone number
export const parsePhoneNumber = (phoneNumber, countryCode) => {
  try {
    return parsePhoneNumberFromString(phoneNumber);
  } catch (error) {
    console.error(`Error in parsePhoneNumber: ${error.message}`);
    return null;
  }
};

// Method to generate a random string of a given length
export const generateRandomString = (length = 6) => {
  try {
    return crypto.randomUUID().split("-")[0].toUpperCase();
  } catch (error) {
    console.error(`Error in generateRandomString: ${error.message}`);
    return null;
  }
};

// Method to get file path from a supabase URL
export const getFilePathFromUrl = (url) => {
  try {
    return url.split("/").slice(-2).join("/");
  } catch (error) {
    console.error(`Error in getFilePathFromUrl: ${error.message}`);
    return null;
  }
};

// Method to hash a password
export const hashPassword = (password) => {
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    return {
      success: true,
      data: hashedPassword,
    };
  } catch (error) {
    console.error(`Error in hashPassword: ${error.message}`);
    return {
      success: false,
      message: error.message,
    };
  }
};

// Method to compare a password with a hashed password
export const comparePassword = async (password, hashedPassword) => {
  try {
    const isPasswordValid = bcrypt.compareSync(password, hashedPassword);
    return isPasswordValid;
  } catch (error) {
    console.error(`Error in comparePassword: ${error.message}`);
    return false;
  }
};

export const generateJwtToken = (
  payload,
  tokenType = TOKEN_TYPES.ACCESS,
  isApp = false
) => {
  try {
    const secret =
      tokenType === TOKEN_TYPES.ACCESS
        ? config.JWT.ACCESS_TOKEN.SECRET
        : config.JWT.REFRESH_TOKEN.SECRET;

    const token = jwt.sign(payload, secret, {
      expiresIn:
        tokenType === TOKEN_TYPES.ACCESS
          ? isApp
            ? config.JWT.ACCESS_TOKEN.APP_EXPIRES_IN
            : config.JWT.ACCESS_TOKEN.EXPIRES_IN
          : config.JWT.REFRESH_TOKEN.EXPIRES_IN,
    });
    return {
      success: true,
      data: token,
    };
  } catch (error) {
    console.error(`Error in generateJwtToken: ${error.message}`);
    return {
      success: false,
      message: error.message,
    };
  }
};

export const validateHourMinTime = (time) => {
  try {
    const timeArray = time.split(":");
    if (timeArray.length !== 2) {
      return false;
    }

    const hours = parseInt(timeArray[0]);
    const minutes = parseInt(timeArray[1]);

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error in validateHourMinTime: ${error.message}`);
    return false;
  }
};

// Method to decode a jwt token
export const decodeJwtToken = (token, tokenType = TOKEN_TYPES.ACCESS) => {
  try {
    const secret =
      tokenType === TOKEN_TYPES.ACCESS
        ? config.JWT.ACCESS_TOKEN.SECRET
        : config.JWT.REFRESH_TOKEN.SECRET;

    const decoded = jwt.verify(token, secret);
    return {
      success: true,
      data: decoded,
    };
  } catch (error) {
    console.error(`Error in decodeJwtToken: ${error.message}`);
    return {
      success: false,
      message: error.message,
    };
  }
};