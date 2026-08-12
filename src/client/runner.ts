const setKeyButton = document.getElementById("setKey") as HTMLButtonElement;
const stopButton = document.getElementById("stop") as HTMLButtonElement;
const buildingDropdown = document.getElementById(
  "buildingDropdown",
) as HTMLSelectElement;
setKeyButton.onclick = () => {
  const key = buildingDropdown.value;
  window.autoclicker.setKey(key);
};
stopButton.onclick = window.autoclicker.stop;
