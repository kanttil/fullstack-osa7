import React from 'react'
import BlogList from './components/BlogList'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import UserList from './components/UserList'
import User from './components/User'
import blogService from './services/blogs'
import userService from './services/users'
import loginService from './services/login'

import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { Container, Button, Menu } from 'semantic-ui-react'

const Notification = ({ message, color }) => {
    if (message === null) {
        return null
    }

    const notificationStyle = {
        color,
        border: 'solid',
        borderWidth: 2,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10
    }

    return (
        <div style={notificationStyle}>
            {message}
        </div>
    )
}

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            blogs: [],
            users: [],
            notification: null,
            notificationColor: null,
            user: null
        }
    }

    componentDidMount() {
        blogService.getAll().then(blogs =>
            this.setState({ blogs })
        )
        userService.getAll().then(users =>
            this.setState({ users })
        )
        const loggedUserJSON = window.localStorage.getItem('loggedUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            blogService.setToken(user.token)
            this.setState({ user })
        }
    }

    login = async (username, password) => {
        try {
            const user = await loginService.login({
                username,
                password
            })

            window.localStorage.setItem('loggedUser', JSON.stringify(user))
            blogService.setToken(user.token)
            this.setState({
                user,
                notification: `${user.name} logged in`,
                notificationColor: 'green'
            })
            setTimeout(() => {
                this.setState({ notification: null })
            }, 3000)
        } catch (exception) {
            this.setState({
                notification: 'wrong username or password',
                notificationColor: 'red'
            })
            setTimeout(() => {
                this.setState({ notification: null })
            }, 3000)
        }
    }

    logout = (event) => {
        event.preventDefault()

        window.localStorage.clear()
        blogService.setToken(null)
        this.setState({
            user: null,
            notification: 'logged out',
            notificationColor: 'green'
        })
        setTimeout(() => {
            this.setState({ notification: null })
        }, 3000)
    }

    addBlog = async (blogObject) => {
        this.blogForm.toggleVisibility()

        const newBlog = await blogService.create(blogObject)
        const blogs = await blogService.getAll()
        const users = await userService.getAll()
        this.setState({
            blogs,
            users,
            notification: `a new blog '${newBlog.title}' by ${newBlog.author} added`,
            notificationColor: 'green'
        })
        setTimeout(() => {
            this.setState({ notification: null })
        }, 3000)
    }

    updateBlog = async (id, blogObject) => {
        await blogService.update(id, blogObject)
        const blogs = await blogService.getAll()

        this.setState({ blogs })
    }

    removeBlog = async (id) => {
        await blogService.remove(id)
        this.setState({ blogs: this.state.blogs.filter(blog => blog._id !== id) })
    }

    addComment = async (blog, commentObject) => {
        const newComment = await blogService.createComment(blog._id, commentObject)
        const blogs = await blogService.getAll()
        this.setState({
            blogs,
            notification: `comment '${newComment.content}' added to blog '${blog.title}'`,
            notificationColor: 'green'
        })
        setTimeout(() => {
            this.setState({ notification: null })
        }, 3000)
    }

    render() {
        const blogById = (id) => this.state.blogs.find(blog => blog._id === id)
        const userById = (id) => this.state.users.find(user => user._id === id)

        const titleStyle = {
            color: 'cornFlowerBlue'
        }

        if (this.state.user === null) {
            return (
                <Container>
                    <Notification
                        message={this.state.notification}
                        color={this.state.notificationColor} />
                    <LoginForm login={this.login} />
                </Container>
            )
        }

        return (
            <Container>
                <Router>
                    <div>
                        <Notification
                            message={this.state.notification}
                            color={this.state.notificationColor} />
                        <h1 style={titleStyle}>blog app</h1>
                        <Menu>
                            <Menu.Item link>
                                <Link to="/">blogs</Link>
                            </Menu.Item>
                            <Menu.Item link>
                                <Link to="/users">users</Link>
                            </Menu.Item>
                            <Menu.Item>
                                {this.state.user.name} logged in &nbsp;
                                <Button onClick={this.logout}>logout</Button>
                            </Menu.Item>
                        </Menu>
                        <Togglable buttonLabel="create new blog" ref={component => this.blogForm = component}>
                            <BlogForm addBlog={this.addBlog} />
                        </Togglable>
                        <Route exact path="/" render={() =>
                            <BlogList blogs={this.state.blogs} />} />
                        <Route exact path="/users" render={() =>
                            <UserList users={this.state.users} />} />
                        <Route exact path="/users/:id" render={({ match }) =>
                            <User user={userById(match.params.id)} />} />
                        <Route exact path="/blogs/:id" render={({ match }) =>
                            <Blog
                                blog={blogById(match.params.id)}
                                user={this.state.user}
                                updateBlog={this.updateBlog}
                                removeBlog={this.removeBlog}
                                addComment={this.addComment} />} />
                    </div>
                </Router>
            </Container>
        )
    }
}

export default App