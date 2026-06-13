/**
 * Extract the human-readable message from any API response.
 * API shape: { msg, success, code, error, data }
 */
export function apiMsg(res, fallback = "Something went wrong") {
  return res?.msg || fallback;
}

/**
 * Parse field-level validation errors from error.details into a flat map.
 * Returns { field_name: "error message" }
 */
export function fieldErrors(res) {
  const details = res?.error?.details;
  if (!Array.isArray(details)) return {};
  return details.reduce((acc, d) => {
    const field = d.loc?.[d.loc.length - 1];
    if (field) acc[field] = d.msg;
    return acc;
  }, {});
}

/** True when response is a 401 token error */
export function isTokenError(res) {
  return !res?.success && (res?.msg === "Invalid token" || res?.msg === "Token expired");
}
