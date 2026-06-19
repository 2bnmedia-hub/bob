'use client'

import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import DashboardSection from './components/DashboardSection'
import ProductsSection from './components/ProductsSection'
import CategoriesSection from './components/CategoriesSection'
import AnalyticsSection from './components/AnalyticsSection'
import OrdersSection from './components/OrdersSection'
import ImportModal from './components/ImportModal'

export type Section = 'dashboard' | 'products' | 'categories' | 'analytics' | 'orders'

export default function AdminPage() {
  const [section, setSection] = useState<Section>('dashboard')
  const [importOpen, setImportOpen] = useState(false)
  const [search, setSearch] = useState('')

  return (
    <div className="admin-layout">
      <Sidebar
        active={section}
        onNav={setSection}
        onImport={() => setImportOpen(true)}
      />
      <div className="admin-main">
        <Topbar
          title={TITLES[section]}
          search={search}
          onSearch={setSearch}
          onImport={() => setImportOpen(true)}
          onAddProduct={() => {}}
        />
        <div className="admin-content">
          {section === 'dashboard'   && <DashboardSection />}
          {section === 'products'    && <ProductsSection search={search} />}
          {section === 'categories'  && <CategoriesSection />}
          {section === 'analytics'   && <AnalyticsSection />}
          {section === 'orders'      && <OrdersSection />}
        </div>
      </div>
      {importOpen && <ImportModal onClose={() => setImportOpen(false)} />}
    </div>
  )
}

const TITLES: Record<Section, string> = {
  dashboard:  'סקירה כללית',
  products:   'מוצרים',
  categories: 'קטגוריות',
  analytics:  'אנליטיקס',
  orders:     'הזמנות',
}
