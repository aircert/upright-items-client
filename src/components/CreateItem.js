import React, { Component } from 'react'
import { FormGroup, Label, Input, Alert, Button } from 'reactstrap';
import { graphql } from 'react-apollo'
import CategoryList from './CategoryList'
import { ITEMS_QUERY } from './ItemList'
import gql from 'graphql-tag'
import to from 'await-to-js'

class CreateItem extends Component {
  state = {
    title: '',
    description: '',
    category_id: 1,
    error: ''
  }

  render() {
    return (
      <div>
        <h1>Create Item</h1>
        <hr/>
        {this.state.error &&
          <Alert color="danger">
            {this.state.error}
          </Alert>
        }
        <div className="flex flex-column mt3">
          <FormGroup>
            <Label>Title</Label>
            <Input
              value={this.state.title}
              onChange={e => this.setState({ title: e.target.value })}
              type="text"
              placeholder="The title for the item"
            />
          </FormGroup>
          <FormGroup>
            <Label>Description</Label>
            <Input
              className="mb2"
              value={this.state.description}
              onChange={e => this.setState({ description: e.target.value })}
              type="textarea"
              placeholder="A description for the item"
            />
          </FormGroup>
          <FormGroup>
            <Label>Category</Label>
            <Input 
              type="select" 
              name="select" 
              required="true"
              value={ parseInt(this.state.category_id, 10) }
              onChange={e => this.setState({ category_id: parseInt(e.target.value, 10) })}>
              <CategoryList />
            </Input>
          </FormGroup>
        </div>
        <Button onClick={() => this._createItem()}>Submit</Button>
      </div>
    )
  }

  _createItem = async () => {
    const { title, description, category_id } = this.state
    let err, result
    [err, result] = await to(this.props.postMutation({
      variables: {
        title,
        description,
        category_id
      },
      // data {createItem (This has to be name of mutation post)}
      update: (store, { data: { createItem } }) => {
        const data = store.readQuery({ query: ITEMS_QUERY })
        data.allItems.push(createItem)
        store.writeQuery({
          query: ITEMS_QUERY,
          data
        })
      }
    }).catch(e => {
      // GraphQL errors can be extracted here
      if (e.graphQLErrors) {
          // reduce to get message
         this.setState({error: e.graphQLErrors.map(e => e.message).join(',')})
      } else {
        this.props.history.push('/')
      }
    }))
    if(!err && result) {
      this.props.history.push('/')
    }
  }
}



// 1
const POST_MUTATION = gql`
  # 2
  mutation PostMutation($title: String!, $description: String!, $category_id: Int!) {
    createItem(title: $title, description: $description, category_id: $category_id) {
      id
      created_at
      updated_at
      title
      description
      category {
        name
        id
      }
    }
  }
`

// 3
export default graphql(POST_MUTATION, { name: 'postMutation' })(CreateItem)