import { redirect } from "react-router-dom";

//만료날짜 살펴보고 만료 여부 확인하기
export const getTokenDuration = () => {
  //로컬스토리지에서 저장된 만료 날짜 가져오기
  const storedExpirationDate = localStorage.getItem("expiration");
  //Date 객체로 변환
  const expirationDate = new Date(storedExpirationDate);
  //현 시각
  const now = new Date();

  //잔여 유효 기간: getTime()은 ms초 단위 리턴해줌
  //만료 시각 타임스탬프 - 현재 시각 타임스탬프
  const duration = expirationDate.getTime() - now.getTime();
  //유효하면 양수(+), 토큰 만료되면 음수(-)

  return duration;
};

export const getAuthToken = () => {
  const token = localStorage.getItem("token");

  //토큰이 아에 없으면 아무 것도 리턴하지 않고
  if (!token) {
    return null;
  }

  const tokenDuration = getTokenDuration();

  //토큰이 존재하면 만료 시기 확인
  //토큰 만료 된 경우 (음수)
  if (tokenDuration < 0) {
    return "EXPIRED";
  }

  return token;
};

export const tokenLoader = () => {
  return getAuthToken();
};

export const checkAuthLoader = () => {
  const token = getAuthToken();

  if (!token) {
    return redirect("/auth?mode=signup");
  }

  return null;
};
