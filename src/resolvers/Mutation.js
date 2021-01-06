import {v4 as uuidv4} from 'uuid';

const Mutation = {
    async createUser(parent, args, { prisma }, info) {
        const { data } = args

        const emailTaken = await prisma.exists.User({ email:  data.email })

        if(emailTaken) {
            throw new Error('Email is taken.');
        }
        
        return prisma.mutation.createUser({ data }, info)
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