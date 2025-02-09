import { Inter } from 'next/font/google';
import { Poppins } from 'next/font/google'
import "./globals.css";
import { AuthProvider } from '../../components/AuthProvider'

const inter = Inter({ subsets: ['latin'] })
const poppins = Poppins({ 
  weight: ['300', '400', '500'], 
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap'
})

export const metadata = {
  title: "HabitForge - Transform Your Life",
  description: "Build better habits, track your progress, and achieve personal growth.",
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