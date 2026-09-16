import React from 'react';

export default function StatCard({ title, value, icon: Icon, iconColor }) {
    return (
        <div className="usersStatCard" style={{ padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#fff', border: '1px solid #e2e8f0' }}>
            <div style={{ padding: '12px', borderRadius: '10px', color: iconColor, fontSize: '22px', backgroundColor: `${iconColor}15` }}>
                <Icon />
            </div>
            <div>
                <div style={{ fontSize: '11px', color: '#718096', fontWeight: '700', textTransform: 'uppercase' }}>
                    {title}
                </div>
                <div className="statValue" style={{ fontSize: '20px', fontWeight: '800', color: '#1a202c' }}>
                    {value}
                </div>
            </div>
        </div>
    );
}