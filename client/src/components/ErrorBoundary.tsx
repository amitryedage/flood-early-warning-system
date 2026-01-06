import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-200">
                    <div className="max-w-2xl w-full bg-slate-900 border border-red-500/50 rounded-2xl shadow-2xl p-8 overflow-hidden relative">
                        {/* Background Effect */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/10 rounded-full blur-3xl"></div>

                        <div className="flex items-start gap-6 relative z-10">
                            <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                                <AlertTriangle className="w-10 h-10 text-red-500" />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-2xl font-black text-white uppercase tracking-tight mb-2">System Critical Failure</h1>
                                <p className="text-slate-400 text-sm mb-6">The dashboard encountered an unrecoverable error and had to shut down to protect system integrity.</p>

                                {this.state.error && (
                                    <div className="bg-[#020617] p-4 rounded-xl border border-slate-800 font-mono text-xs text-red-400 overflow-x-auto mb-4">
                                        <p className="font-bold mb-2 text-red-500">{this.state.error.toString()}</p>
                                        <pre className="text-slate-500">{this.state.errorInfo?.componentStack}</pre>
                                    </div>
                                )}

                                <button
                                    onClick={() => window.location.reload()}
                                    className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl uppercase tracking-widest text-xs transition-all shadow-lg active:scale-95"
                                >
                                    Reboot System
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
