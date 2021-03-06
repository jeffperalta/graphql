import getUserId from '../utils/getUserId'

const Subscription = {
    count: {
        subscribe(parent, args, { pubsub }, info) {
            let count = 0
            
            setInterval(() => {
                count++
                pubsub.publish('count', {
                    count
                })
            }, 1000)

            return pubsub.asyncIterator('count')
        }
    },

    comment: {
        subscribe(parent, args, { prisma }, info) {
             const opArgs = {}

             if(args.postId) {
                 opArgs.where = { 
                     node: {
                         post: {
                            id: args.postId
                         }
                     }
                 }
             }

            return prisma.subscription.comment(opArgs, info)
        }
    },

    post: {
        subscribe(parent, args, { prisma }, info) {
            const opArgs = {}

            if (args.postId) {
                opArgs.where = {
                    node: {
                        AND: [{
                            id: args.postId,
                        },{
                            published: true
                        }]
                    }
                }
            }else{
                opArgs.where = {
                    node: {
                        published: true
                    }
                }
            }

            return prisma.subscription.post(opArgs, info)

        }
    },

    myPost: {
        subscribe(parent, args, { prisma, request }, info) {
            const userId = getUserId(request)

            return prisma.subscription.post({
                where: {
                    node: {
                        author: {
                            id: userId
                        }
                    }

                }
            }, info)
        }
    }
}

export {Subscription as default}