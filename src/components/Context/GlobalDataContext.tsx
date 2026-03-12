import React, { createContext, ReactNode, useContext } from 'react'

const GlobalDataContext = createContext<any | null>(null)

export const GlobalDataProvider = ({
  data,
  featuredTags,
  eventCards,
  homeSettings,
  footerData,
  partners,
  children,
}: {
  data?: any
  featuredTags?: any
  eventCards?: any
  homeSettings?: any
  footerData?: any
  partners?: { slug: string; partnerName?: string }[]
  children: ReactNode
}) => {
  return (
    <GlobalDataContext.Provider
      value={{ data, featuredTags, eventCards, homeSettings, footerData, partners }}
    >
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
