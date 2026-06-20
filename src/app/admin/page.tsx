'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import DashboardSection from './components/DashboardSection'
import ProductsSection from './components/ProductsSection'
import CategoriesSection from './components/CategoriesSection'
import AnalyticsSection from './components/AnalyticsSection'
import OrdersSection from './components/OrdersSection'
import GallerySection from './components/GallerySection'
import ImportModal from './components/ImportModal'

export type Section = 'dashboard' | 'products' | 'categories' | 'analytics' | 'orders' | 'gallery'

const TITLES: Record<Section, string> = {
  dashboard: 'סקירה כללית', products: 'מוצרים', gallery: 'גלריה',
  categories: 'קטגוריות', analytics: 'אנליטיקס', orders: 'הזמנות',
}

export default function AdminPage() {
  const [section, setSection]     = useState<Section>('dashboard')
  const [importOpen, setImportOpen] = useState(false)
  const [search, setSearch]       = useState('')
  const [ready, setReady]         = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        window.location.href = '/admin/login'
      } else {
        setReady(true)
      }
    })
  }, [])

  if (!ready) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Open Sans', sans-serif", color:'#888' }}>
      טוען...
    </div>
  )

  return (
    <div className="admin-layout">
      <Sidebar active={section} onNav={setSection} onImport={() => setImportOpen(true)} />
      <div className="admin-main">
        <Topbar title={TITLES[section]} search={search} onSearch={setSearch}
          onImport={() => setImportOpen(true)} onAddProduct={() => {}} />
        <div className="admin-content">
          {section === 'dashboard'  && <DashboardSection />}
          {section === 'products'   && <ProductsSection search={search} />}
          {section === 'categories' && <CategoriesSection />}
          {section === 'analytics'  && <AnalyticsSection />}
          {section === 'orders'     && <OrdersSection />}
          {section === 'gallery'    && <GallerySection />}
        </div>
      </div>
      {importOpen && <ImportModal onClose={() => setImportOpen(false)} />}
    </div>
  )
}
