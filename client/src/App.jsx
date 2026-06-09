import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import Overview  from '@/pages/Overview'
import Members   from '@/pages/Members'
import Pipeline  from '@/pages/Pipeline'
import Analytics from '@/pages/Analytics'
import Audit     from '@/pages/Audit'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index            element={<Overview  />} />
        <Route path="members"   element={<Members   />} />
        <Route path="pipeline"  element={<Pipeline  />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="audit"     element={<Audit     />} />
        <Route path="*"         element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}