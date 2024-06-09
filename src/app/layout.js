import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navbar";
import { BrowserRouter } from 'react-router-dom'

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "WEB3EDU",
  description: "Blochain + Education = WEB3EDU",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            <Navigation />
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
