import Link from 'next/link'
import Footer from '~/layout/Footer'
import Header from '~/layout/Header'
import { useGlobalData } from './Context/GlobalDataContext'
import VSfooter from '~/layout/VSfooter'

interface LayoutProps {
  children: React.ReactNode
  fullWidth?: boolean
  className?: string
}

export default function Layout({
  children,
  className,
  fullWidth = false,
}: LayoutProps) {

  const { homeSettings } = useGlobalData();

  return (
    <div
      className={`flex flex-col w-full h-full items-center`}
    >
      <Header />
      <main className="w-full flex flex-col">
      {children}</main>
      <VSfooter className={`w-full flex content-center `} />
    </div>
  )
}
