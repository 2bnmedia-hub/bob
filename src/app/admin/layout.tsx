import './admin.css'
import Script from 'next/script'

export const metadata = {
  title: 'לוח בקרה — בוב חומרי בניין',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"
        strategy="beforeInteractive"
      />
      {children}
    </>
  )
}
