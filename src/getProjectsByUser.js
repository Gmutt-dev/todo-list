import { projectList } from "./lists";

export default function getProjectsByUser(user) {
    return projectList.filter(project => project.linkedUserId === user.username)
}