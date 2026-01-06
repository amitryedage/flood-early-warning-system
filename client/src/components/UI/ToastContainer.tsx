import React from 'react';
import { useToast, type ToastType } from '../../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const toastVariants = {
    initial: { opacity: 0, y: 50, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};

const getToastStyles = (type: ToastType) => {
    switch (type) {
        case 'success':
            return 'bg-slate-900 border-emerald-500/50 text-emerald-400 shadow-emerald-900/20';
        case 'error':
            return 'bg-slate-900 border-red-500/50 text-red-400 shadow-red-900/20';
        case 'warning':
            return 'bg-slate-900 border-orange-500/50 text-orange-400 shadow-orange-900/20';
        case 'info':
            return 'bg-slate-900 border-blue-500/50 text-blue-400 shadow-blue-900/20';
        default:
            return 'bg-slate-900 border-slate-700 text-slate-200';
    }
};

const getIcon = (type: ToastType) => {
    switch (type) {
        case 'success': return <CheckCircle className="w-5 h-5 flex-shrink-0" />;
        case 'error': return <AlertCircle className="w-5 h-5 flex-shrink-0" />;
        case 'warning': return <AlertTriangle className="w-5 h-5 flex-shrink-0" />;
        case 'info': return <Info className="w-5 h-5 flex-shrink-0" />;
    }
};

const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        variants={toastVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        layout
                        className={`pointer-events-auto min-w-[320px] max-w-sm w-full p-4 rounded-xl border shadow-2xl backdrop-blur-md flex items-start gap-3 ${getToastStyles(toast.type)}`}
                    >
                        <div className="mt-0.5">{getIcon(toast.type)}</div>
                        <div className="flex-1">
                            <p className="font-bold text-sm leading-snug">{toast.message}</p>
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-slate-500 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default ToastContainer;
