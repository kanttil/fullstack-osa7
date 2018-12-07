import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button } from 'semantic-ui-react'

class LoginForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: ''
        }
    }

    handleLoginFieldChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    onSubmit = (event) => {
        event.preventDefault()
        this.props.login(this.state.username, this.state.password)
        this.setState({
            username: '',
            password: ''
        })
    }

    render() {
        const titleStyle = {
            color: 'dimGray'
        }

        return (
            <div>
                <h2 style={titleStyle}>Log in to application</h2>

                <Form onSubmit={this.onSubmit}>
                    <Form.Field>
                        <label>username:</label>
                        <input
                            type="text"
                            name="username"
                            value={this.state.username}
                            onChange={this.handleLoginFieldChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>password:</label>
                        <input
                            type="password"
                            name="password"
                            value={this.state.password}
                            onChange={this.handleLoginFieldChange}
                        />
                    </Form.Field>
                    <Button type="submit">login</Button>
                </Form>
            </div>
        )
    }
}

LoginForm.propTypes = {
    login: PropTypes.func.isRequired
}

export default LoginForm