// Factory function to create and return a new project object
export default function createProject(user, name) {
    const id = crypto.randomUUID();
    
    return {
        id,
        name,
        linkedUser: user.userName
    }
}