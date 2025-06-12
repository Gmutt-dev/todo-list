import { userList } from "./lists";

export default function checkUsernameExists(username) {
    // If username is in userList obj return true, else return false
    if (userList.find(user => user.username === username)) return true; else return false;
}