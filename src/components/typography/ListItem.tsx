import { PortableText } from '@portabletext/react'
import React from 'react'

const ListItem = ({ node, index, isOrdered }) => {
  const listItemStyle = {
    // marginBottom: '0.5rem',
    // paddingLeft: '1rem',
  }

  const bulletStyle = {
    // display: 'inline-block',
    // marginRight: '0.5rem',
    // fontWeight: '',
  }

  const getBulletPoint = () => {
    if (isOrdered) {
      return <span style={bulletStyle}>{index + 1}. </span>
    } else {
      return <span style={bulletStyle}>•</span>
    }
  }

  return (
    <li style={listItemStyle}>
      {getBulletPoint()}
      <span>
        {node.children}

        {/* <PortableText value={node.children} /> */}
      </span>
    </li>
  )
}

export default ListItem
