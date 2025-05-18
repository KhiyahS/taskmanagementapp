let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const list = document.getElementById("task-list");
  list.innerHTML = "";

  let filteredTasks = tasks.filter(task => {
    const statusFilter = document.getElementById("filter-status").value;
    const categoryFilter = document.getElementById("filter-category").value;
    return (!statusFilter || task.status === statusFilter) &&
           (!categoryFilter || task.category === categoryFilter);
  });

  filteredTasks.forEach((task, index) => {
    // check overdue
    if (new Date(task.deadline) < new Date() && task.status !== "Completed") {
      task.status = "Overdue";
    }

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${task.name}</strong> - ${task.category} - ${task.deadline} - 
      <select onchange="updateStatus(${index}, this.value)">
        <option ${task.status === "In Progress" ? "selected" : ""}>In Progress</option>
        <option ${task.status === "Completed" ? "selected" : ""}>Completed</option>
        <option ${task.status === "Overdue" ? "selected" : ""}>Overdue</option>
      </select>
    `;
    list.appendChild(li);
  });

  saveTasks();
}

function updateStatus(index, newStatus) {
  tasks[index].status = newStatus;
  renderTasks();
}

document.getElementById("task-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const name = document.getElementById("task-name").value;
  const category = document.getElementById("task-category").value;
  const deadline = document.getElementById("task-deadline").value;
  const status = document.getElementById("task-status").value;

  tasks.push({ name, category, deadline, status });
  updateCategoryDropdown(category);
  this.reset();
  renderTasks();
});

function updateCategoryDropdown(newCategory) {
  const categoryFilter = document.getElementById("filter-category");
  let found = false;
  for (let i = 0; i < categoryFilter.options.length; i++) {
    if (categoryFilter.options[i].value === newCategory) {
      found = true;
      break;
    }
  }
  if (!found) {
    const option = document.createElement("option");
    option.value = newCategory;
    option.textContent = newCategory;
    categoryFilter.appendChild(option);
  }
}

document.getElementById("filter-category").addEventListener("change", renderTasks);
document.getElementById("filter-status").addEventListener("change", renderTasks);

// Initial render
tasks.forEach(t => updateCategoryDropdown(t.category));
renderTasks();
