const {
  apiRequest,
} = require("./api");

/**
 * Request OTP
 */
const requestOtp =
  async (
    phone_number
  ) => {
    return apiRequest({
      endpoint:
        "/auth/otp/request",

      method: "POST",

      body: {
        phone_number,
      },
    });
  };

/**
 * Verify OTP
 */
const verifyOtp =
  async ({
    phone_number,
    otp_code,
  }) => {
    return apiRequest({
      endpoint:
        "/auth/otp/verify",

      method: "POST",

      body: {
        phone_number,
        otp_code,
      },
    });
  };

module.exports = {
  requestOtp,
  verifyOtp,
};