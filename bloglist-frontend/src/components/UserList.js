import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Table } from 'semantic-ui-react'

const UserList = ({ users }) => {
    const titleStyle = {
        color: 'dimGray'
    }
    const labelStyle = {
        fontWeight: 'bold'
    }

    return (
        <div>
            <h2 style={titleStyle}>users</h2>
            <Table striped celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell></Table.HeaderCell>
                        <Table.HeaderCell style={labelStyle}>blogs added</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {users.map(user =>
                        <Table.Row key={user._id}>
                            <Table.Cell><Link to={`/users/${user._id}`}>{user.name}</Link></Table.Cell>
                            <Table.Cell>{user.blogs.length}</Table.Cell>
                        </Table.Row>)}
                </Table.Body>
            </Table>
        </div>
    )
}

UserList.propTypes = {
    users: PropTypes.array.isRequired
}

export default UserList