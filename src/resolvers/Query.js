import getUserId from '../utils/getUserId'

const Query = {
    id() {
        return 'abc123'
    },
    name() {
        return 'Jeff'
    },
    age() {
        return 35
    },
    employed() {
        return true
    },
    gpa() {
        return null
    },
    book() {
        return {
            title: 'Title of the book',
            price: 12.50,
            releaseYear: 2008,
            rating: 4.5,
            inStock: true
        }
    },
    greeting(parent, args, {db}, info) {
        if (args['name']) {
            return "Hello, " + args['name'] + "!"
        } else {
            return "Hello!"
        }
    },
    add(parent, args, {db}, info) {
        return args.a + args.b;
    },
    addition(parent, args, {db}, info) {
        if (args.nums.length === 0) return 0;
        return args.nums.reduce((a, b) => a + b, 0);
    },
    grades(parent, args, {db}, info) {
        return [1, 2, 3, 4, 5]
    },

    me(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        return prisma.query.user({
            where: {
                id: userId
            }
        })
    },
    async post(parent, args, { prisma, request }, info) {
        const userId = getUserId(request, false)

        const opArgs = {
            where: {
                id: args.id,
                OR: [{
                    published: true
                },{
                    author: {
                        id: userId
                    }
                }]
            }
        }

        const posts = await prisma.query.posts(opArgs, info)

        if(posts.length === 0 ) {
            throw new Error('Post not found.')
        }

        return posts[0]
    },
    posts(parent, args, { prisma }, info) {
        const opArgs = args.pagination ? {... args.pagination} : {}

        opArgs.where = {
            published: true
        }
        
        if (args.query) {
            opArgs.where.OR = [{
                title_contains: args.query
            }, {
                body_contains: args.query
            }]
        }

        return prisma.query.posts(opArgs, info)

    },
    myPosts(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        
        const opArgs = args.pagination ? {... args.pagination} : {}

        opArgs.where = {
            author: {
                id: userId
            }
        }
        
        if (args.query) {
            opArgs.where.OR = [{
                title_contains: args.query
            }, {
                body_contains: args.query
            }]
        }

        return prisma.query.posts(opArgs, info)

    },
    users(parent, args, { prisma }, info) {
        const opArgs = args.pagination ? {... args.pagination} : {}

        if (args.query) {
            opArgs.where = {
                OR: [{
                    name_contains: args.query
                }]
            }
        }

        return prisma.query.users(opArgs, info)
    },
    comments(parent, args, { prisma }, info) {
        const opArgs = args.pagination ? {... args.pagination} : {}

        if (args.query) {
            opArgs.where = {
                text_contains: args.query
            }
        }

        return prisma.query.comments(opArgs, info)
    }
}

export {Query as default};