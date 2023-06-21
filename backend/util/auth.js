const { sign, verify } = require("jsonwebtoken"); // 써드파티 패키지 jsonwebtoken 사용하여 토큰 생성
const { compare } = require("bcryptjs");
const { NotAuthError } = require("./errors");

//백엔드만 알 수 있는 private key, 실제로는 코드베이스에 넣어 놓고 쓰지는 않음
const KEY = "supersecret";

function createJSONToken(email) {
  return sign({ email }, KEY, { expiresIn: "1h" });
}
//따라서 토큰은 알고리즘에 따라 생성된 스트링으로 이 KEY를 가지고 등록된다.

function validateJSONToken(token) {
  return verify(token, KEY);
}

function isValidPassword(password, storedPassword) {
  return compare(password, storedPassword);
}

//그러고 나중에 프론트엔드에서 백엔드로 요청을 보내면, 추가 미들웨어를 통해 이 요청들 실행한다.
//백엔드에서 추가 확인을 거쳐 이 요청에 유효한 토큰이 포함되어 있는지 검증하는데, 이 미들웨어를 통해 진행
//이 미들웨어는 백엔드에서 수신하는 요청을 보냄: 유효한 JSON 토큰이 첨부되었는지 확인하는 몇 가지 검사 통해 진행
//토큰 유효성 검증할 때 다시 그 KEY 이용함
function checkAuthMiddleware(req, res, next) {
  if (req.method === "OPTIONS") {
    return next();
  }
  if (!req.headers.authorization) {
    console.log("NOT AUTH. AUTH HEADER MISSING.");
    return next(new NotAuthError("인증되지 않았습니다."));
  }
  const authFragments = req.headers.authorization.split(" ");

  if (authFragments.length !== 2) {
    console.log("NOT AUTH. AUTH HEADER INVALID.");
    return next(new NotAuthError("인증되지 않았습니다."));
  }
  const authToken = authFragments[1];
  try {
    const validatedToken = validateJSONToken(authToken);
    req.token = validatedToken;
  } catch (error) {
    console.log("NOT AUTH. TOKEN INVALID.");
    return next(new NotAuthError("인증되지 않았습니다."));
  }
  next();
}

exports.createJSONToken = createJSONToken;
exports.validateJSONToken = validateJSONToken;
exports.isValidPassword = isValidPassword;
exports.checkAuth = checkAuthMiddleware;
