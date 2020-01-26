import { getEnv } from "../simpleUtils";

window.addEventListener("message", event => {
  const { data } = event;

  if (!data.fromPublisher || data.action !== "sendEvent") {
    return;
  }

  const { API_URL } = getEnv();

  const url = `${API_URL}/receive-event`;

  fetch(url, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ ...data.event })
  }).catch(errorResponse => {
    console.log(errorResponse);
  });
});
