function isValidText(value, minLength = 1) {
  return value && value.trim().length >= minLength;
}

function isValidDate(value) {
  const date = new Date(value);
  return value && date !== "유효하지 않은 날짜입니다.";
}

function isValidImageUrl(value) {
  return value && value.startsWith("http");
}

function isValidEmail(value) {
  return value && value.includes("@");
}

exports.isValidText = isValidText;
exports.isValidDate = isValidDate;
exports.isValidImageUrl = isValidImageUrl;
exports.isValidEmail = isValidEmail;
