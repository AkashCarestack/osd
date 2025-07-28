import React, { createContext, ReactNode,useContext } from 'react'

const GlobalDataContext = createContext<any | null>(null)

export const GlobalDataProvider = ({
  data,
  featuredTags,
  eventCards,
  homeSettings,
  footerData,
  children,
}: {
  data?: any
  featuredTags?: any
  eventCards?: any
  homeSettings?: any
  footerData?: any
  children: ReactNode
}) => {
  return (
    <GlobalDataContext.Provider value={{ data, featuredTags, eventCards, homeSettings,footerData }}>
      {children}
    </GlobalDataContext.Provider>
  )
}

export const useGlobalData = () => {
  const context = useContext(GlobalDataContext)
  if (!context) {
    console.error(
      'Error: useGlobalData must be used within a GlobalDataProvider',
    )
  }
  return context
}
