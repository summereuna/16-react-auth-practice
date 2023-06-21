import {
  Form,
  Link,
  useActionData,
  useNavigation,
  useSearchParams,
} from "react-router-dom";

import classes from "./AuthForm.module.css";

function AuthForm() {
  //status 422/401이 나올 경우(사용자 인증 문제 발생) 해당 양식 전송한 작업 함수가 리턴한 데이터
  const data = useActionData();

  const [searchParams] = useSearchParams();
  const isLogin = searchParams.get("mode") === "login";

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <>
      <Form method="post" className={classes.form}>
        <h1>{isLogin ? "로그인" : "회원가입"}</h1>
        {/* data가 있고 오류가 발생한게 맞다면, Object.values()를 활용해 errors 객체의 모든 값을 살피기 */}
        {data && data.errors && (
          <ul>
            {Object.values(data.errors).map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        )}
        {data && data.message && <p>{data.message}</p>}
        <p>
          <label htmlFor="email">이메일</label>
          <input id="email" type="email" name="email" required />
        </p>
        <p>
          <label htmlFor="image">비밀번호</label>
          <input id="password" type="password" name="password" required />
        </p>
        <div className={classes.actions}>
          <Link to={`?mode=${isLogin ? "signup" : "login"}`}>
            {isLogin ? "회원가입" : "로그인"}
          </Link>
          <button disabled={isSubmitting}>
            {isSubmitting ? "제출 중..." : "제출"}
          </button>
        </div>
      </Form>
    </>
  );
}

export default AuthForm;
