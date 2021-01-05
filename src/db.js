const users = [{
    id: '1',
    name: 'Teddy',
    email: 'teddy@gg.com',
    age: 4
}, {
    id: '123773',
    name: 'Romina',
    email: 'romina@gg.com',
    age: 34
}, {
    id: '123774',
    name: 'Fanny',
    email: 'fanny@gg.com',
    age: 33
}];

const posts = [{
    id: '123123-A',
    title: 'Photograpy',
    body: 'A course for taking stunning and beautiful photos',
    published: true,
    author: '123773'
}, {
    id: '123123-B',
    title: 'Programming with NodeJs',
    body: 'Learn how to code using your favourite programming language',
    published: false,
    author: '123773'
}, {
    id: '123123-C',
    title: 'GraphQL 101',
    body: 'Explore the world of GraphQL',
    published: true,
    author: '123774'
}];


const comments = [{
    id: '110',
    text: 'Excellent class to learn this topic!',
    author: '123777',
    post: '123123-A'
}, {
    id: '111',
    text: 'I have learned a lot during this course. Thanks',
    author: '123773',
    post: '123123-C'
}, {
    id: '112',
    text: 'The content is sufficient enough to keep me interested.',
    author: '123774',
    post: '123123-B'
}, {
    id: '113',
    text: 'I will give it a two thumbs up!',
    author: '123777',
    post: '123123-C'
}];

const db = {
    users,
    posts,
    comments
}

export {db as default}