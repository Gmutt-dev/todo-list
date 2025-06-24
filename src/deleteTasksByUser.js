import { taskList } from "./lists";
import { getTasksByUser } from "./getTasksByUser";

export default function deleteTasksByUser(user) {
    const userTasks = getTasksByUser(user);
    for (let i = 0; i < taskList.length; i++) {
        if (userTasks.includes(taskList[i])) {
            taskList.splice(i, 1);
            i--; // avoid missing the next element now moved back by one index value
        }
    }
}