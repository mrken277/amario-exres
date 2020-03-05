/*
 * Event's embeddable script
 */

declare const window: any;

import { generateIntegrationUrl } from "../../utils";

// add iframe
const iframe = document.createElement("iframe");

iframe.src = generateIntegrationUrl("events");
iframe.style.display = "none";

document.body.appendChild(iframe);

// after iframe load send connection info
iframe.onload = async () => {
  iframe.style.display = "block";

  const contentWindow = iframe.contentWindow;

  if (!contentWindow) {
    return;
  }

  const Erxes = {
    sendMessage(action: string, args: any) {
      contentWindow.postMessage(
        {
          fromPublisher: true,
          action,
          args
        },
        "*"
      );
    },

    identifyCustomer(args: any) {
      this.sendMessage("identifyCustomer", args);
    },

    updateCustomerProperty(name: string, value: any) {
      this.sendMessage("updateCustomerProperty", { name, value });
    },

    sendEvent(args: any) {
      this.sendMessage("sendEvent", args);
    }
  };

  window.Erxes = Erxes;

  Erxes.sendMessage("init", { url: window.location.href });
};
