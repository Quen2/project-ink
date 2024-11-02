import { Inter } from 'next/font/google';
import './globals.css';
import { NextAuthProvider } from '@/components/providers/authProvider';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

config.autoAddCss = false;

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Ink',
  description: 'Meilleur projet',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <NextAuthProvider>
          <body className={inter.className}>
            <ToastContainer />
            {children}
          </body>
        </NextAuthProvider>
    </html>
  );
}
