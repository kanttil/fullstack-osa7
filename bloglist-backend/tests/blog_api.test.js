const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const { initialBlogs, blogsInDb, usersInDb } = require('./test_helper')

beforeAll(async () => {
    await Blog.remove({})
    const blogObjects = initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)

    await User.remove({})
    const user = { username: 'testUser', password: 'password' }
    await api
        .post('/api/users')
        .send(user)
})

describe('POST /api/login', () => {
    test('succeeds with a known user', async () => {
        const knownUser = {
            username: 'testUser',
            password: 'password'
        }

        const response = await api
            .post('/api/login')
            .send(knownUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body.username).toBe(knownUser.username)
    })

    test('fails with wrong password', async () => {
        const knownUser = {
            username: 'testUser',
            password: 'salainen'
        }

        const response = await api
            .post('/api/login')
            .send(knownUser)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        expect(response.body).toEqual({ error: 'invalid username or password' })
    })

    test('fails with unknown user', async () => {
        const newUser = {
            username: 'newUser',
            password: 'salainen'
        }

        const response = await api
            .post('/api/login')
            .send(newUser)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        expect(response.body).toEqual({ error: 'invalid username or password' })
    })
})

describe('GET /api/blogs', () => {
    test('all blogs are returned as json', async () => {
        const blogsInDatabase = await blogsInDb()

        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body.length).toBe(blogsInDatabase.length)

        const returnedTitles = response.body.map(r => r.title)
        blogsInDatabase.forEach(blog => {
            expect(returnedTitles).toContain(blog.title)
        })
    })
})

describe('POST /api/blogs', () => {
    test('fails with status code 401 if not logged in', async () => {
        const blogsBeforeOperation = await blogsInDb()

        const newBlog = {
            title: 'First class tests',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
            likes: 10
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)

        const blogsAfterOperation = await blogsInDb()
        expect(blogsAfterOperation.length).toBe(blogsBeforeOperation.length)
    })

    describe('when user is logged in', () => {
        let token = null

        beforeAll(async () => {
            const user = { username: 'testUser', password: 'password' }
            const response = await api
                .post('/api/login')
                .send(user)
                .expect(200)
            
            token = response.body.token
        })

        test('succeeds with valid data', async () => {
            const blogsBeforeOperation = await blogsInDb()

            const newBlog = {
                title: 'First class tests',
                author: 'Robert C. Martin',
                url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
                likes: 10
            }

            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            const blogsAfterOperation = await blogsInDb()
            expect(blogsAfterOperation.length).toBe(blogsBeforeOperation.length + 1)

            const titles = blogsAfterOperation.map(blog => blog.title)
            expect(titles).toContain('First class tests')
        })

        test('succeeds if likes is missing, likes gets value 0', async () => {
            const blogsBeforeOperation = await blogsInDb()

            const newBlog = {
                title: 'TDD harms architecture',
                author: 'Robert C. Martin',
                url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html'
            }

            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)

            const blogsAfterOperation = await blogsInDb()
            expect(blogsAfterOperation.length).toBe(blogsBeforeOperation.length + 1)

            const addedBlog = blogsAfterOperation[blogsAfterOperation.length - 1]
            expect(addedBlog.likes).toBe(0)
        })

        test('fails with proper status code if title is missing', async () => {
            const blogsBeforeOperation = await blogsInDb()

            const newBlog = {
                author: 'Robert C. Martin',
                url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
                likes: 2
            }

            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(400)

            const blogsAfterOperation = await blogsInDb()
            expect(blogsAfterOperation.length).toBe(blogsBeforeOperation.length)
        })

        test('fails with proper status code if url is missing', async () => {
            const blogsBeforeOperation = await blogsInDb()

            const newBlog = {
                title: 'Type wars',
                author: 'Robert C. Martin',
                likes: 2
            }

            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(400)

            const blogsAfterOperation = await blogsInDb()
            expect(blogsAfterOperation.length).toBe(blogsBeforeOperation.length)
        })
    })
})

describe('POST /api/users', () => {
    test('succeeds with a fresh username', async () => {
        const usersBeforeOperation = await usersInDb()

        const newUser = {
            username: 'new',
            name: 'Newuser',
            password: 'salainen'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAfterOperation = await usersInDb()
        expect(usersAfterOperation.length).toBe(usersBeforeOperation.length + 1)
        const usernames = usersAfterOperation.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('fails with proper status code and message if username already taken', async () => {
        const usersBeforeOperation = await usersInDb()

        const newUser = {
            username: 'testUser',
            name: 'Superuser',
            password: 'salainen'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body).toEqual({ error: 'username must be unique' })

        const usersAfterOperation = await usersInDb()
        expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
    })

    test('fails with proper status code and message if password is too short', async () => {
        const usersBeforeOperation = await usersInDb()

        const newUser = {
            username: 'user',
            name: 'Superuser',
            password: 'sa'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body).toEqual({ error: 'password must be at least 3 characters' })

        const usersAfterOperation = await usersInDb()
        expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
    })
})

afterAll(() => {
    server.close()
})