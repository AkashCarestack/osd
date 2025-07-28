import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import slugify from 'slugify'

import { removeNumberPrefix } from '~/utils/common'

// Define the type for the Table of Contents (ToC)
type Headings = Array<{
  children?: Array<{
    marks?: Array<string>
    text?: string
    _type: 'span'
    _key: string
  }>
  style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
  listItem?: 'bullet' | 'number'
  markDefs?: Array<{
    href?: string
    _type: 'link'
    _key: string
  }>
  level?: number
  _type: 'block'
  _key: string
}>

// Define the type for each node in the tree structure
type TreeNode = {
  text: string
  slug: string
  children?: TreeNode[]
}

/**
 * Transforms a flat array of blocks into a nested hierarchical tree structure.
 *
 * This function processes a list of heading blocks, organizing them into a tree structure
 * where each node can have multiple children based on their heading levels. The result is
 * a hierarchical representation of the document's table of contents.
 *
 * Algorithm:
 * 1. Initialize an empty array for the top-level nodes (treeNodes).
 * 2. Initialize an empty stack to keep track of current nodes and their levels.
 * 3. Iterate over each block:
 *    - Extract the heading level from the block's style.
 *    - Create a new tree node with the heading's text and level.
 *    - Adjust the stack to maintain the correct hierarchy:
 *      - Pop nodes from the stack while the top node's level is greater than or equal to the current level.
 *    - Determine the parent node from the top of the stack (if available).
 *    - Add the new node to the parent node's children or to the top-level nodes if no parent node exists.
 *    - Push the new node and its level onto the stack for future nesting.
 * 4. Return the array of top-level nodes.
 *
 * @param blocks - The flat list of heading blocks to transform.
 * @returns - A nested list of tree nodes representing the hierarchical structure.
 */
export function nestHeadings(blocks: Headings): TreeNode[] {
  // Array to hold the top-level nodes of the tree
  const treeNodes: TreeNode[] = []

  // Stack to maintain the current path of nodes and their levels
  const stack: { node: TreeNode; level: number }[] = []

  // Iterate over each block to build the tree structure
  blocks &&
    blocks?.forEach((block) => {
      // Skip blocks without style or children
      if (!block.style || !block.children) return

      // Extract heading level from block style (e.g., 'h2' -> 2)
      const level = parseInt(block.style.replace('h', ''), 10)

      // Extract heading text from block children
      const text =
        block.children.map((child) => child.text || '').join(' ') || 'Untitled'

      // Create a new tree node for the current heading
      const treeNode: TreeNode = {
        slug: slugify(text),
        text,
        children: [],
      }

      // Adjust the stack to ensure the correct hierarchy
      while (stack.length > 0) {
        const topStack = stack[stack.length - 1]

        // If the top node's level is less than the current level, stop popping
        if (topStack && topStack.level < level) break

        // Remove the top node from the stack if it does not fit the current level
        stack.pop()
      }

      // Determine the parent node from the stack (if any)
      if (stack.length > 0) {
        const parentNode = stack[stack.length - 1]?.node
        if (parentNode && !parentNode.children) {
          // Ensure the parent node has a children array
          parentNode.children = []
        }
        // Add the new node to the parent node's children
        parentNode?.children?.push(treeNode)
      } else {
        // If no parent node, add the new node as a top-level node
        treeNodes.push(treeNode)
      }

      // Push the new node and its level onto the stack for future nesting
      stack.push({ node: treeNode, level })
    })

  // Return the top-level nodes of the tree
  return treeNodes
}

export function RenderToc({
  elements,
  level = 1,
}: {
  elements: TreeNode[]
  level?: number
}) {

  const [activeSection, setActiveSection] = React.useState<number | null>(null);

  React.useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout>;
    
    const handleScroll = () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(() => {
        const sections = document.querySelectorAll('h2[id]');
        for (let i = 0; i < sections.length; i++) {
          const section = sections[i];
          const rect = section.getBoundingClientRect();
  
          if (rect.top >= 0 && rect.top <= window.innerHeight) {
            setActiveSection(i + 1);
            break;
          }
          else {
            setActiveSection(null);
          }
        }
      }, 50);
    };
  
    window.addEventListener('scroll', handleScroll);
  
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);
  return (
    <ol
      className={` list-decimal ml-5 flex flex-col gap-3 text-sm lg:text-base  text-zinc-600`}
    >
      {elements.map((el, index) => (
        <li
          key={el.text}
          className={` ${level > 1 ? '[&:first-child]:mt-2' : ''} ${activeSection === index + 1 ? 'text-zinc-600' : ''}`}
        >
          <a
            href={`#${el.slug}`}
            className={`hover:underline hover:underline-offset-4 ${activeSection === index + 1 ? 'underline underline-offset-2' : ''}`}
          >
            {`${removeNumberPrefix(el.text)}`}
          </a>
          {/* {el.children && (
            <RenderToc elements={el.children} level={level + 1} />
          )} */}
        </li>
      ))}
    </ol>
  )
}

export function Toc({
  headings,
  title,
}: {
  headings: Headings
  title?: string
}) {
  if (!headings) return null
  return (
    headings &&
    headings.length > 0 && (
      <section className="flex w-full flex-col p-6 bg-zinc-50 gap-6">
        <h2 className="z-0 pb-3 font-semibold md:top-0 text-base border-b  border-zinc-200 text-zinc-900">
          {title ?? 'Content'}
        </h2>
        <nav className="flex gap-4">
          <RenderToc elements={nestHeadings(headings)} />
        </nav>
      </section>
    )
  )
}
