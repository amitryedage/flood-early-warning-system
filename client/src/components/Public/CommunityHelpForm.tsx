import React, { useState } from 'react';
import { Heart, Ship, Package, Home, Truck, Phone, User, MapPin, CheckCircle2 } from 'lucide-react';

interface CommunityHelpFormProps {
    onClose: () => void;
    onSubmit: (data: any) => void;
}

const CommunityHelpForm: React.FC<CommunityHelpFormProps> = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        resourceType: 'FOOD',
        description: '',
        location: ''
    });

    const resources = [
        { id: 'FOOD', label: 'Food & Water', icon: Package, color: 'text-orange-500', bg: 'bg-orange-50' },
        { id: 'BOAT', label: 'Boat / Raft', icon: Ship, color: 'text-blue-500', bg: 'bg-blue-50' },
        { id: 'SHELTER', label: 'Spare Beds', icon: Home, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { id: 'TRANSPORT', label: 'Truck / SUV', icon: Truck, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="p-1">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-red-500 fill-red-500 animate-pulse" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Civic Resilience</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Help neighbors during crisis</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">What can you offer?</label>
                    <div className="grid grid-cols-2 gap-3">
                        {resources.map((res) => (
                            <button
                                key={res.id}
                                type="button"
                                onClick={() => setFormData({ ...formData, resourceType: res.id })}
                                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 ${formData.resourceType === res.id
                                        ? 'border-blue-500 bg-blue-50/50 ring-4 ring-blue-50'
                                        : 'border-slate-100 hover:border-slate-200'
                                    }`}
                            >
                                <res.icon className={`w-6 h-6 ${res.color}`} />
                                <span className="text-[10px] font-black text-slate-700 uppercase">{res.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="YOUR FULL NAME"
                            className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-12 text-sm font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500 transition-all uppercase"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="tel"
                            placeholder="CONTACT NUMBER"
                            className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-12 text-sm font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500 transition-all"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                        />
                    </div>

                    <div className="relative">
                        <MapPin className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                        <textarea
                            placeholder="RESOURCE LOCATION / ADDRESS"
                            className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-12 text-sm font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500 transition-all h-24 uppercase"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            required
                        ></textarea>
                    </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                    <p className="text-[10px] font-bold text-blue-700 leading-relaxed italic">
                        By submitting, your resource will be visible to official rescue teams on the Admin War Room map. They may contact you via phone if needed.
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-4 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-[2] py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2"
                    >
                        Broadcast Help <CheckCircle2 className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CommunityHelpForm;
