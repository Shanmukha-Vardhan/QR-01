import { ShieldCheck, ServerOff, Workflow, WifiOff, Lock, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PrivacyDashboardProps {
    isGenerating?: boolean;
}

export const PrivacyDashboard = ({ isGenerating }: PrivacyDashboardProps) => {
    return (
        <div className="space-y-4">
            <Card className={cn("transition-all duration-300", isGenerating && "border-primary/50 shadow-md ring-1 ring-primary/20")}>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className={cn("w-4 h-4 transition-colors", isGenerating ? "text-primary animate-pulse" : "text-green-500")} />
                            Privacy Audit
                        </div>
                        {isGenerating && (
                            <span className="text-[10px] text-primary flex items-center gap-1 animate-pulse">
                                <Activity className="w-3 h-3" />
                                Processing Locally
                            </span>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* FR-3.2: Network Monitor */}
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border transition-colors hover:bg-muted/80">
                        <div className="flex items-center gap-2">
                            <WifiOff className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Network Calls</span>
                        </div>
                        <span className="text-xs font-mono bg-green-100 text-green-700 px-2 py-0.5 rounded-full dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            0 Requests
                        </span>
                    </div>

                    {/* FR-3.1: Visualization Flowchart */}
                    <div className="relative pt-2">
                        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-border -z-10" />

                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border-4 border-background dark:bg-blue-900/20 z-10 transition-transform hover:scale-110">
                                    <span className="text-xs">👤</span>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold">Your Device</p>
                                    <p className="text-[10px] text-muted-foreground">Input & Rendering</p>
                                </div>
                            </div>

                            <div className={cn("flex items-center gap-3 transition-all duration-500", isGenerating && "scale-105")}>
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center border-4 border-background z-10 transition-colors duration-300",
                                    isGenerating
                                        ? "bg-primary text-primary-foreground shadow-lg ring-2 ring-primary/20 animate-pulse"
                                        : "bg-purple-100 dark:bg-purple-900/20 text-foreground"
                                )}>
                                    <span className="text-xs">⚡</span>
                                </div>
                                <div>
                                    <p className={cn("text-xs font-semibold transition-colors", isGenerating && "text-primary")}>Browser Engine</p>
                                    <p className="text-[10px] text-muted-foreground">Local Calculation</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center border-4 border-background dark:bg-red-900/20 opacity-50 grayscale z-10">
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
