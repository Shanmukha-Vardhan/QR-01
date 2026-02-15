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
import { Input } from "@/components/ui/input";

// Types
type ECL = 'L' | 'M' | 'Q' | 'H';
type Shape = 'square' | 'rounded' | 'dots';

interface QRConfig {
    value: string;
    ecl: ECL;
    size: number;
    margin: number;
    color: {
        dark: string;
        light: string;
    };
    shape: Shape;
}

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

export const QRWorkspace = () => {
    // State
    const [inputValue, setInputValue] = useState('');
    const [ecl, setEcl] = useState<ECL>('M');
    const [fgColor, setFgColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [shape, setShape] = useState<Shape>('square');
    const [size, setSize] = useState([300]);
    const [margin, setMargin] = useState([2]);
    const [logo, setLogo] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Debounce input for preview performance (FR-1.5)
    const debouncedValue = useDebounce(inputValue, 100);

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

    // Handle Downloads (FR-5.1)
    const handleDownload = (format: 'png' | 'svg') => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const link = document.createElement('a');

        if (format === 'png') {
            link.download = 'qr-code.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        } else {
            // Basic SVG export logic (simplified)
            // Truly custom shape SVG export requires generating SVG XML string matching canvas logic
            // For now, we'll alert or implement basic
            alert("SVG export with custom shapes is coming in next update. Please use PNG for now.");
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

        // Generate QR (FR-1.5, FR-1.6, FR-2.3)
        const generateQR = async () => {
            if (!canvasRef.current) return;

            try {
                // Get raw QR data
                const qrData = QRCode.create(debouncedValue, {
                    errorCorrectionLevel: ecl,
                });

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

                // Draw modules
                ctx.fillStyle = fgColor;

                const offset = currentMargin * scale;

                qrData.modules.data.forEach((isDark, index) => {
                    if (!isDark) return;

                    const row = Math.floor(index / moduleCount);
                    const col = index % moduleCount;

                    const x = offset + col * scale;
                    const y = offset + row * scale;
                    const w = scale;
                    const h = scale;

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

                // Draw Logo (FR-2.5)
                if (logo) {
                    const img = new Image();
                    img.src = logo;
                    img.onload = () => {
                        const logoSize = currentSize * 0.2; // 20% of QR size
                        const lx = (currentSize - logoSize) / 2;
                        const ly = (currentSize - logoSize) / 2;

                        // Clear area for logo (optional: draw background rect behind logo)
                        ctx.fillStyle = bgColor;
                        // Draw rounded rect behind logo for cleaner look
                        ctx.beginPath();
                        if (ctx.roundRect) ctx.roundRect(lx - 5, ly - 5, logoSize + 10, logoSize + 10, 5);
                        else ctx.rect(lx - 5, ly - 5, logoSize + 10, logoSize + 10);
                        ctx.fill();

                        ctx.drawImage(img, lx, ly, logoSize, logoSize);
                    };
                }

            } catch (err: any) {
                console.error(err);
                setError('Failed to generate QR code');
            }
        };

        generateQR();

    }, [debouncedValue, ecl, fgColor, bgColor, shape, size, margin, logo]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
            {/* Left Panel: Input & Options */}
            <div className="md:col-span-4 space-y-6">
                <div className="border rounded-lg p-6 bg-card shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <QrCode className="w-5 h-5" />
                            Generator
                        </h2>
                    </div>

                    {/* Tabs for different controls */}
                    <Tabs defaultValue="content" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="content">Content</TabsTrigger>
                            <TabsTrigger value="style">Style</TabsTrigger>
                            <TabsTrigger value="logo">Logo</TabsTrigger>
                        </TabsList>

                        <TabsContent value="content" className="space-y-4 pt-4">
                            {/* FR-1.1: Input */}
                            <div className="space-y-2">
                                <Label>Content / URL</Label>
                                <textarea
                                    className={cn(
                                        "w-full p-3 border rounded-md h-32 bg-background resize-none focus:ring-2 focus:ring-primary/20 outline-none transition-all",
                                        error ? "border-destructive focus:ring-destructive/20" : "border-input"
                                    )}
                                    placeholder="Enter your website URL or text here..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                />
                                {error ? (
                                    <div className="flex items-center gap-2 text-destructive text-sm animate-in slide-in-from-top-1">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>{error}</span>
                                    </div>
                                ) : (
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Supports URLs, Text, WiFi, etc.</span>
                                        <span>{inputValue.length} / 2048 chars</span>
                                    </div>
                                )}
                            </div>

                            {/* FR-1.6: ECL Selection */}
                            <div className="space-y-3 pt-4 border-t">
                                <Label>Error Correction Level</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {ECL_OPTIONS.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => setEcl(option.value)}
                                            className={cn(
                                                "flex flex-col items-start p-2 rounded-md border text-left transition-all hover:bg-muted/50",
                                                ecl === option.value
                                                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                                                    : "border-input bg-transparent"
                                            )}
                                        >
                                            <span className="text-xs font-semibold">{option.label}</span>
                                            <span className="text-[10px] text-muted-foreground line-clamp-1">{option.description}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="style" className="space-y-6 pt-4">
                            {/* FR-2.1, FR-2.2: Colors */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Foreground Color</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full justify-start gap-2 h-10 px-3">
                                                <div className="w-4 h-4 rounded-full border shadow-sm" style={{ backgroundColor: fgColor }} />
                                                <span className="text-xs font-mono">{fgColor}</span>
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-3">
                                            <HexColorPicker color={fgColor} onChange={setFgColor} />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="space-y-2">
                                    <Label>Background Color</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full justify-start gap-2 h-10 px-3">
                                                <div className="w-4 h-4 rounded-full border shadow-sm" style={{ backgroundColor: bgColor }} />
                                                <span className="text-xs font-mono">{bgColor}</span>
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-3">
                                            <HexColorPicker color={bgColor} onChange={setBgColor} />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            {/* FR-2.3: Shapes */}
                            <div className="space-y-3 pt-4 border-t">
                                <Label>Module Shape</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    {SHAPE_OPTIONS.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => setShape(option.value)}
                                            className={cn(
                                                "flex flex-col items-center justify-center p-3 rounded-md border text-center transition-all hover:bg-muted/50 gap-2",
                                                shape === option.value
                                                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                                                    : "border-input bg-transparent"
                                            )}
                                        >
                                            {/* Icons for shapes */}
                                            {option.value === 'square' && <div className="w-4 h-4 bg-current" />}
                                            {option.value === 'rounded' && <div className="w-4 h-4 bg-current rounded-sm" />}
                                            {option.value === 'dots' && <div className="w-4 h-4 bg-current rounded-full" />}
                                            <span className="text-xs font-medium">{option.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* FR-2.6: Size & Margin */}
                            <div className="space-y-4 pt-4 border-t">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <Label>Size (px)</Label>
                                        <span className="text-xs text-muted-foreground">{size[0]}px</span>
                                    </div>
                                    <Slider
                                        value={size}
                                        onValueChange={setSize}
                                        min={128}
                                        max={1024}
                                        step={32}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <Label>Quiet Zone (Margin)</Label>
                                        <span className="text-xs text-muted-foreground">{margin[0]} modules</span>
                                    </div>
                                    <Slider
                                        value={margin}
                                        onValueChange={setMargin}
                                        min={0}
                                        max={10}
                                        step={1}
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="logo" className="pt-4 space-y-4">
                            <div
                                className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 text-center space-y-2 text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer relative"
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
                                        <ImageIcon className="w-8 h-8 opacity-50" />
                                        <p className="text-sm font-medium">Click to upload logo</p>
                                        <p className="text-xs text-muted-foreground">Supports PNG, JPG, SVG</p>
                                    </>
                                )}
                            </div>

                            {logo && (
                                <div className="text-xs text-center text-muted-foreground">
                                    Logo will be centered over the QR code.
                                    <br />Tip: Use 'Quartile' or 'High' error correction.
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Center Panel: Preview */}
            <div className="md:col-span-8">
                <div className="h-full border rounded-lg p-8 bg-muted/30 flex flex-col items-center justify-center relative min-h-[500px]">
                    {/* Info Badge */}
                    <div className="absolute top-4 right-4 flex gap-2">
                        <div className="text-xs font-mono text-muted-foreground/70 border px-2 py-1 rounded bg-background/50 backdrop-blur">
                            ECL: {ecl}
                        </div>
                        <div className="text-xs font-mono text-muted-foreground/70 border px-2 py-1 rounded bg-background/50 backdrop-blur">
                            SIZE: {size[0]}px
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-2xl transition-all duration-300 ring-1 ring-black/5">
                        {!inputValue ? (
                            <div className="w-[300px] h-[300px] flex flex-col items-center justify-center text-muted-foreground bg-gray-50/50 rounded-lg border-2 border-dashed">
                                <QrCode className="w-12 h-12 opacity-20 mb-3" />
                                <span className="text-sm font-medium opacity-60">Start typing to generate...</span>
                            </div>
                        ) : (
                            /* FR-1.5: Canvas Preview */
                            <canvas ref={canvasRef} className="rounded-lg shadow-sm" />
                        )}
                    </div>

                    <div className="mt-8 flex gap-4">
                        <Button
                            variant="outline"
                            disabled={!inputValue || !!error}
                            className="gap-2"
                            onClick={() => handleDownload('png')}
                        >
                            <Download className="w-4 h-4" />
                            Download PNG
                        </Button>
                        <Button
                            variant="outline"
                            disabled={!inputValue || !!error}
                            className="gap-2"
                            onClick={() => handleDownload('svg')}
                        >
                            <Download className="w-4 h-4" />
                            Download SVG
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
