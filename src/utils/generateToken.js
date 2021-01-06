import jwt from 'jsonwebtoken'

const generateToken = (userId) => jwt.sign({
    userId
}, 'Ms5X9UvRPtE21TaXbffs', {
    expiresIn: '7 days'
})

export { generateToken  as default}