import { json, redirect } from "react-router-dom";
import AuthForm from "../components/AuthForm";

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

//AuthForm이 있는 라우트와 동일한 라우트인 AuthenticationPage
//AuthForm의 Form이 전송될 때 마다 액션 트리거
export const action = async ({ request }) => {
  //쿼리 매개변수 확인 위해 브라우저 내장 URL 생성자 함수 사용하여 searchParams 객체에 접근
  const searchParams = new URL(request.url).searchParams;
  //mode 잡아오고, 아직 undefined일 경우 기본 값을 login으로 해주고
  const mode = searchParams.get("mode") || "login";

  if (mode !== "login" && mode !== "signup") {
    throw json({ message: "미지원 모드입니다." }, { status: 422 });
  }

  //전송되 폼 데이터에 접근
  const data = await request.formData();
  const authData = {
    email: data.get("email"),
    password: data.get("password"),
  };

  //응답
  const response = await fetch(`http://localhost:8080/${mode}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authData),
  });
  //JSON 포맷으로 변환

  //응답 처리 코드
  //유효하지 않은 자격 증명으로 로그인 시도하여 백엔드에서 오류 받은 경우
  //authForm에 데이터 리턴하여 오류 메시지 보여주기
  if (response.status === 422 || response.status === 401) {
    return response;
  }

  //응답 오류인 경우
  if (!response.ok) {
    throw json({ message: "사용자 인증 불가" }, { status: 500 });
  }

  //응답 성공시 백엔드에서 얻는 토큰 관리...

  //성공시 사용자 홈으로 리다이렉트
  return redirect("/");
};
