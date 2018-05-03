import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import { AUTH_TOKEN } from '../constants'
import '../styles/Header.css'

class Header extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)
    return (
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">Upright Labs GraphQL</NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <Link to="/" className="nav-link">View Items</Link>
            </NavItem>
            {authToken && (
              <NavItem>
                <Link to="/create" className="nav-link">
                  Create Item
                </Link>
              </NavItem>
            )}
            {authToken ? (
              <NavItem>
                <NavLink href="#"
                  onClick={() => {
                    localStorage.removeItem(AUTH_TOKEN)
                    this.props.history.push(`/`)
                  }}
                >
                  Logout
                </NavLink>
              </NavItem>
            ) : (
              <NavItem>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </NavItem>
            )}
            
          </Nav>
        </Collapse>
      </Navbar>
    )
  }
}

export default withRouter(Header)