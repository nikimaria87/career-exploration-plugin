import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Career Compass',description:'Explore your strengths. Find your next opportunity. Build the evidence to get there.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}
