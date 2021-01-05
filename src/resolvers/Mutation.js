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

    updateUser(parent, args, {db}, info) {
        const {id,data} = args;
        const user = db.users.find(u => u.id === id)

        if (user) {
            if (typeof data.email === 'string') {
                if (db.users.some(u => u.email === data.email && u.id !== id)) {
                    throw new Error('Email is taken.');
                }
                user.email = data.email
            }

            if (typeof data.name === 'string') {
                user.name = data.name
            }

            if (typeof data.age !== 'undefined') {
                user.age = data.age
            }

            return user

        } else {
            throw new Error('User not found.');
        }
    },

    createPost(parent, args, {db, pubsub}, info) {
        if (db.users.some(u => u.id === args.data.author)) {
            const post = {
                id: uuidv4(),
                ...args.data
            }
            db.posts.push(post)

            if (args.data.published) {
                pubsub.publish('post', {
                    post: {
                        mutation: 'CREATED',
                        data: post
                    }
                })
            }

            return post;
        } else {
            throw new Error('User not found.');
        }
    },

    deletePost(parent, args, {db, pubsub}, info) {
        const index = db.posts.findIndex(p => p.id === args.id)
        if (index >= 0) {
            db.comments = db.comments.filter(c => c.post !== args.id)
            const [post] = db.posts.splice(index, 1);

            if (post.published) {
                pubsub.publish('post', {
                    post: {
                        mutation: 'DELETED',
                        data: post
                    }
                })
            }

            return post;
        } else {
            throw new Error('Post not found.');
        }
    },

    updatePost(parent, args, {db,pubsub}, info) {
         const {id,data} = args
         const post = db.posts.find(p => p.id === id)
         const originalPost = {...post};

         if(post) {
            if (typeof data.title === 'string') {
                post.title = data.title
            }

            if (typeof data.body === 'string') {
                post.body = data.body
            }

            if (typeof data.published === 'boolean') {
                post.published = data.published

                if(originalPost.published && !post.published) {
                    pubsub.publish('post', {
                        post: {
                            mutation: 'DELETED',
                            data: originalPost
                        }
                    })
                } else if (!originalPost.published && post.published) {
                    pubsub.publish('post', {
                        post: {
                            mutation: 'CREATED',
                            data: post
                        }
                    })
                } else if (post.published) {
                    pubsub.publish('post', {
                        post: {
                            mutation: 'UPDATED',
                            data: post
                        }
                    })
                }

            } else if (post.published) {
                pubsub.publish('post', {
                    post: {
                        mutation: 'UPDATED',
                        data: post
                    }
                })
            }
                
            
            return post

         }else{
            throw new Error('Post not found.');
         }
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