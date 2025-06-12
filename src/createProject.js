// Factory function to create and return a new project object
export default function createProject(linkedUser, name) {
    // Make unique id "default" for the default project
    const id = (name !== "default") ? crypto.randomUUID() : "default";
    
    return {
        id,
        name,
        linkedUserId: linkedUser.userName
    }
}