import React, { createContext, ReactNode,useContext } from 'react'

const BaseUrlContext = createContext<string | undefined>(undefined)

export const BaseUrlProvider = ({
  baseUrl,
  children,
}: {
  baseUrl: string
  children: ReactNode
}) => {
  return (
    <BaseUrlContext.Provider value={baseUrl}>
      {children}
    </BaseUrlContext.Provider>
  )
}

export const useBaseUrl = () => {
  const context = useContext(BaseUrlContext)
  return context
}
