import { getProjectsByUserClone } from "./projectsManager";
import { getStoredItem, setStoredItem } from "./storageController";

// Initialize:
const taskList = [];
taskList.push(...getStoredItem("taskList"));
// Convert the date strings back to Date() objects:
taskList.forEach((task, index) => {
  taskList[index].dueDate = new Date(task.dueDate);
});

// Factory function to create a new task object
export function createTask(
  linkedProjectId,
  title = "<New Task, please complete>",
  description = "none",
  dueDate = Date(),
  priority
) {
  const id = crypto.randomUUID();
  const isDone = false;

  // Set normal priority as default if invalid priority value received
  // Can this function ever receive a value that is not one of the three allowed?
  if (!["high", "normal", "low"].includes(priority)) priority = "normal";

  return {
    id,
    linkedProjectId,
    title,
    description,
    dueDate,
    priority,
    isDone,
  };
}

export function addTask(project, title, description, dueDate, priority) {
  const newTask = createTask(project, title, description, dueDate, priority);
  if (newTask) {
    taskList.push(newTask);
    setStoredItem("taskList", taskList);
    return true;
  }
}

function getTasksByUser(user) {
  const userProjects = getProjectsByUserClone(user);
  const userProjectsIds = userProjects.map((project) => project.id);
  return taskList.filter((task) =>
    userProjectsIds.includes(task.linkedProjectId)
  );
}

export function getTasksByUserClone(user) {
  const userProjects = getProjectsByUserClone(user);
  const userProjectsIds = userProjects.map((project) => project.id);
  return structuredClone(
    taskList.filter((task) => userProjectsIds.includes(task.linkedProjectId))
  );
}

// This function is a PATCH operation
// Given the simplicity of this domain, it might be more concise to model it as a PUT instead and
// pass the entire task through
export function updateTask(updatedTask) {
  const currentTask = taskList.find((task) => task.id === updatedTask.id);
  if (updatedTask.title) currentTask.title = updatedTask.title;
  if (updatedTask.description)
    currentTask.description = updatedTask.description;
  if (updatedTask.dueDate) currentTask.dueDate = updatedTask.dueDate;
  if (updatedTask.priority) currentTask.priority = updatedTask.priority;
  if (updatedTask.isDone || updatedTask.isDone === false)
    currentTask.isDone = updatedTask.isDone;
  setStoredItem("taskList", taskList);
}

export function deleteTaskByTaskId(taskId) {
  // .filter()
  taskList.splice(
    taskList.findIndex((task) => task.id === taskId),
    1
  );
  setStoredItem("taskList", taskList);
}

export function deleteTasksByProjectId(projectId) {
  // Array.filter() would be easier to read. Idiomatic JS tends to use array methods as much as possible for iteration
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].linkedProjectId === projectId) {
      taskList.splice(i, 1);
      i--; // avoid missing the next element now moved back by one index value
    }
  }
  setStoredItem("taskList", taskList);
}

export function deleteTasksByUser(user) {
  // .filter()
  const userTasks = getTasksByUser(user);
  for (let i = 0; i < taskList.length; i++) {
    if (userTasks.includes(taskList[i])) {
      taskList.splice(i, 1);
      i--; // avoid missing the next element now moved back by one index value
    }
  }
  setStoredItem("taskList", taskList);
}
