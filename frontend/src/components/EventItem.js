import { Link, useRouteLoaderData, useSubmit } from "react-router-dom";

import classes from "./EventItem.module.css";

function EventItem({ event }) {
  const submit = useSubmit();

  function startDeleteHandler() {
    const proceed = window.confirm("정말 삭제 하시겠습니까?");

    if (proceed) {
      submit(null, { method: "delete" });
    }
  }

  const token = useRouteLoaderData("root");

  return (
    <article className={classes.event}>
      <img src={event.image} alt={event.title} />
      <h1>{event.title}</h1>
      <time>{event.date}</time>
      <p>{event.description}</p>
      {token && (
        <menu className={classes.actions}>
          <Link to="edit">수정</Link>
          <button onClick={startDeleteHandler}>삭제</button>
        </menu>
      )}
    </article>
  );
}

export default EventItem;
