import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, Monitor, Printer } from 'lucide-react';
import QRCode from 'qrcode';
import { useEffect, useRef } from 'react';

interface SimulatorProps {
    value: string;
    fgColor: string;
    bgColor: string;
}

export const Simulator = ({ value, fgColor, bgColor }: SimulatorProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current || !value) return;

        // Simple render for simulator
        QRCode.toCanvas(canvasRef.current, value, {
            width: 100,
            margin: 0,
            color: {
                dark: fgColor,
                light: bgColor,
            }
        }, (error) => {
            if (error) console.error(error);
        });

    }, [value, fgColor, bgColor]);

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

                    <div className="mt-4 relative bg-gray-100 rounded-lg overflow-hidden h-[200px] flex items-center justify-center border inner-shadow">

                        <TabsContent value="card" className="absolute inset-0 flex items-center justify-center">
                            {/* Business Card Mockup */}
                            <div className="w-[180px] h-[100px] bg-white rounded shadow-md relative p-4 flex items-center gap-3 transform rotate-1 transition-transform hover:rotate-0">
                                <div className="flex-1 space-y-1">
                                    <div className="h-2 w-2/3 bg-gray-200 rounded animate-pulse" />
                                    <div className="h-2 w-1/2 bg-gray-200 rounded animate-pulse" />
                                </div>
                                <div className="w-16 h-16 border bg-white flex-shrink-0">
                                    {/* Placeholder for QR */}
                                    <canvas ref={canvasRef} className="w-full h-full object-contain" />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="phone" className="absolute inset-0 flex items-center justify-center">
                            {/* Phone Mockup */}
                            <div className="w-[100px] h-[180px] bg-black rounded-[1.5rem] border-4 border-gray-800 relative shadow-xl transform -rotate-1">
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-gray-800 rounded-full" />
                                <div className="w-full h-full bg-white rounded-[1.2rem] overflow-hidden flex flex-col items-center justify-center pt-8">
                                    <div className="text-[8px] text-gray-500 mb-2">Scan Me</div>
                                    <canvas
                                        ref={el => {
                                            if (el && canvasRef.current && value) {
                                                const ctx = el.getContext('2d');
                                                if (ctx) ctx.drawImage(canvasRef.current, 0, 0, el.width, el.height);
                                            }
                                        }}
                                        className="w-20 h-20"
                                        width={100}
                                        height={100}
                                    />
                                    <div className="mt-4 h-1 w-8 bg-gray-200 rounded" />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="poster" className="absolute inset-0 flex items-center justify-center">
                            {/* Poster Mockup */}
                            <div className="w-[140px] h-[180px] bg-blue-600 rounded shadow-lg relative p-3 text-white flex flex-col items-center text-center transform rotate-1">
                                <div className="text-[10px] font-bold uppercase tracking-widest mb-1">Event</div>
                                <div className="text-[6px] opacity-80 mb-4">Join us today!</div>
                                <div className="bg-white p-1 rounded">
                                    <canvas
                                        ref={el => {
                                            if (el && canvasRef.current && value) {
                                                const ctx = el.getContext('2d');
                                                if (ctx) ctx.drawImage(canvasRef.current, 0, 0, el.width, el.height);
                                            }
                                        }}
                                        className="w-20 h-20"
                                        width={100}
                                        height={100}
                                    />
                                </div>
                            </div>
                        </TabsContent>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                        Simulated Environment Check
                    </p>
                </Tabs>
            </CardContent>
        </Card>
    );
};
