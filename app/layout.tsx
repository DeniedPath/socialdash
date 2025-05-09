import './globals.css'; // Your global styles
import { Inter } from 'next/font/google';
import AuthProvider from './AuthProvider'; // We'll create this next

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'EchoPulse',
    description: 'Manage & Monitor Your Social Media Like a Pro',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <AuthProvider> {/* Wrap with AuthProvider */}
            {children}
        </AuthProvider>
        </body>
        </html>
    );
}