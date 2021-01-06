import jwt from 'jsonwebtoken'

const getUserId = (request, requireAuth = true) => {
    const header = request.request.headers.authorization
    
    if(header) {
        const token = header.replace('Bearer ', '')
        const decoded = jwt.verify(token, 'Ms5X9UvRPtE21TaXbffs')
        return decoded.userId
    }

    if(requireAuth) {
        throw new Error('Authentication required')
    }

    return null
}

export { getUserId as default }