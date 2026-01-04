import React, { useState } from 'react';
import { Bell, Mail, Phone, ShieldCheck, X } from 'lucide-react';
import axios from 'axios';

interface AlertSubscriptionFormProps {
    onClose?: () => void;
}

const AlertSubscriptionForm: React.FC<AlertSubscriptionFormProps> = ({ onClose }) => {
    const [method, setMethod] = useState<'SMS' | 'EMAIL'>('SMS');
    const [contact, setContact] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await axios.post('http://localhost:3000/api/subscribe', {
                contact,
                method,
                district: 'Godavari Basin'
            });
            setIsSuccess(true);
        } catch (err: any) {
            console.error('Subscription error:', err);
            setError(err.response?.data?.message || 'Failed to activate alerts. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-center p-6">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 animate-bounce">
                    <ShieldCheck className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Alerts Activated</h3>
                <p className="text-slate-500 mt-2">
                    You will receive critical updates on <strong>{contact}</strong> as soon as the status changes in your district.
                </p>
                <button
                    onClick={onClose}
                    className="mt-8 text-sky-600 font-bold hover:underline"
                >
                    BACK TO DASHBOARD
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Bell className="text-orange-500" /> Early Warning Alerts
                </h3>
                {onClose && (
                    <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                )}
            </div>

            <p className="text-slate-500 text-sm">
                Get real-time notifications on your phone when water levels reach critical thresholds.
            </p>

            <div className="space-y-4">
                <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
                    <button
                        type="button"
                        onClick={() => setMethod('SMS')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md font-bold text-sm transition-all ${method === 'SMS' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <Phone className="w-4 h-4" /> SMS
                    </button>
                    <button
                        type="button"
                        onClick={() => setMethod('EMAIL')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md font-bold text-sm transition-all ${method === 'EMAIL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <Mail className="w-4 h-4" /> EMAIL
                    </button>
                </div>

                <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                        {method === 'SMS' ? 'Mobile Number' : 'Email Address'}
                    </label>
                    <input
                        type={method === 'SMS' ? 'tel' : 'email'}
                        required
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder={method === 'SMS' ? '+91 999 000 0000' : 'name@example.com'}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all font-medium"
                    />
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 rounded-xl border border-red-100 text-[11px] text-red-600 font-medium">
                    ⚠️ {error}
                </div>
            )}

            <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 italic text-[11px] text-orange-700">
                Note: This is a simulation. No actual messages will be sent to this number/email in this demo environment.
            </div>

            <button
                type="submit"
                disabled={!contact || isSubmitting}
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 transition-all shadow-lg active:scale-[0.98]"
            >
                {isSubmitting ? 'SECURELY SAVING...' : 'ACTIVATE ALERTS'}
            </button>
        </form>
    );
};

export default AlertSubscriptionForm;
