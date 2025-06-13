import getProjectsByUser from "./getProjectsByUser";
import { taskList } from "./lists";

export function getTasksByUser(user) {
    const userProjects = getProjectsByUser(user);
    const userProjectsIds = userProjects.map( project => project.id);
    return taskList.filter(task => userProjectsIds.includes(task.linkedProjectId));
}