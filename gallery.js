const works = Array.from(document.querySelectorAll(".work"));
const filters = document.querySelectorAll("[data-filter]");
const count = document.querySelector(".gallery-count");
const viewer = document.querySelector(".viewer");
const viewerImage = viewer.querySelector("img");
const viewerPosition = viewer.querySelector(".viewer-position");
const viewerTitle = viewer.querySelector("h2");
const viewerControls = viewer.querySelectorAll("[data-step]");
const number = new Intl.NumberFormat("ar-SA");

let displayedWorks = works;
let currentIndex = 0;
let opener;

function renderFilter(category) {
  for (const filter of filters) {
    filter.setAttribute("aria-pressed", String(filter.dataset.filter === category));
  }
  for (const work of works) {
    work.hidden = category !== "all" && work.dataset.category !== category;
  }
  displayedWorks = works.filter((work) => !work.hidden);
  count.textContent = `${number.format(displayedWorks.length)} من ${number.format(works.length)} تصاميم`;
}

function showDesign(index) {
  currentIndex = (index + displayedWorks.length) % displayedWorks.length;
  const work = displayedWorks[currentIndex];
  const image = work.querySelector("img");
  viewerImage.src = image.src;
  viewerImage.alt = image.alt;
  viewerImage.classList.toggle("boxed", Boolean(work.querySelector(".edition-art")));
  viewerTitle.textContent = work.querySelector("strong").textContent;
  viewer.querySelector(".viewer-category").textContent = work.querySelector(".work-type").textContent;
  viewer.querySelector(".viewer-description").textContent = work.querySelector(".work-description").textContent;
  viewerPosition.textContent = `${number.format(currentIndex + 1)} / ${number.format(displayedWorks.length)}`;
}

for (const filter of filters) {
  filter.addEventListener("click", () => renderFilter(filter.dataset.filter));
}

for (const work of works) {
  const button = work.querySelector("button");
  button.addEventListener("click", () => {
    opener = button;
    showDesign(displayedWorks.indexOf(work));
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

renderFilter("all");
