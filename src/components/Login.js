import React, { Component } from 'react'
import { AUTH_TOKEN } from '../constants'
import { FormGroup, Input, Button, Col, Alert } from 'reactstrap';
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import to from 'await-to-js'

class Login extends Component {
  state = {
    login: true, // switch between Login and SignUp
    email: '',
    password: '',
    name: '',
  }

  render() {
    return (
      <Col md={{size: "4", offset: "4"}}>
        <h4>{this.state.login ? 'Login' : 'Sign Up'}</h4>
        {this.state.error &&
          <Alert color="danger">
            {this.state.error}
          </Alert>
        }
        <FormGroup>
          {!this.state.login && (
            <Input
              value={this.state.name}
              onChange={e => this.setState({ name: e.target.value })}
              type="text"
              placeholder="Your name"
            />
          )}
          <Input
            value={this.state.email}
            onChange={e => this.setState({ email: e.target.value })}
            type="text"
            placeholder="Your email address"
          />
          <Input
            value={this.state.password}
            onChange={e => this.setState({ password: e.target.value })}
            type="password"
            placeholder="Choose a safe password"
          />
        </FormGroup>
        <div className="text-center">
          <Button onClick={() => this._confirm()}>
            {this.state.login ? 'Login' : 'Create account'}
          </Button>
          <Button color="link" block={true}
            onClick={() => this.setState({ login: !this.state.login })}
          >
            {this.state.login
              ? 'Need to create an account?'
              : 'Already have an account?'}
          </Button>
        </div>
      </Col>
    )
  }

  _confirm = async () => {
    const { name, email, password } = this.state
    let err, result;
    if (this.state.login) {
      [err, result] = await to(this.props.loginMutation({
        variables: {
          email,
          password,
        },
      })).catch(e => {
        // GraphQL errors can be extracted here
        if (e.graphQLErrors) {
           this.setState({error: e.graphQLErrors.map(e => e.message).join(',')})
        } else {
          this.props.history.push('/')
        }
      })
      if(err) {
        console.log('Problems logging in')
      } else {
        if(result.data.signinUser) {
          const { token } = result.data.signinUser.token
          this._saveUserData(token)
        } else {
          this.setState({error: "Account does not exist."})
        }
      }
    } else {
      [err, result] = await to(this.props.signupMutation({
        variables: {
          name,
          email,
          password,
        },
      }))
      if(err) {  
        this.setState({error: "Email already in use."})
      } else {
        const { token } = result.data.createUser.token
        this._saveUserData(token)
      }
    }
  }
    _saveUserData = token => {
      localStorage.setItem(AUTH_TOKEN, token)
      this.props.history.push(`/`)
    }
  }

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    createUser(name: $name, authProvider: {
      email: {
        email: $email, 
        password: $password
      }
    }
    ){
      token
      user {
        id
        name
        email
      }
    }
  }
`

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    signinUser(email: {
      email: $email, 
      password: $password
    }
    ){
      token
      user {
        id
      }
    }
  }
`

export default compose(
  graphql(SIGNUP_MUTATION, { name: 'signupMutation' }),
  graphql(LOGIN_MUTATION, { name: 'loginMutation' }),
)(Login)