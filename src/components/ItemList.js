import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import Item from './Item'
import to from 'await-to-js'
import {
  Button, Input, FormGroup, Table, InputGroup, InputGroupAddon
} from 'reactstrap';

import { ITEMS_PER_PAGE } from '../constants'

// TODO: Finish pagination

//<div className='text-center'>
  //<Button className="pull-left" color="primary" onClick={() => this._previousPage()}>Previous</Button>
  //<Button color="primary" onClick={() => this._nextPage()}>Next</Button>
//</div>

class ItemList extends Component {

  state = {
    items: [],
    filter: '',
    loading: true,
    error: false
  }

  componentWillMount() {
    this._executeQuery()
  }

  render() {
    if (this.state.loading) {
      return <div className="text-center">Loading...</div>
    }

    // 2
    if (this.state.error) {
      return <div className="text-center">Error (contact: dgolman@vt.edu)</div>
    }

    return (
      <div>
        <div>
          <h1>Items</h1>
          <hr/>
          <FormGroup>
            <InputGroup>
              <Input
                type='text'
                value={this.state.filter}
                onChange={(e) => {this._executeSearch(e.target.value) }}
                placeholder="Search by title or description"
              />
              <InputGroupAddon addonType="append">
                <Button
                  onClick={() => {this._clearSearch(); this._executeQuery()}}
                >
                  Clear
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </FormGroup>
        </div>
        <div>
          <Table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Category</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {this.state.items.map((item, index) => <Item key={item.id} item={item} index={index}/>)}
            </tbody>
          </Table>
        </div>
      </div>
    )
  }

  _nextPage = () => {
    const page = parseInt(this.props.match.params.page, 10)
    if (page <= this.state.items.count / ITEMS_PER_PAGE) {
      const nextPage = page + 1
      this.props.history.push(`/new/${nextPage}`)
    }
  }

  _previousPage = () => {
    const page = parseInt(this.props.match.params.page, 10)
    if (page > 1) {
      const previousPage = page - 1
      this.props.history.push(`/new/${previousPage}`)
    }
  }

  _executeQuery = async () => {
    let err, result
    [err, result] = await to(this.props.client.query({
      query: ITEMS_QUERY,
      variables: { 
        name: 'itemsQuery',
        options: ownProps => {
          const page = parseInt(ownProps.match.params.page, 10)
          const isNewPage = ownProps.location.pathname.includes('new')
          const skip = isNewPage ? (page - 1) * ITEMS_PER_PAGE : 0
          const first = isNewPage ? ITEMS_PER_PAGE : 100
          const orderBy = isNewPage ? 'createdAt_DESC' : null
          return {
            variables: { first, skip, orderBy },
          }
        }
      }
    }))
    if(!err && result) {
      const items = result.data.allItems
      this.setState({ items: items, loading: false })
    } else {
      console.log(err)
      this.setState({error: true, loading: false})
    }
  }

  _executeSearch = async (filter) => {
    if(filter.length > 3) {
      let err, result
      [err, result] = await to(this.props.client.query({
        query: ITEMS_SEARCH_QUERY,
        variables: { filter  }
      }))
      if(!err && result) {
        const items = result.data.allItems
        this.setState({ items: items, loading: false })
      } else {
        console.log(err)
        this.setState({error: true, loading: false})
      }
    } else {
      this._executeQuery()
    }

    this.setState({filter: filter})
    
  }

  _clearSearch(e) {
    this.setState({filter: ''})
  }

}

export const ITEMS_QUERY = gql`
  # 2
  query ItemsQuery($first: Int, $skip: Int) {
    allItems(first: $first, skip: $skip) {
      id
      created_at
      updated_at
      title
      description
      category {
        id
        name
      }
    }
  }
`

const ITEMS_SEARCH_QUERY = gql`
  query ItemsSearchQuery($filter: String!) {
    allItems(filter: {
      title_contains: $filter, 
      OR: { 
        description_contains: $filter
      }
    }) {
      id
      created_at
      updated_at
      title
      description
      category {
        id
        name
      }
    }
  }
`

export default withApollo(ItemList)