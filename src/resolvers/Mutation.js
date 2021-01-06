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

    createComment(parent, args, {db, pubsub}, info) {
        if (db.users.some(u => u.id === args.data.author)) {
            if (db.posts.some(p => p.id === args.data.post && p.published)) {
                const comment = {
                    id: uuidv4(),
                    ...args.data
                }

                db.comments.push(comment);
                pubsub.publish(`comment_${args.data.post}`, { 
                    comment: {
                        mutation: 'CREATED',
                        data: comment
                    } 
                })

                return comment;
            } else {
                throw new Error('Post must exist and must be published.');
            }
        } else {
            throw new Error('User not found.');
        }
    },


    deleteComment(parent, args, {db, pubsub}, info) {
        const index = db.comments.findIndex(c => c.id === args.id)
        if (index >= 0) {
            const [comment] = db.comments.splice(index, 1);

            pubsub.publish(`comment_${comment.post}`, {
                comment: {
                    mutation: 'DELETED',
                    data: comment
                }
            })

            return comment;
        } else {
            throw new Error('Comment not found.');
        }
    },

    updateComment(parent, args, {db, pubsub}, info) {
        const {id,data} = args
        const comment = db.comments.find(c => c.id === id)
        if(comment) {
            if (typeof data.text === 'string') {
                comment.text = data.text
            }

            pubsub.publish(`comment_${comment.post}`, {
                comment: {
                    mutation: 'UPDATED',
                    data: comment
                }
            })

            return comment;
        }else{
            throw new Error('Comment not found.');
        }
    }
}

export { Mutation as default }