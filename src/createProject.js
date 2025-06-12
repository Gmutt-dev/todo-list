// Factory function to create and return a new project object
export default function createProject(linkedUser, name) {
    const id = crypto.randomUUID();
    
    return {
        id,
        name,
        linkedUserId: linkedUser.userName
    }
}