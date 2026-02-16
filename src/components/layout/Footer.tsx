import Link from 'next/link';
import { Github, Twitter, Globe, Lock, Code2 } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="w-full border-t border-border/40 py-8 bg-muted/20">
            <div className="container flex flex-col md:flex-row items-center justify-between gap-6">

                {/* Brand & Copy */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
                    <p className="text-sm font-semibold flex items-center gap-2">
                        <Lock className="w-4 h-4 text-primary" />
                        Premium QR Generator
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        &copy; 2026 Portfolio Project. Open Source.
                    </p>
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-4">
                    <Link
                        href="https://github.com/Shanmukha-Vardhan"
                        target="_blank"
                        className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <Github className="w-5 h-5" />
                        <span className="sr-only">GitHub</span>
                    </Link>
                    <Link
                        href="#"
                        className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <Twitter className="w-5 h-5" />
                        <span className="sr-only">Twitter</span>
                    </Link>
                    <Link
                        href="#"
                        className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <Globe className="w-5 h-5" />
                        <span className="sr-only">Portfolio</span>
                    </Link>
                </div>

                {/* Meta Links */}
                <div className="flex items-center gap-6 text-xs font-medium text-muted-foreground">
                    <Link href="#privacy" className="hover:text-primary transition-colors hover:underline">
                        Privacy Policy
                    </Link>
                    <Link href="#terms" className="hover:text-primary transition-colors hover:underline">
                        Terms of Use
                    </Link>
                    <span className="flex items-center gap-1 px-2 py-1 rounded bg-muted/50 border">
                        <Code2 className="w-3 h-3" />
                        v1.0.0
                    </span>
                </div>
            </div>
        </footer>
    );
};
