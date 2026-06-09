import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import MobileNav from './MobileNav'
import useWindowSize from '@/hooks/useWindowSize'

export default function Layout() {
  const { isMobile } = useWindowSize()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#060E1A' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopBar />
        <main style={{
          flex: 1,
          padding: isMobile ? '1rem 0.85rem 80px' : '1.5rem',
          overflowY: 'auto',
        }}>
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  )
}