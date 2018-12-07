import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Table } from 'semantic-ui-react'

const BlogList = ({ blogs }) => {
    const blogsSortedByLikes = blogs.sort((a, b) => b.likes - a.likes)

    const titleStyle = {
        color: 'dimGray'
    }

    return (
        <div>
            <h2 style={titleStyle}>blogs</h2>
            <Table striped>
                <Table.Body>
                    {blogsSortedByLikes.map(blog =>
                        <Table.Row key={blog._id}>
                            <Table.Cell>
                                <Link to={`/blogs/${blog._id}`}>
                                    <div className="blogLink">{blog.title} {blog.author}</div>
                                </Link>
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        </div>
    )
}

BlogList.propTypes = {
    blogs: PropTypes.array.isRequired
}

export default BlogList