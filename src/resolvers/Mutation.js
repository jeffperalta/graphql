import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import getUserId from '../utils/getUserId'

const Mutation = {
    async login(parent, { data }, { prisma }, info) {
        const user = await prisma.query.user({
            where: {
                username: data.username
            }
        })

        if(!user) {
            throw new Error('Unable to login.')
        } 

        if(!(await bcrypt.compare(data.password, user.password))) {
            throw new Error('Unable to login.')
        }

        return {
            user,
            token: jwt.sign({ userId: user.id }, 'Ms5X9UvRPtE21TaXbffs')
        }
    },

    async createUser(parent, args, { prisma }, info) {
        const { data } = args

        if(data.password.length < 8) {
            throw new Error('Password must be 8 character or longer.');
        }

        const emailTaken = await prisma.exists.User({
            email: data.email
        })

        if(emailTaken) {
            throw new Error('Email is taken.');
        }

        data.password = await bcrypt.hash(data.password, 10)

        const user = await prisma.mutation.createUser({ data })

        return {
            user,
            token: jwt.sign({ userId: user.id }, 'Ms5X9UvRPtE21TaXbffs')
        }
    },

    async deleteUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        const userExist = await prisma.exists.User({ id: args.id })

        if(!userExist) {
            throw new Error('User not found.');
        }

        return prisma.mutation.deleteUser({
            where: {
                id: userId
            }
        }, info)
    },

    async updateUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        
        const { data } = args

        return prisma.mutation.updateUser({
            where: { 
                id: userId 
            },
            data
        }, info)

    },

    async createPost(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        const data = { ... args.data }

        data.author = {
            connect: {
                id: userId
            }
        }

        return prisma.mutation.createPost({ data }, info)
    },

    async deletePost(parent, args, { prisma, request }, info) {      
        
        const userId = getUserId(request)

        const postExist = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        })

        if(!postExist) {
            throw new Error('Unable to delete post')
        }

        return prisma.mutation.deletePost({
            where: {
                id: args.id
            }
        }, info)
    },

    async updatePost(parent, args, { prisma, request }, info) {

        const { id, data } = args

        const userId = getUserId(request)

        const postExist = await prisma.exists.Post({
            id,
            author: {
                id: userId
            }
        })

        if (!postExist) {
            throw new Error('Unable to update post')
        }

        const isPublished = await prisma.exists.Post({ id, published: true })

        if (isPublished && args.data.published === false) {
            await prisma.mutation.deleteManyComments({
                where: {
                    post: {
                        id
                    }
                }
            })
        }

        

        return prisma.mutation.updatePost({
            where: { id },
            data
        }, info)

    },

    async createComment(parent, args, { prisma, request }, info) {

        const userId = getUserId(request)

        const post = await prisma.exists.Post({
            id: args.data.post,
            published: true
        })

        if(!post) {
            throw new Error('Unable to find post')
        }

        const data = { ... args.data }
        
        data.author = {
            connect: {
                id: userId
            }
        }

        data.post = {
            connect: {
                id: data.post
            }
        }

        return prisma.mutation.createComment({ data }, info)

    },


    async deleteComment(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        const commentExist = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        })

        if (!commentExist) {
            throw new Error('Unable to delete comment')
        }

        return prisma.mutation.deleteComment({
            where: {
                id: args.id
            }
        }, info)

    },

    async updateComment(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        const commentExist = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        })

        if (!commentExist) {
            throw new Error('Unable to update comment')
        }

        const {id, data} = args

        return prisma.mutation.updateComment({
            where: { id },
            data
        }, info)

    }
}

export { Mutation as default }