import React from 'react';
import StatusBanner from '../../components/Public/StatusBanner';
import ThreatGauge from '../../components/Public/ThreatGauge';
import InfoCardsGrid from '../../components/Public/InfoCardsGrid';
import QuickActionsGrid from '../../components/Public/QuickActionsGrid';
import AlertsFeed from '../../components/Public/AlertsFeed';
import SafetyTipsAccordion from '../../components/Public/SafetyTipsAccordion';

const PublicDashboard: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto">
            {/* 1. Status Banner */}
            <StatusBanner status="safe" />

            {/* 2. Main Risk Visualization */}
            <ThreatGauge />

            {/* 3. Key Metrics */}
            <InfoCardsGrid />

            {/* 4. Primary Actions */}
            <QuickActionsGrid />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 5. Recent Alerts */}
                <div>
                    <AlertsFeed />
                </div>

                {/* 6. Education / Safety */}
                <div>
                    <SafetyTipsAccordion />
                </div>
            </div>
        </div>
    );
};

export default PublicDashboard;
