// 1. Grab the elements we need from the page (the DOM)
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const summary = document.getElementById("summary");
const filterButtons = document.querySelectorAll(".filter");

// 2. App state: an array of task objects, loaded from the browser's storage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// 3. Save the tasks so they survive a page refresh
function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// 4. Draw the list on screen from the tasks array
function render() {
  list.innerHTML = "";

  const visible = tasks.filter(function (task) {
    if (currentFilter === "active") return !task.done;
    if (currentFilter === "done") return task.done;
    return true;
  });

  visible.forEach(function (task) {
    const li = document.createElement("li");
    if (task.done) li.classList.add("done");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", function () {
      task.done = checkbox.checked;
      save();
      render();
    });

    const text = document.createElement("span");
    text.textContent = task.text; // textContent is safe: it never runs HTML

    const del = document.createElement("button");
    del.textContent = "Delete";
    del.className = "delete";
    del.addEventListener("click", function () {
      tasks = tasks.filter(function (t) { return t.id !== task.id; });
      save();
      render();
    });

    li.append(checkbox, text, del);
    list.appendChild(li);
  });

  const remaining = tasks.filter(function (t) { return !t.done; }).length;
  summary.textContent = tasks.length === 0
    ? "No tasks yet. Add your first one above."
    : remaining + " of " + tasks.length + " tasks left";
}

// 5. Add a task when the form is submitted
form.addEventListener("submit", function (event) {
  event.preventDefault(); // stop the page from reloading
  const value = input.value.trim();
  if (value === "") return;

  tasks.push({ id: Date.now(), text: value, done: false });
  input.value = "";
  save();
  render();
});

// 6. Switch between All / Active / Done
filterButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    currentFilter = btn.dataset.filter;
    filterButtons.forEach(function (b) { b.classList.remove("active"); });
    btn.classList.add("active");
    render();
  });
});

// 7. Show the list when the page first loads
render();
