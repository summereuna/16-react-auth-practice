import { json, redirect } from "react-router-dom";
import AuthForm from "../components/AuthForm";

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

export const action = async ({ request }) => {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get("mode") || "login";

  if (mode !== "login" && mode !== "signup") {
    throw json({ message: "미지원 모드입니다." }, { status: 422 });
  }

  const data = await request.formData();
  const authData = {
    email: data.get("email"),
    password: data.get("password"),
  };

  const response = await fetch(`http://localhost:8080/${mode}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authData),
  });

  if (response.status === 422 || response.status === 401) {
    return response;
  }

  if (!response.ok) {
    throw json({ message: "사용자 인증 불가" }, { status: 500 });
  }

  const resData = await response.json();
  const token = resData.token;

  localStorage.setItem("token", token);

  //1시간 뒤 토큰 만료되도록 계산
  //자바스크립트 내장 객체인 new Date()로 만료 날짜 만들고
  const expiration = new Date();
  //만료 날짜에 setHours() 메서드 호출하여, 만료 날짜의 시간에 1시간을 더한 값을 설정한다.
  expiration.setHours(expiration.getHours() + 1);
  //toISOString()으로 만료일을 표준화된 스트링으로 변환하여 로컬스토리지에 저장한다.
  localStorage.setItem("expiration", expiration.toISOString());

  return redirect("/");
};
