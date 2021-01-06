import getUserId from '../utils/getUserId'

const User = {
    email(parent, args, { request }, info) {
        const userId = getUserId(request, false)

        if (userId && parent.id === userId) {
            return parent.email
        }else{
            return null
        }

    }
    // posts(parent, args, {db}, info) {
    //     return db.posts.filter(p => p.author === parent.id);
    // },
    // comments(parent, args, {db}, info) {
    //     return db.comments.filter(c => c.author === parent.id);
    // }
}

export { User as default }