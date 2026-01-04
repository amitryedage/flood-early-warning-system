import React from 'react';
import { Phone, LifeBuoy, HeartPulse, FlameKindling, Info } from 'lucide-react';

const EmergencyContacts: React.FC = () => {
    const contacts = [
        { name: 'Disaster Helpline', number: '108', icon: <LifeBuoy className="w-4 h-4 text-red-500" />, desc: 'Primary emergency response' },
        { name: 'Medical Emergency', number: '102', icon: <HeartPulse className="w-4 h-4 text-rose-500" />, desc: 'Ambulance and medical' },
        { name: 'Fire & Rescue', number: '101', icon: <FlameKindling className="w-4 h-4 text-orange-500" />, desc: 'Fire and structural rescue' },
        { name: 'Flood Control', number: '011-24363260', icon: <Info className="w-4 h-4 text-sky-500" />, desc: 'Local flood monitoring unit' },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                <Phone className="text-red-500 w-5 h-5" /> Emergency Contacts
            </h3>

            <div className="space-y-3">
                {contacts.map((contact, i) => (
                    <a
                        key={i}
                        href={`tel:${contact.number.replace(/-/g, '')}`}
                        className="flex items-center gap-4 p-3 rounded-xl border border-slate-50 hover:border-red-100 hover:bg-red-50 transition-all group"
                    >
                        <div className="p-2.5 bg-slate-50 rounded-lg group-hover:bg-white transition-colors">
                            {contact.icon}
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-slate-800">{contact.name}</h4>
                            <p className="text-[10px] text-slate-500">{contact.desc}</p>
                        </div>
                        <div className="text-right">
                            <span className="text-sm font-black text-slate-900 group-hover:text-red-600 transition-colors">
                                {contact.number}
                            </span>
                        </div>
                    </a>
                ))}
            </div>

            <div className="mt-6 p-4 bg-slate-900 rounded-xl relative overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
                <h4 className="text-white font-bold text-sm mb-1 relative z-10">Stay Prepared</h4>
                <p className="text-slate-400 text-[10px] leading-tight relative z-10">
                    Keep your mobile devices charged and have an emergency kit ready with essentials.
                </p>
            </div>
        </div>
    );
};

export default EmergencyContacts;
