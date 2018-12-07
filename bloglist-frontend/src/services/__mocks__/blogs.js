let token = null

const setToken = () => {
    return
}

const blogs = [
    {
        _id: "5b87cfafdd1d931a468bd053",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 1,
        user: {
            _id: "5b87cf4cdd1d931a468bd052",
            username: "user1",
            name: "User1"
        },
        comments: []
    },
    {
        _id: "5b87db1d99d0dc2cc0f48f9e",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html",
        likes: 0,
        user: {
            _id: "5b87da79aaceed2bbdc97d94",
            username: "user2",
            name: "User2"
        },
        comments: []
    },
    {
        _id: "5b88f8788a227b0a1ddb105b",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 1,
        user: {
            _id: "5b87da79aaceed2bbdc97d94",
            username: "user2",
            name: "User2"
        },
        comments: []
    }
]

const getAll = () => {
    return Promise.resolve(blogs)
}

export default { getAll, blogs, setToken }