'use client';

import { Inter } from 'next/font/google'
import { Poppins } from 'next/font/google'
import "./globals.css";
import { AuthProvider } from '../../components/AuthProvider'
import Navigation from '../../components/Navigation';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] })
const poppins = Poppins({ 
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
})

export default function ClientRootLayout({ children }) {
  const pathname = usePathname();

  // Routes where navigation should not be shown
  const noNavRoutes = ['/login', '/signup', '/reset-password', '/home'];

  return (
    <html lang="en">
      <body className={`${inter.className} ${poppins.variable}`}>
        <AuthProvider>
          {!noNavRoutes.includes(pathname) && <Navigation />}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}