import React from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Table } from 'semantic-ui-react'

const DeleteButton = ({ blog, user, deleteBlog }) => {
    if (blog.user === undefined || blog.user.username === user.username) {
        return (
            <Button onClick={deleteBlog(blog)}>delete</Button>
        )
    }

    return null
}

class Blog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            comment: ''
        }
    }

    deleteBlog = (blog) => () => {
        if (window.confirm(`delete '${blog.title}' by ${blog.author}?`)) {
            this.props.removeBlog(blog._id)
        }
    }

    likeBlog = (blog) => () => {
        const blogObject = {
            title: blog.title,
            author: blog.author,
            url: blog.url,
            likes: blog.likes + 1,
            user: blog.user._id
        }

        this.props.updateBlog(blog._id, blogObject)
    }

    handleCommentFieldChange = (event) => {
        event.preventDefault()
        this.setState({ comment: event.target.value })
    }

    submitComment = (event) => {
        event.preventDefault()

        const commentObject = {
            content: this.state.comment,
            blog: this.props.blog._id
        }
        this.props.addComment(this.props.blog, commentObject)

        this.setState({ comment: '' })
    }

    render() {
        const blog = this.props.blog
        if (blog === undefined) return null

        let anonymous = null
        if (blog.user === undefined) {
            anonymous = 'anonymous'
        }

        const titleStyle = {
            color: 'dimGray'
        }

        return (
            <div>
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>
                                <h2 style={titleStyle}>{blog.title} {blog.author}</h2>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>
                                <a href={blog.url}>{blog.url}</a>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>
                                {blog.likes} likes &nbsp;
                                <Button onClick={this.likeBlog(blog)}>like</Button>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>
                                <div>added by {anonymous || blog.user.name}</div>
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
                <DeleteButton blog={blog} user={this.props.user} deleteBlog={this.deleteBlog} />

                <h3>comments</h3>
                <Form onSubmit={this.submitComment}>
                    <Form.Field inline>
                        <input
                            type="text"
                            name="comment"
                            value={this.state.comment}
                            onChange={this.handleCommentFieldChange} />
                        <Button type="submit">add comment</Button>
                    </Form.Field>
                </Form>
                <ul>
                    {blog.comments.map(comment =>
                        <li key={comment._id}>{comment.content}</li>)}
                </ul>
            </div>
        )
    }
}

Blog.propTypes = {
    removeBlog: PropTypes.func.isRequired,
    updateBlog: PropTypes.func.isRequired,
    addComment: PropTypes.func.isRequired
}

export default Blog