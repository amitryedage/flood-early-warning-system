import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

const SafetyTipsAccordion: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const items = [
        {
            title: 'Before a Flood',
            content: 'Prepare an emergency kit with 3 days of water, food, and medicines. Know your evacuation routes and keep important documents in a waterproof bag.'
        },
        {
            title: 'During a Flood',
            content: 'Move to higher ground immediately. Do not drive through flooded areas. Stay away from downed power lines. Follow official instructions.'
        },
        {
            title: 'Emergency Kit Checklist',
            content: 'Water, Non-perishable food, First aid kit, Flashlight, Batteries, Whistle, Dust mask, Moist towelettes, Local maps, Cell phone with chargers.'
        }
    ];

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-500" />
                Flood Safety Tips
            </h3>

            <div className="space-y-2">
                {items.map((item, idx) => (
                    <div key={idx} className="border border-slate-100 rounded-lg overflow-hidden">
                        <button
                            className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                        >
                            <span className="font-semibold text-slate-700">{item.title}</span>
                            {openIndex === idx ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                        </button>

                        {openIndex === idx && (
                            <div className="p-4 bg-white text-sm text-slate-600 leading-relaxed animate-in slide-in-from-top-2 duration-200">
                                {item.content}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SafetyTipsAccordion;
