export const Footer = () => {
    return (
        <footer className="w-full border-t border-border/40 py-6 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
                    Built by <span className="font-medium text-foreground">Portfolio Project</span>. The source code is available on GitHub.
                </p>
                <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                    <span className="hover:underline cursor-pointer">Privacy Policy</span>
                    <span className="hover:underline cursor-pointer">Terms of Service</span>
                    <span className="text-muted-foreground/60">v1.0.0</span>
                </div>
            </div>
        </footer>
    )
}
