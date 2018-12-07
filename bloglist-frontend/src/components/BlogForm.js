import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button } from 'semantic-ui-react'

class BlogForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '',
            author: '',
            url: ''
        }
    }

    submitBlog = (event) => {
        event.preventDefault()

        const blogObject = {
            title: this.state.title,
            author: this.state.author,
            url: this.state.url
        }
        this.props.addBlog(blogObject)

        this.setState({
            title: '',
            author: '',
            url: ''
        })
    }

    handleBlogFieldChange = (event) => {
        event.preventDefault()
        this.setState({ [event.target.name]: event.target.value })
    }

    render() {
        const titleStyle = {
            color: 'dimGray'
        }

        return (
            <div>
                <h2 style={titleStyle}>create new blog</h2>
                <Form onSubmit={this.submitBlog}>
                    <Form.Field>
                        <label>title</label>
                        <input
                            type="text"
                            name="title"
                            value={this.state.title}
                            onChange={this.handleBlogFieldChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>author</label>
                        <input
                            type="text"
                            name="author"
                            value={this.state.author}
                            onChange={this.handleBlogFieldChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>url</label>
                        <input
                            type="text"
                            name="url"
                            value={this.state.url}
                            onChange={this.handleBlogFieldChange}
                        />
                    </Form.Field>
                    <Button type="submit">create</Button>
                </Form>
            </div>
        )
    }
}

BlogForm.propTypes = {
    addBlog: PropTypes.func.isRequired
}

export default BlogForm