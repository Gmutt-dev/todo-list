import { getStoredItem, setStoredItem } from "./storageController";
// Initialization:
const projectList = [];
projectList.push(...getStoredItem("projectList"));

// Factory function to create and return a new project object
export function createProject(linkedUser, name) {
    // Make unique id "default" for the default project
    const id = crypto.randomUUID();
    
    return {
        id,
        name,
        linkedUserId: linkedUser.username
    }
}

export function addProject(project) {
    projectList.push(project);
    setStoredItem("projectList", projectList);
}

function getProjectsByUser(user) {
    return projectList.filter(project => project.linkedUserId === user.username)
}

export function getProjectsByUserClone(user) {
    return structuredClone(projectList.filter(project => project.linkedUserId === user.username));
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