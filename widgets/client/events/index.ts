import { getEnv } from "../simpleUtils";

window.addEventListener("message", event => {
  const { data } = event;

  if (!data.fromPublisher || data.action !== "sendEvent") {
    return;
  }

  const { API_URL } = getEnv();

  const url = `${API_URL}/receive-event`;

  fetch(url, { method: "post", body: data.event }).catch(errorResponse => {
    console.log(errorResponse);
  });
});
