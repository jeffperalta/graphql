import getUserId from '../utils/getUserId'

const User = {
    email: {
        fragment: 'fragment userId on User { id }',
        resolve(parent, args, { request }, info) {
            const userId = getUserId(request, false)

            if (userId && parent.id === userId) {
                return parent.email
            }else{
                return null
            }
        }
    },
    posts: {
        fragment: 'fragment userId on User { id }',
        resolve(parent, args, { prisma }, info) {
            return prisma.query.posts({
                where: {
                    published: true,
                    author: {
                        id: parent.id
                    }
                }
            })
        }
    }

    // comments(parent, args, {db}, info) {
    //     return db.comments.filter(c => c.author === parent.id);
    // }
}

export { User as default }