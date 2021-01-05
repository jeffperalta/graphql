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
    user(parent, args, {db}, info) {
        return {
            id: '123123',
            name: 'Romina',
            email: 'romina@gg.com'
        }
    },
    post(parent, args, {db}, info) {
        return {
            id: '123123-A',
            title: 'Title of the post',
            body: 'Body of the post',
            published: true
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
    posts(parent, args, { prisma }, info) {
        const opArgs = {}
        
        if (args.query) {
            opArgs.where = {
                OR: [{
                    title_contains: args.query
                }, {
                    body_contains: args.query
                }]
            }
        }

        return prisma.query.posts(opArgs, info)

    },
    users(parent, args, { prisma }, info) {
        const opArgs = {}

        if (args.query) {
            opArgs.where = {
                OR: [{
                    name_contains: args.query
                }, {
                    email_contains: args.query
                }]
            }
        }

        return prisma.query.users(opArgs, info)
    },
    comments(parent, args, { prisma }, info) {
        const opArgs = {}

        if (args.query) {
            opArgs.where = {
                text_contains: args.query
            }
        }

        return prisma.query.comments(opArgs, info)
    }
}

export {Query as default};