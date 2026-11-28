export function isAllocatedSession(session) {
    return typeof session?.title === 'string' && session.title.startsWith('ALLOCATED');
}
