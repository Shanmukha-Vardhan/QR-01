"use client";

import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from '@/components/ui/button';
import { AlertCircle, QrCode, Download, Copy, RefreshCw, Settings2, Palette, BoxSelect, Image as ImageIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PrivacyDashboard } from './PrivacyDashboard';
import { Simulator } from './Simulator';

// Types
type ECL = 'L' | 'M' | 'Q' | 'H';
type Shape = 'square' | 'rounded' | 'dots';
type GradientType = 'none' | 'linear' | 'radial';

const ECL_OPTIONS: { value: ECL; label: string; description: string }[] = [
    { value: 'L', label: 'Low (7%)', description: 'Best for simple data' },
    { value: 'M', label: 'Medium (15%)', description: 'Standard reliability' },
    { value: 'Q', label: 'Quartile (25%)', description: 'Good for logos' },
    { value: 'H', label: 'High (30%)', description: 'Maximum error correction' },
];

const SHAPE_OPTIONS: { value: Shape; label: string }[] = [
    { value: 'square', label: 'Square' },
    { value: 'rounded', label: 'Rounded' },
    { value: 'dots', label: 'Dots' },
];

const GRADIENT_OPTIONS: { value: GradientType; label: string }[] = [
    { value: 'none', label: 'Solid' },
    { value: 'linear', label: 'Linear' },
    { value: 'radial', label: 'Radial' },
];

