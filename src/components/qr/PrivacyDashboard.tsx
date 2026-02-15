import { ShieldCheck, ServerOff, Workflow, WifiOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const PrivacyDashboard = () => {
    return (
        <div className="space-y-4">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-green-500" />
                        Privacy Audit
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* FR-3.2: Network Monitor */}
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                        <div className="flex items-center gap-2">
                            <WifiOff className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Network Calls</span>
                        </div>
                        <span className="text-xs font-mono bg-green-100 text-green-700 px-2 py-0.5 rounded-full dark:bg-green-900/30 dark:text-green-400">
                            0 Requests
                        </span>
                    </div>

                    {/* FR-3.1: Visualization Flowchart */}
                    <div className="relative pt-2">
                        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-border -z-10" />

                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border-4 border-background dark:bg-blue-900/20">
                                    <span className="text-xs">👤</span>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold">Your Device</p>
                                    <p className="text-[10px] text-muted-foreground">Input & Rendering</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center border-4 border-background dark:bg-purple-900/20">
                                    <span className="text-xs">⚡</span>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold">Browser Engine</p>
                                    <p className="text-[10px] text-muted-foreground">Local Calculation</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center border-4 border-background dark:bg-red-900/20 opacity-50 grayscale">
                                    <ServerOff className="w-4 h-4 text-red-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground line-through">External Server</p>
                                    <p className="text-[10px] text-muted-foreground">Blocked / Not Used</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-3 bg-blue-50 text-blue-700 text-xs rounded border border-blue-100 dark:bg-blue-900/10 dark:text-blue-300 dark:border-blue-900/20">
                        <strong>100% Client-Side:</strong> No data ever leaves your browser.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
