import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

class CategoryList extends Component {
  render() {
    // 1
    if (this.props.categoriesQuery && this.props.categoriesQuery.loading) {
      return "Loading"
    }

    // 2
    if (this.props.categoriesQuery && this.props.categoriesQuery.error) {
      return "Error"
    }

    // 3
    const categoriesToRender = this.props.categoriesQuery.allCategories

    return (
      categoriesToRender.map(category => <option key={category.id} value={category.id}>{category.name}</option>)
    )
  }
}

// 1
const CATEGORIES_QUERY = gql`
  # 2
  query CategoriesQuery {
    allCategories {
      id
      name
    }
  }
`

// 3
export default graphql(CATEGORIES_QUERY, { name: 'categoriesQuery' }) (CategoryList)