export const QRWorkspace = () => {
    // State
    const [inputValue, setInputValue] = useState('');
    const [ecl, setEcl] = useState<ECL>('M');
    const [fgColor, setFgColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [shape, setShape] = useState<Shape>('square');
    const [gradientType, setGradientType] = useState<GradientType>('none');
    const [gradientColor2, setGradientColor2] = useState('#4f46e5'); // Default purple/indigo
    const [size, setSize] = useState([300]);
    const [margin, setMargin] = useState([2]);
    const [logo, setLogo] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Debounce input for preview performance (FR-1.5)
    // Delay slightly increased to avoid flashing during rapid typing
    const debouncedValue = useDebounce(inputValue, 150);

    // Validation (FR-1.1)
    const validateInput = (val: string) => {
        if (!val) return null;
        if (val.length > 2048) return 'Input exceeds 2048 characters limit.';

        // Basic URL validation if it looks like a URL
        if (val.startsWith('http://') || val.startsWith('https://')) {
            try {
                new URL(val);
            } catch {
                return 'Invalid URL format';
            }
        }
        return null;
    };

    // Handle Logo Upload (FR-2.5)
    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setLogo(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Generate SVG String (FR-5.1)
    const generateSVG = (qrData: any, currentSize: number, currentMargin: number) => {
        const moduleCount = qrData.modules.size;
        const scale = currentSize / (moduleCount + currentMargin * 2);
        const offset = currentMargin * scale;

        let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${currentSize}" height="${currentSize}" viewBox="0 0 ${currentSize} ${currentSize}">`;

        // Defs for gradients
        svgContent += '<defs>';
        if (gradientType === 'linear') {
            svgContent += `
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:${fgColor};stop-opacity:1" />
                    <stop offset="100%" style="stop-color:${gradientColor2};stop-opacity:1" />
                </linearGradient>
            `;
        } else if (gradientType === 'radial') {
            svgContent += `
                <radialGradient id="grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" style="stop-color:${fgColor};stop-opacity:1" />
                    <stop offset="100%" style="stop-color:${gradientColor2};stop-opacity:1" />
                </radialGradient>
            `;
        }
        svgContent += '</defs>';

        // Background
        svgContent += `<rect width="100%" height="100%" fill="${bgColor}" />`;

        // Modules
        const fill = gradientType === 'none' ? fgColor : 'url(#grad)';

        qrData.modules.data.forEach((isDark: boolean, index: number) => {
            if (!isDark) return;

            const row = Math.floor(index / moduleCount);
            const col = index % moduleCount;

            const x = offset + col * scale;
            const y = offset + row * scale;
            const w = scale;
            const h = scale;

            // Logo clearing check: simplified
            // In a real implementation, we'd check if the module overlaps with the logo area
            // But since qrcode lib doesn't know about our logo, we just draw everything for SVG
            // Alternatively, we can calculate overlap here similar to canvas logic:
            if (logo) {
                const logoSize = currentSize * 0.2;
                const lx = (currentSize - logoSize) / 2;
                const ly = (currentSize - logoSize) / 2;
                // A simple bounding box check
                if (x + w > lx && x < lx + logoSize && y + h > ly && y < ly + logoSize) {
                    return; // Don't draw modules behind logo
                }
            }

            if (shape === 'rounded') {
                const r = scale * 0.35;
                svgContent += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" />`;
            } else if (shape === 'dots') {
                const cx = x + w / 2;
                const cy = y + h / 2;
                const r = (w / 2) * 0.85;
                svgContent += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" />`;
            } else {
                svgContent += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" />`;
            }
        });

        // Logo Embedding in SVG
        if (logo) {
            const logoSize = currentSize * 0.2;
            const lx = (currentSize - logoSize) / 2;
            const ly = (currentSize - logoSize) / 2;

            // Background rect for logo
            svgContent += `<rect x="${lx - 5}" y="${ly - 5}" width="${logoSize + 10}" height="${logoSize + 10}" rx="5" fill="${bgColor}" />`;

            // Image tag
            svgContent += `<image href="${logo}" x="${lx}" y="${ly}" width="${logoSize}" height="${logoSize}" />`;
        }

        svgContent += '</svg>';
        return svgContent;
    };


    // Handle Downloads (FR-5.1)
    const handleDownload = (format: 'png' | 'svg') => {
        if (!canvasRef.current || !debouncedValue) return;

        if (format === 'png') {
            const canvas = canvasRef.current;
            const link = document.createElement('a');
            link.download = `qr-code-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } else {
            // Generate SVG
            try {
                const qrData = QRCode.create(debouncedValue, { errorCorrectionLevel: ecl });
                const svgString = generateSVG(qrData, size[0], margin[0]);
                const blob = new Blob([svgString], { type: 'image/svg+xml' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.download = `qr-code-${Date.now()}.svg`;
                link.href = url;
                link.click();
                URL.revokeObjectURL(url);
            } catch (e) {
                console.error("SVG generation failed", e);
                setError("Failed to generate SVG");
            }
        }
    };

    useEffect(() => {
        const err = validateInput(debouncedValue);
        setError(err);

        if (!canvasRef.current) return;

        const ctx = canvasRef.current.getContext('2d');
        if (!debouncedValue || err) {
            // Clear canvas if empty or error
            if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            return;
        }

        // Generate QR on Canvas (FR-1.5, FR-1.6, FR-2.3, FR-2.x)
        const generateCanvasQR = async () => {
            if (!canvasRef.current) return;

            try {
                const qrData = QRCode.create(debouncedValue, { errorCorrectionLevel: ecl });
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                const moduleCount = qrData.modules.size;
                const currentSize = size[0];
                const currentMargin = margin[0];
                const scale = currentSize / (moduleCount + currentMargin * 2);

                // Adjust canvas size for hi-dpi
                const dpr = window.devicePixelRatio || 1;
                canvas.width = currentSize * dpr;
                canvas.height = currentSize * dpr;
                canvas.style.width = `${currentSize}px`;
                canvas.style.height = `${currentSize}px`;
                ctx.scale(dpr, dpr);

                // Fill background
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, currentSize, currentSize);

                // Setup Foreground Style (Color or Gradient)
                let fillStyle: string | CanvasGradient = fgColor;
                if (gradientType === 'linear') {
                    const gradient = ctx.createLinearGradient(0, 0, currentSize, currentSize);
                    gradient.addColorStop(0, fgColor);
                    gradient.addColorStop(1, gradientColor2);
                    fillStyle = gradient;
                } else if (gradientType === 'radial') {
                    // Center radial gradient
                    const gradient = ctx.createRadialGradient(currentSize / 2, currentSize / 2, currentSize / 10, currentSize / 2, currentSize / 2, currentSize / 1.5);
                    gradient.addColorStop(0, fgColor);
                    gradient.addColorStop(1, gradientColor2);
                    fillStyle = gradient;
                }
                ctx.fillStyle = fillStyle;

                const offset = currentMargin * scale;

                qrData.modules.data.forEach((isDark: boolean, index: number) => {
                    if (!isDark) return;

                    const row = Math.floor(index / moduleCount);
                    const col = index % moduleCount;

                    const x = offset + col * scale;
                    const y = offset + row * scale;
                    const w = scale;
                    const h = scale;

                    // Draw module based on shape
                    ctx.beginPath();
                    if (shape === 'rounded') {
                        const r = scale * 0.35;
                        if (ctx.roundRect) {
                            ctx.roundRect(x, y, w, h, r);
                        } else {
                            ctx.rect(x, y, w, h);
                        }
                    } else if (shape === 'dots') {
                        const cx = x + w / 2;
                        const cy = y + h / 2;
                        const radius = (w / 2) * 0.85;
                        ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
                    } else {
                        ctx.rect(x, y, w, h);
                    }
                    ctx.fill();
                });

                // Draw Logo
                if (logo) {
                    const img = new Image();
                    img.src = logo;
                    img.onload = () => {
                        const logoSize = currentSize * 0.2;
                        const lx = (currentSize - logoSize) / 2;
                        const ly = (currentSize - logoSize) / 2;

                        // Clear area behind logo
                        ctx.fillStyle = bgColor;
                        ctx.beginPath();
                        if (ctx.roundRect) ctx.roundRect(lx - 5, ly - 5, logoSize + 10, logoSize + 10, 5);
                        else ctx.rect(lx - 5, ly - 5, logoSize + 10, logoSize + 10);
                        ctx.fill();

                        ctx.drawImage(img, lx, ly, logoSize, logoSize);
                    };
                }

            } catch (err) {
                console.error(err);
                setError('Rendering failed');
            }
        };

        generateCanvasQR();

    }, [debouncedValue, ecl, fgColor, bgColor, shape, gradientType, gradientColor2, size, margin, logo]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
            {/* Left Panel: Input & Options (3 cols) */}
            <div className="md:col-span-3 space-y-6">
                <div className="border rounded-lg p-5 bg-card shadow-sm space-y-4 h-full">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <Settings2 className="w-5 h-5 text-primary" />
                            Config
                        </h2>
                    </div>

                    {/* Tabs for different controls */}
                    <Tabs defaultValue="content" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 h-9">
                            <TabsTrigger value="content" className="text-xs">Data</TabsTrigger>
                            <TabsTrigger value="style" className="text-xs">Style</TabsTrigger>
                            <TabsTrigger value="logo" className="text-xs">Logo</TabsTrigger>
                        </TabsList>

                        <TabsContent value="content" className="space-y-4 pt-4">
                            {/* Input */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-xs font-medium">Content / URL</Label>
                                    {inputValue && (
                                        <button
                                            onClick={() => setInputValue('')}
                                            className="text-[10px] text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors px-2 py-0.5 rounded-md hover:bg-muted"
                                        >
                                            <X className="w-3 h-3" />
                                            Clear
                                        </button>
                                    )}
                                </div>
                                <div className="relative">
                                    <textarea
                                        className={cn(
                                            "w-full p-3 border rounded-lg h-32 bg-background/50 resize-y min-h-[120px] focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-mono leading-relaxed",
                                            error ? "border-destructive focus:ring-destructive/20" : "border-input hover:border-primary/50"
                                        )}
                                        placeholder="Enter URL, text, tel:, mailto:, etc."
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        spellCheck={false}
                                    />
                                    <div className="absolute bottom-2 right-2 flex justify-end">
                                        <span className={cn(
                                            "text-[10px] transition-colors",
                                            inputValue.length > 2000 ? "text-destructive" : "text-muted-foreground/60"
                                        )}>
                                            {inputValue.length} / 2048
                                        </span>
                                    </div>
                                </div>
                                {error && (
                                    <div className="flex items-center gap-2 text-destructive text-xs animate-in slide-in-from-top-1 bg-destructive/5 p-2 rounded-md border border-destructive/10">
                                        <AlertCircle className="w-3 h-3" />
                                        <span>{error}</span>
                                    </div>
                                )}
                            </div>

                            {/* ECL Selection */}
                            <div className="space-y-2 pt-2 border-t">
                                <Label className="text-xs">Error Correction</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {ECL_OPTIONS.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => setEcl(option.value)}
                                            className={cn(
                                                "flex flex-col items-start p-1.5 rounded-md border text-left transition-all hover:bg-muted/50",
                                                ecl === option.value
                                                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                                                    : "border-input bg-transparent"
                                            )}
                                        >
                                            <span className="text-xs font-semibold">{option.label.split(' ')[0]}</span>
                                            <span className="text-[9px] text-muted-foreground line-clamp-1">{option.description}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="style" className="space-y-4 pt-4">
                            {/* Colors & Gradient */}
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-xs">Color Style</Label>
                                        <div className="flex gap-1 bg-muted p-0.5 rounded-md">
                                            {GRADIENT_OPTIONS.map(g => (
                                                <button
                                                    key={g.value}
                                                    onClick={() => setGradientType(g.value)}
                                                    className={cn(
                                                        "text-[10px] px-2 py-0.5 rounded-sm transition-all",
                                                        gradientType === g.value ? "bg-white shadow text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                                                    )}
                                                >
                                                    {g.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <Label className="text-xs">Primary Color</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-full justify-start gap-2 h-8 px-2">
                                                    <div className="w-4 h-4 rounded-full border shadow-sm" style={{ backgroundColor: fgColor }} />
                                                    <span className="text-[10px] font-mono truncate">{fgColor}</span>
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-3">
                                                <HexColorPicker color={fgColor} onChange={setFgColor} />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    {gradientType !== 'none' && (
                                        <div className="space-y-1 animate-in fade-in zoom-in-95">
                                            <Label className="text-xs">Gradient End</Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" className="w-full justify-start gap-2 h-8 px-2">
                                                        <div className="w-4 h-4 rounded-full border shadow-sm" style={{ backgroundColor: gradientColor2 }} />
                                                        <span className="text-[10px] font-mono truncate">{gradientColor2}</span>
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-3">
                                                    <HexColorPicker color={gradientColor2} onChange={setGradientColor2} />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    )}

                                    <div className={cn("space-y-1", gradientType === 'none' ? "col-span-1" : "col-span-2")}>
                                        <Label className="text-xs">Background</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-full justify-start gap-2 h-8 px-2">
                                                    <div className="w-4 h-4 rounded-full border shadow-sm" style={{ backgroundColor: bgColor }} />
                                                    <span className="text-[10px] font-mono truncate">{bgColor}</span>
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-3">
                                                <HexColorPicker color={bgColor} onChange={setBgColor} />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                            </div>

                            {/* Shapes */}
                            <div className="space-y-2 pt-2 border-t">
                                <Label className="text-xs">Module Shape</Label>
                                <div className="grid grid-cols-3 gap-1">
                                    {SHAPE_OPTIONS.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => setShape(option.value)}
                                            className={cn(
                                                "flex flex-col items-center justify-center p-2 rounded-md border text-center transition-all hover:bg-muted/50 gap-1",
                                                shape === option.value
                                                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                                                    : "border-input bg-transparent"
                                            )}
                                        >
                                            {option.value === 'square' && <div className="w-3 h-3 bg-current" />}
                                            {option.value === 'rounded' && <div className="w-3 h-3 bg-current rounded-sm" />}
                                            {option.value === 'dots' && <div className="w-3 h-3 bg-current rounded-full" />}
                                            <span className="text-[10px] font-medium">{option.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Size & Margin */}
                            <div className="space-y-4 pt-2 border-t">
                                <div className="space-y-1">
                                    <div className="flex justify-between">
                                        <Label className="text-xs">Size</Label>
                                        <span className="text-[10px] text-muted-foreground">{size[0]}px</span>
                                    </div>
                                    <Slider
                                        value={size}
                                        onValueChange={setSize}
                                        min={128}
                                        max={1024}
                                        step={32}
                                        className="py-1"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between">
                                        <Label className="text-xs">Margin</Label>
                                        <span className="text-[10px] text-muted-foreground">{margin[0]} mod</span>
                                    </div>
                                    <Slider
                                        value={margin}
                                        onValueChange={setMargin}
                                        min={0}
                                        max={10}
                                        step={1}
                                        className="py-1"
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="logo" className="pt-4 space-y-4">
                            <div
                                className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 text-center space-y-2 text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer relative min-h-[120px]"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleLogoUpload}
                                />
                                {logo ? (
                                    <div className="relative group">
                                        <img src={logo} alt="Uploaded logo" className="w-16 h-16 object-contain rounded border bg-white" />
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setLogo(null);
                                                if (fileInputRef.current) fileInputRef.current.value = '';
                                            }}
                                            className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <ImageIcon className="w-6 h-6 opacity-50" />
                                        <p className="text-xs font-medium">Click to upload</p>
                                    </>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Center Panel: Preview (5 cols) */}
            <div className="md:col-span-5">
                <div className="h-full border rounded-lg p-6 bg-muted/30 flex flex-col items-center justify-center relative min-h-[500px]">
                    <div className="absolute top-4 right-4 flex gap-2">
                        <div className="text-[10px] font-mono text-muted-foreground/70 border px-1.5 py-0.5 rounded bg-background/50 backdrop-blur">
                            {ecl}
                        </div>
                        <div className="text-[10px] font-mono text-muted-foreground/70 border px-1.5 py-0.5 rounded bg-background/50 backdrop-blur">
                            {size[0]}px
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-2xl transition-all duration-300 ring-1 ring-black/5">
                        {!inputValue ? (
                            <div className="w-[300px] h-[300px] flex flex-col items-center justify-center text-muted-foreground bg-gray-50/50 rounded-lg border-2 border-dashed">
                                <QrCode className="w-12 h-12 opacity-20 mb-3" />
                                <span className="text-sm font-medium opacity-60">Start typing...</span>
                            </div>
                        ) : (
                            <canvas ref={canvasRef} className="rounded-lg shadow-sm w-full h-auto max-w-[300px]" />
                        )}
                    </div>

                    <div className="mt-8 flex gap-3 w-full max-w-[300px]">
                        <Button
                            variant="default"
                            disabled={!inputValue || !!error}
                            className="flex-1 gap-2"
                            onClick={() => handleDownload('png')}
                        >
                            <Download className="w-4 h-4" />
                            PNG
                        </Button>
                        <Button
                            variant="outline"
                            disabled={!inputValue || !!error}
                            className="flex-1 gap-2"
                            onClick={() => handleDownload('svg')}
                        >
                            <Download className="w-4 h-4" />
                            SVG
                        </Button>
                    </div>
                </div>
            </div>

            {/* Right Panel: Dashboard & Simulator (4 cols) */}
            <div className="md:col-span-4 space-y-4">
                <PrivacyDashboard />
                <Simulator
                    value={debouncedValue}
                    fgColor={fgColor}
                    bgColor={bgColor}
                />
            </div>
        </div>
    );
};
