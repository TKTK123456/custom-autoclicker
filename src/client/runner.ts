import { RateLimitInfo } from "../shared/sharedTypes.js";

const setKeyButton = document.getElementById("setKey") as HTMLButtonElement;
const stopButton = document.getElementById("stop") as HTMLButtonElement;
const rateLimitAmount = document.getElementById(
  "rateLimitAmount",
) as HTMLSpanElement;
const rateLimitMax = document.getElementById("rateLimitMax") as HTMLSpanElement;
const buildingDropdown = document.getElementById(
  "buildingDropdown",
) as HTMLSelectElement;
setKeyButton.onclick = () => {
  const key = buildingDropdown.value;
  window.autoclicker.setKey(key);
};
stopButton.onclick = window.autoclicker.stop;

window.autoclicker.onRateLimitInfo((data: RateLimitInfo) => {
  rateLimitAmount.innerText = data.amount.toString();
  rateLimitMax.innerText = data.max.toString();
});
