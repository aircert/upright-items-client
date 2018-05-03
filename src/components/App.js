import React, { Component } from 'react'
import ItemList from './ItemList'
import Header from './Header'
import Login from './Login'
import { Switch, Route } from 'react-router-dom'
import CreateItem from './CreateItem'
import { Container, Row, Col} from 'reactstrap';
import '../styles/App.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Container className="main-container">
          <Row>
            <Col md="12">
              <Switch>
                <Route exact path="/login" component={Login} />
                <Route exact path="/" component={ItemList} />
                <Route exact path="/create" component={CreateItem} />
              </Switch>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default App