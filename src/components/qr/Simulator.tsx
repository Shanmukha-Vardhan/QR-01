"use client";

import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, Monitor, Printer, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming cn is available

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
            width: 100, // Fixed small size for simulator
            margin: 0,
            color: {
                dark: fgColor,
                light: bgColor,
            }
        }, (error) => {
            if (error) console.error(error);
        });
    }, [value, fgColor, bgColor]);

    return <canvas ref={canvasRef} className={className} />;
};

export const Simulator = ({ value, fgColor, bgColor }: SimulatorProps) => {
    return (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    Real-World Simulator
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="card" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="card" className="text-xs">Card</TabsTrigger>
                        <TabsTrigger value="phone" className="text-xs">Phone</TabsTrigger>
                        <TabsTrigger value="poster" className="text-xs">Poster</TabsTrigger>
                    </TabsList>

                    <div className="mt-4 relative bg-muted/30 rounded-lg overflow-hidden h-[240px] flex items-center justify-center border inner-shadow">

                        <TabsContent value="card" className="absolute inset-0 flex items-center justify-center m-0 data-[state=inactive]:hidden">
                            {/* Business Card Mockup */}
                            <div className="w-[200px] h-[120px] bg-white rounded shadow-lg relative p-4 flex items-center gap-4 transform rotate-1 transition-transform hover:rotate-0 border">
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

                        <TabsContent value="phone" className="absolute inset-0 flex items-center justify-center m-0 data-[state=inactive]:hidden">
                            {/* Phone Mockup */}
                            <div className="w-[120px] h-[200px] bg-black rounded-[1.5rem] border-4 border-gray-800 relative shadow-xl transform -rotate-2 scale-90">
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

                        <TabsContent value="poster" className="absolute inset-0 flex items-center justify-center m-0 data-[state=inactive]:hidden">
                            {/* Poster Mockup */}
                            <div className="w-[160px] h-[200px] bg-zinc-900 rounded shadow-lg relative p-3 text-white flex flex-col items-center text-center transform rotate-1 scale-90">
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
                    <p className="text-xs text-muted-foreground mt-3 text-center flex items-center justify-center gap-1.5 opacity-70">
                        <CreditCard className="w-3 h-3" />
                        Preview how it looks in context
                    </p>
                </Tabs>
            </CardContent>
        </Card>
    );
};
