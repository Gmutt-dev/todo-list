// Factory function to create and return a new project object
export default function createProject(name, userName) {
    const id = crypto.randomUUID();
    
    return {
        id,
        name,
        linkedUser: userName,
    }
}