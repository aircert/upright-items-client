import React, { Component } from 'react'
import {
  Button
} from 'reactstrap';
import FaTrashO from 'react-icons/lib/fa/trash-o'

class Item extends Component {
  render() {
    return (
      <tr>
        <td>{this.props.item.title}</td>
        <td className="description">{this.props.item.description}</td>
        <td>{this.props.item.category.name}</td>
        <td>
          <Button outline size="sm" color="primary" className="btn-margin-right">Edit</Button>
          <Button outline size="sm" color="danger"><FaTrashO/></Button>
        </td>
      </tr>
    )
  }
}

export default Item