const today = new Date();
const dateFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "long",
  month: "long",
  day: "numeric",
});

document.getElementById("header-date").textContent = dateFormatter.format(today);
document.getElementById("calendar-today").textContent = dateFormatter.format(today);

const navTabs = document.querySelectorAll(".nav-tab");
const views = document.querySelectorAll(".view");

navTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const targetView = tab.dataset.view;

    navTabs.forEach((t) => {
      t.classList.toggle("border-blue-600", t === tab);
      t.classList.toggle("text-blue-600", t === tab);
      t.classList.toggle("border-transparent", t !== tab);
      t.classList.toggle("text-gray-500", t !== tab);
    });

    views.forEach((view) => {
      view.classList.toggle("hidden", view.id !== `${targetView}-view`);
    });
  });
});
