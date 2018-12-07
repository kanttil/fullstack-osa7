import React from 'react'
import { Table } from 'semantic-ui-react'

const User = ({ user }) => {
    if (user === undefined) return null

    const titleStyle = {
        color: 'dimGray'
    }

    return (
        <div>
            <h2 style={titleStyle}>{user.name}</h2>
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>
                            <h3>Added blogs</h3>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {user.blogs.map(blog =>
                        <Table.Row key={blog._id}>
                            <Table.Cell>
                                {blog.title} by {blog.author}
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        </div>
    )
}

export default User