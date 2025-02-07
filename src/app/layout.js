import { Inter } from 'next/font/google';
import { Poppins } from 'next/font/google'
import "./globals.css";
import { AuthProvider } from '../../components/AuthProvider'

const inter = Inter({ subsets: ['latin'] })
const poppins = Poppins({ 
  weight: ['400', '500', '600', '700', '800'], 
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap'
})

export const metadata = {
  title: "HabitForge - Transform Your Life",
  description: "Build better habits, track your progress, and achieve personal growth.",
  icons: {
    icon: [
      { url: '/Habitforgelogo.png', sizes: '32x32', type: 'image/png' },
      { url: '/Habitforgelogo.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/Habitforgelogo.png', sizes: '180x180' }
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body className={`${poppins.className} font-sans`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}