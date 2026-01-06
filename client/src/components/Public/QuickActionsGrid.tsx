import React from 'react';
import { Bell, Home, PhoneCall, BookOpen } from 'lucide-react';

interface QuickActionsGridProps {
    onAction?: (action: 'ALERTS' | 'SHELTERS' | 'CONTACTS' | 'TIPS') => void;
}

const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({ onAction }) => {
    const actions = [
        {
            id: 'ALERTS',
            label: 'Set Alerts',
            sub: 'SMS/Email',
            icon: Bell,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
        },
        {
            id: 'SHELTERS',
            label: 'Shelters',
            sub: 'Find Nearest',
            icon: Home,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
        },
        {
            id: 'CONTACTS',
            label: 'Hotlines',
            sub: 'Emergency',
            icon: PhoneCall,
            color: 'text-rose-600',
            bg: 'bg-rose-50',
        },
        {
            id: 'TIPS',
            label: 'Manuals',
            sub: 'How to DIY',
            icon: BookOpen,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
        },
    ] as const;

    return (
        <div className="grid grid-cols-2 gap-4">
            {actions.map((action) => (
                <button
                    key={action.id}
                    onClick={() => onAction?.(action.id)}
                    className="flex flex-col items-center justify-center gap-3 p-5 standard-card text-center group active:scale-95 min-h-[140px]"
                >
                    <div className={`p-3 rounded-2xl ${action.bg} ${action.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                        <action.icon className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="block text-sm font-black text-gray-900 uppercase tracking-tight leading-none mb-1">
                            {action.label}
                        </span>
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                            {action.sub}
                        </span>
                    </div>
                </button>
            ))}
        </div>
    );
};

export default QuickActionsGrid;
