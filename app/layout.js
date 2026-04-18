import './globals.css'
import Navbar from '@/components/Navbar'
import { AuthProvider } from '@/lib/AuthContext'

export const metadata = {
  title: 'TrueAssets - Real Estate Portal',
  description: 'Premium real estate listing and subscription platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
