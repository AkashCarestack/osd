import { PortableText } from '@portabletext/react'
import React from 'react'

const TextBlock = ({ content }) => {
  return <PortableText value={content} />
}

export default TextBlock
