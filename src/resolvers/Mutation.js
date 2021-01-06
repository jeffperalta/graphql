import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const Mutation = {
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
            token: jwt.sign({
                userId: user.id
            }, 'Ms5X9UvRPtE21TaXbffs')
        }
    },

    async deleteUser(parent, args, { prisma }, info) {
        const userExist = await prisma.exists.User({ id: args.id })

        if(!userExist) {
            throw new Error('User not found.');
        }

        return prisma.mutation.deleteUser({
            where: {
                id: args.id
            }
        }, info)
    },

    async updateUser(parent, args, { prisma }, info) {
        const { id, data } = args

        return prisma.mutation.updateUser({
            where: { id },
            data
        }, info)

    },

    async createPost(parent, args, { prisma }, info) {
        const data = { ... args.data }

        data.author = {
            connect: {
                id: data.author
            }
        }

        return prisma.mutation.createPost({ data }, info)
    },

    async deletePost(parent, args, { prisma }, info) {        
        return prisma.mutation.deletePost({
            where: {
                id: args.id
            }
        }, info)
    },

    async updatePost(parent, args, { prisma }, info) {
        const { id, data } = args

        return prisma.mutation.updatePost({
            where: { id },
            data
        }, info)

    },

    createComment(parent, args, { prisma }, info) {
        const data = { ... args.data }
        
        data.author = {
            connect: {
                id: data.author
            }
        }

        data.post = {
            connect: {
                id: data.post
            }
        }

        return prisma.mutation.createComment({ data }, info)

    },


    deleteComment(parent, args, { prisma }, info) {
        return prisma.mutation.deleteComment({
            where: {
                id: args.id
            }
        }, info)

    },

    updateComment(parent, args, { prisma }, info) {
        const {id, data} = args

        return prisma.mutation.updateComment({
            where: { id },
            data
        }, info)

    }
}

export { Mutation as default }