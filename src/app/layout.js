import ClientRootLayout from './ClientRootLayout';



export const metadata = {
  title: "HabitForge - Transform Your Life",
  description: "Build better habits, track your progress, and achieve personal growth.",
};

export default function RootLayout({ children }) {
  return (
    <ClientRootLayout>{children}</ClientRootLayout>
  );
}