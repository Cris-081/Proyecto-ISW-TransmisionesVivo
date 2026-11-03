export function handleSuccess(res, statusCode, message, data = null) {
  return res.status(statusCode).json({ status: "Success", message, data });
}

export function handleErrorClient(res, statusCode, message) {
  return res.status(statusCode).json({ status: "Client Error", message });
}

export function handleErrorServer(res, statusCode, message, details = null) {
  return res.status(statusCode).json({ status: "Server Error", message, details });
}
