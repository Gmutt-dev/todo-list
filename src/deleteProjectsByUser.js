import { projectList } from "./lists";
import getProjectsByUser from "./getProjectsByUser";

export default function deleteProjectsByUser(user) {
    const userProjects = getProjectsByUser(user);
    for (let i = 0; i < projectList.length; i++) {
        if (userProjects.includes(projectList[i])) {
            projectList.splice(i, 1);
            i--; // avoid missing the next element now moved back by one index value
        }
    }
}