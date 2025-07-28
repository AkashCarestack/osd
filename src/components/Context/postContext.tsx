import { createContext, useContext, useState } from 'react'

import { Post } from '~/interfaces/post'

interface PostContextProps {
  posts: Post[]
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>
}

const PostContext = createContext<PostContextProps>({
  posts: [],
  setPosts: () => {},
})

export const PostProvider = ({ children }: { children: React.ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>([])

  return (
    <PostContext.Provider value={{ posts, setPosts }}>
      {children}
    </PostContext.Provider>
  )
}

export const usePostContext = () => useContext(PostContext)
