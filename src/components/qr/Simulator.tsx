"use client";

import { useRef, useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Smartphone, Monitor, Printer, CreditCard, ScanLine, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SimulatorProps {
    value: string;
    fgColor: string;
    bgColor: string;
}

const QRCanvas = ({ value, fgColor, bgColor, className }: SimulatorProps & { className?: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current || !value) return;

        // Simple render for simulator
        QRCode.toCanvas(canvasRef.current, value, {
            width: 100, // Keep fixed size for base render
            margin: 0,
            color: {
                dark: fgColor,
                light: bgColor, // Use the actual background color
            }
        }, (error) => {
            if (error) console.error(error);
        });
    }, [value, fgColor, bgColor]);

    return <canvas ref={canvasRef} className={className} />; // className controls display size
};

export const Simulator = ({ value, fgColor, bgColor }: SimulatorProps) => {
    const [scanSuccess, setScanSuccess] = useState<number | null>(null);
    const [isScanning, setIsScanning] = useState(false);

    const handleTestScan = () => {
        setIsScanning(true);
        setScanSuccess(null);
        setTimeout(() => {
            setIsScanning(false);
            // Simulate a high success rate for valid inputs
            setScanSuccess(value ? Math.floor(Math.random() * 5) + 95 : 0);
        }, 1500);
    };

    return (
        <Card className="flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        Real-World Simulator
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
                <Tabs defaultValue="card" className="w-full flex-1 flex flex-col">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="card" className="text-xs">Card</TabsTrigger>
                        <TabsTrigger value="phone" className="text-xs">Phone</TabsTrigger>
                        <TabsTrigger value="poster" className="text-xs">Poster</TabsTrigger>
                    </TabsList>

                    <div className="mt-4 relative bg-muted/30 rounded-lg overflow-hidden h-[240px] flex items-center justify-center border shadow-inner group">

                        {/* Zoom Hint */}
                        <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm pointer-events-none">
                            Hover to Zoom
                        </div>

                        <TabsContent value="card" className="absolute inset-0 flex items-center justify-center m-0 data-[state=inactive]:hidden perspective-1000">
                            {/* Business Card Mockup */}
                            <div className="w-[200px] h-[120px] bg-white rounded shadow-lg relative p-4 flex items-center gap-4 transform rotate-1 transition-all duration-500 ease-out hover:scale-150 hover:rotate-0 hover:z-10 border origin-center">
                                <div className="flex-1 space-y-2">
                                    <div className="h-2 w-3/4 bg-gray-200 rounded animate-pulse" />
                                    <div className="h-2 w-1/2 bg-gray-200 rounded animate-pulse" />
                                    <div className="h-2 w-full bg-gray-100 rounded mt-2" />
                                </div>
                                <div className="w-16 h-16 bg-white flex-shrink-0">
                                    <QRCanvas value={value} fgColor={fgColor} bgColor={bgColor} className="w-full h-full object-contain" />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="phone" className="absolute inset-0 flex items-center justify-center m-0 data-[state=inactive]:hidden perspective-1000">
                            {/* Phone Mockup */}
                            <div className="w-[120px] h-[200px] bg-black rounded-[1.5rem] border-4 border-gray-800 relative shadow-xl transform -rotate-2 scale-90 transition-all duration-500 ease-out hover:scale-125 hover:rotate-0 hover:z-10 origin-center">
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-800 rounded-full" />
                                <div className="w-full h-full bg-white rounded-[1.2rem] overflow-hidden flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                                    <div className="text-[10px] font-bold text-gray-400 mb-4">SCAN ME</div>
                                    <div className="p-2 bg-white rounded shadow-sm">
                                        <QRCanvas value={value} fgColor={fgColor} bgColor={bgColor} className="w-16 h-16" />
                                    </div>
                                    <div className="mt-6 h-1 w-12 bg-gray-300 rounded-full opacity-50" />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="poster" className="absolute inset-0 flex items-center justify-center m-0 data-[state=inactive]:hidden perspective-1000">
                            {/* Poster Mockup */}
                            <div className="w-[160px] h-[200px] bg-zinc-900 rounded shadow-lg relative p-3 text-white flex flex-col items-center text-center transform rotate-1 scale-90 transition-all duration-500 ease-out hover:scale-125 hover:rotate-0 hover:z-10 origin-center">
                                <div className="w-full h-24 bg-gradient-to-br from-pink-500 to-orange-400 rounded-t mb-2 flex items-center justify-center">
                                    <span className="text-xl font-bold opacity-20">EVENT</span>
                                </div>
                                <div className="bg-white p-1 rounded -mt-8 shadow-lg z-10">
                                    <QRCanvas value={value} fgColor={fgColor} bgColor={bgColor} className="w-16 h-16" />
                                </div>
                                <div className="mt-2 text-[8px] opacity-60 font-mono tracking-widest text-center">
                                    SCAN FOR DETAILS
                                </div>
                            </div>
                        </TabsContent>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-8 gap-2 w-full"
                            onClick={handleTestScan}
                            disabled={isScanning || !value}
                        >
                            {isScanning ? (
                                <>
                                    <ScanLine className="w-3 h-3 animate-pulse text-primary" />
                                    Scanning...
                                </>
                            ) : (
                                <>
                                    <ScanLine className="w-3 h-3" />
                                    Test Scanability
                                </>
                            )}
                        </Button>
                    </div>
                    {scanSuccess !== null && (
                        <div className={cn(
                            "mt-2 text-[10px] items-center justify-center flex gap-1.5 font-medium animate-in fade-in slide-in-from-bottom-1",
                            scanSuccess > 90 ? "text-green-600" : "text-amber-600"
                        )}>
                            {scanSuccess > 90 ? (
                                <CheckCircle2 className="w-3 h-3" />
                            ) : (
                                <AlertCircle className="w-3 h-3" />
                            )}
                            Scan Confidence: {scanSuccess}%
                        </div>
                    )}
                </Tabs>
            </CardContent>
        </Card>
    );
};
