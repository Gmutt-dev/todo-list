import { getProjectsByUserClone } from "./projectsManager";
import { taskList } from "./lists";

export function getTasksByUser(user) {
    const userProjects = getProjectsByUserClone(user);
    const userProjectsIds = userProjects.map( project => project.id);
    return taskList.filter(task => userProjectsIds.includes(task.linkedProjectId));
}