const works = Array.from(document.querySelectorAll(".work"));
const viewer = document.querySelector(".viewer");
const viewerImage = viewer.querySelector("img");
const viewerPosition = viewer.querySelector(".viewer-position");
const viewerTitle = viewer.querySelector("h2");
const viewerControls = viewer.querySelectorAll("[data-step]");
const number = new Intl.NumberFormat("ar-SA");

let currentIndex = 0;
let opener;

function showDesign(index) {
  currentIndex = (index + works.length) % works.length;
  const work = works[currentIndex];
  const image = work.querySelector("img");
  viewerImage.src = image.src;
  viewerImage.alt = image.alt;
  viewerTitle.textContent = work.querySelector("strong").textContent;
  viewer.querySelector(".viewer-category").textContent = work.querySelector(".work-type").textContent;
  viewer.querySelector(".viewer-description").textContent = work.querySelector(".work-description").textContent;
  viewerPosition.textContent = `${number.format(currentIndex + 1)} / ${number.format(works.length)}`;
}

for (const work of works) {
  const button = work.querySelector("button");
  button.addEventListener("click", () => {
    opener = button;
    showDesign(works.indexOf(work));
    viewer.showModal();
  });
}

for (const control of viewerControls) {
  control.addEventListener("click", () => showDesign(currentIndex + Number(control.dataset.step)));
}

viewer.addEventListener("keydown", (event) => {
  const steps = { ArrowRight: -1, ArrowLeft: 1 };
  const step = steps[event.key];
  if (step) {
    event.preventDefault();
    showDesign(currentIndex + step);
  }
});

viewer.addEventListener("click", (event) => {
  if (event.target === viewer) viewer.close();
});
viewer.addEventListener("close", () => opener?.focus());


const picks = Array.from(document.querySelectorAll("[data-pick]"));
const pickStatus = document.querySelector("[data-pick-status]");
let activePick = 0;

for (const button of document.querySelectorAll("[data-pick-step]")) {
  button.addEventListener("click", () => {
    picks[activePick].hidden = true;
    const step = Number(button.dataset.pickStep);
    activePick = (activePick + step + picks.length) % picks.length;
    picks[activePick].hidden = false;
    pickStatus.textContent = `${number.format(activePick + 1)} من ${number.format(picks.length)}`;
  });
}
