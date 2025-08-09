import { deleteTasksByProjectId } from "./tasksManager";
import { getStoredItem, setStoredItem } from "./storageController";
// Initialization:
const projectList = [];
projectList.push(...getStoredItem("projectList"));

// You could consider different data structures other than arrays
// Map would be a good option here because each key is unique and the value can be anything
// So you could have a Map where each key is a unique identifier associated to the user and the value is an array of their projects
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map

// Factory function to create and return a new project object
function createProject(linkedUser, name) {
  // Make unique id "default" for the default project
  const id = crypto.randomUUID();

  return {
    id,
    name,
    linkedUserId: linkedUser.username,
  };
}

export function addProject(linkedUser, projectName) {
  const newProject = createProject(linkedUser, projectName); // Can this function ever not return a newProject object
  if (newProject) {
    projectList.push(newProject);
    setStoredItem("projectList", projectList);
    return true;
  }
}

function getProjectsByUser(user) {
  return projectList.filter(
    (project) => project.linkedUserId === user.username
  );
  // If we used a Map we could do somethinglike projectList.get(user.username)
}

export function getProjectsByUserClone(user) {
  return structuredClone(
    projectList.filter((project) => project.linkedUserId === user.username)
  );
}

export function updateProject(updatedProject) {
  const currentProject = projectList.find(
    (project) => project.id === updatedProject.projectId
  );
  if (updatedProject.name) currentProject.name = updatedProject.name;
  setStoredItem("projectList", projectList);
}

export function deleteProjectByProjectId(projectId) {
  deleteTasksByProjectId(projectId);
  projectList.splice(
    projectList.findIndex((project) => project.id === projectId),
    1
  );
  setStoredItem("projectList", projectList);
}

export function deleteProjectsByUser(user) {
  const userProjects = getProjectsByUser(user);
  for (let i = 0; i < projectList.length; i++) {
    if (userProjects.includes(projectList[i])) {
      projectList.splice(i, 1);
      i--; // avoid missing the next element now moved back by one index value
    }
  }
  setStoredItem("projectList", projectList);
}
