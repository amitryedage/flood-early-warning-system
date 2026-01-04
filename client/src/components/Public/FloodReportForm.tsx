import React, { useState } from 'react';
import { Camera, Send, X, AlertOctagon, CheckCircle2 } from 'lucide-react';

interface FloodReportFormProps {
    onClose?: () => void;
}

const FloodReportForm: React.FC<FloodReportFormProps> = ({ onClose }) => {
    const [severity, setSeverity] = useState<'LOW' | 'MEDIUM' | 'HIGH' | ''>('');
    const [description, setDescription] = useState('');
    const [landmark, setLandmark] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);

            // Reset after 3 seconds
            setTimeout(() => {
                setIsSuccess(false);
                if (onClose) onClose();
            }, 3000);
        }, 1500);
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Report Received</h3>
                <p className="text-slate-500 max-w-xs mt-2">Thank you! Your report has been sent to the District Command Center (War Room).</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <AlertOctagon className="text-red-500" /> Report Flooding
                </h3>
                {onClose && (
                    <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {/* Severity Selection */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Flood Severity</label>
                    <div className="grid grid-cols-3 gap-3">
                        {['LOW', 'MEDIUM', 'HIGH'].map((s) => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => setSeverity(s as any)}
                                className={`py-3 rounded-lg border-2 font-bold transition-all ${severity === s
                                        ? s === 'LOW' ? 'bg-yellow-50 border-yellow-500 text-yellow-700' :
                                            s === 'MEDIUM' ? 'bg-orange-50 border-orange-500 text-orange-700' :
                                                'bg-red-50 border-red-500 text-red-700'
                                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Landmark */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Nearest Landmark</label>
                    <input
                        type="text"
                        required
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="e.g., Near Bus Stand, Old Bridge"
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Details (Optional)</label>
                    <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the situation..."
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all resize-none"
                    />
                </div>

                {/* Image Placeholder */}
                <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-100 transition-all border-spacing-4">
                    <Camera className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-500">UPLOAD PHOTO</span>
                </div>
            </div>

            <button
                type="submit"
                disabled={!severity || isSubmitting}
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg active:scale-[0.98]"
            >
                {isSubmitting ? (
                    'TRANSMITTING...'
                ) : (
                    <>
                        <Send className="w-5 h-5" /> SUBMIT REPORT
                    </>
                )}
            </button>
        </form>
    );
};

export default FloodReportForm;
