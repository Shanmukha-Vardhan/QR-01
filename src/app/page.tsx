import { QRWorkspace } from '@/components/qr/QRWorkspace';
import { ShieldCheck, Palette, Zap, Download, Layers } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-950 dark:via-background dark:to-gray-900">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/50 text-blue-700 text-xs font-medium mb-6 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            v1.0 Now Live
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
            Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Zero-Track</span> <br />
            QR Generator
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Create stunning, privacy-first QR codes directly in your browser.
            No server tracking, no data collection—just pure, client-side magic.
          </p>
        </div>

        {/* Background Decorative Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
      </section>

      {/* Main Workspace */}
      <section id="workspace" className="container mx-auto px-4 -mt-10 relative z-20 pb-20 scroll-mt-20">
        <QRWorkspace />
      </section>

      {/* Features Overview */}
      <section id="features" className="py-20 bg-gray-50/50 dark:bg-gray-900/20 border-t scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Premium QR?</h2>
            <p className="text-muted-foreground">
              Most free QR generators track your data or redirect your users. We don't.
              Everything happens locally on your device.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<ShieldCheck className="w-8 h-8 text-green-500" />}
              title="100% Client-Side Privacy"
              description="Your data never leaves your browser. Zero server logs, zero tracking, zero risk."
            />
            <FeatureCard
              icon={<Palette className="w-8 h-8 text-purple-500" />}
              title="Advanced Customization"
              description="Custom gradients, shapes, logos, and frames. Make your QR code truly yours."
            />
            <FeatureCard
              icon={<Download className="w-8 h-8 text-blue-500" />}
              title="High-Quality Export"
              description="Download in raster (PNG) or vector (SVG) formats for professional print quality."
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-amber-500" />}
              title="Instant Preview"
              description="Real-time rendering as you type. No waiting for server roundtrips."
            />
            <FeatureCard
              icon={<Layers className="w-8 h-8 text-indigo-500" />}
              title="Real-World Simulator"
              description="Test scanability on different surfaces and conditions before you print."
            />
            <FeatureCard
              icon={<div className="font-bold text-xl text-gray-500">Free</div>} // Placeholder for pricing icon
              title="Free Forever"
              description="Open source and free for personal and commercial use. No hidden fees."
            />
          </div>
        </div>
      </section>

      {/* Privacy & Export Sections */}
      <section id="privacy" className="py-16 border-t scroll-mt-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">Your Privacy, Our Promise</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Premium QR is built with a zero-knowledge architecture. Your data never touches our servers—
            all QR code generation happens entirely within your browser using the HTML5 Canvas API.
            We collect no analytics, store no cookies, and require no account.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div className="p-4 rounded-lg border bg-green-50/50 dark:bg-green-950/20">
              <p className="font-semibold text-green-700 dark:text-green-400 mb-1">No Server Requests</p>
              <p className="text-muted-foreground text-xs">Your content stays on your device. Period.</p>
            </div>
            <div className="p-4 rounded-lg border bg-blue-50/50 dark:bg-blue-950/20">
              <p className="font-semibold text-blue-700 dark:text-blue-400 mb-1">No Cookies or Tracking</p>
              <p className="text-muted-foreground text-xs">Zero analytics. Zero fingerprinting.</p>
            </div>
            <div className="p-4 rounded-lg border bg-purple-50/50 dark:bg-purple-950/20">
              <p className="font-semibold text-purple-700 dark:text-purple-400 mb-1">Open Source</p>
              <p className="text-muted-foreground text-xs">Audit the code yourself on GitHub.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="export" className="py-16 bg-gray-50/50 dark:bg-gray-900/20 border-t scroll-mt-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">Export-Ready Quality</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Download your QR codes in high-resolution PNG for digital use, or lossless SVG for
            print-perfect results at any scale. Every export is generated directly from canvas—no compression artifacts.
          </p>
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              PNG — Up to 4x resolution
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <span className="w-3 h-3 rounded-full bg-purple-500"></span>
              SVG — Infinite scalability
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 bg-white dark:bg-card border rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4 inline-flex p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
