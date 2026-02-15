import { QrCode } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const Header = () => {
    return (
        <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-2">
                    <QrCode className="h-6 w-6 text-primary" />
                    <span className="text-lg font-bold tracking-tight">Premium QR</span>
                </div>

                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                    <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
                    <Link href="#privacy" className="hover:text-foreground transition-colors">Privacy</Link>
                    <Link href="#export" className="hover:text-foreground transition-colors">Export</Link>
                </nav>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">GitHub</Button>
                    <Button size="sm">Get Started</Button>
                </div>
            </div>
        </header>
    )
}
