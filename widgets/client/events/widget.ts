import { generateIntegrationUrl } from "../simpleUtils";

/*
 * Events embeddable script
 */

declare const window: any;

const iframeId = "erxes-events-iframe";

// add iframe
const iframe = document.createElement("iframe");

iframe.id = iframeId;
iframe.src = generateIntegrationUrl("events");
iframe.style.display = "none";

// after iframe load send connection info
iframe.onload = async () => {
  iframe.style.display = "block";

  const contentWindow = iframe.contentWindow;

  if (!contentWindow) {
    return;
  }

  window.Erxes = {
    sendEvent: (name: string, data: any) => {
      contentWindow.postMessage(
        {
          fromPublisher: true,
          action: "sendEvent",
          event: {
            name,
            data
          }
        },
        "*"
      );
    }
  };
};

document.body.appendChild(iframe);
