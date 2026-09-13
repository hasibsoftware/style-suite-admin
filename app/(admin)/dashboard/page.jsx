import styles from '../dashboard.module.css';

export default function DashboardHome() {
    return (
        <div>
            {/* টপ কার্ডস */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}><div className={styles.statTitle}>Sells Today</div><div className={styles.statValue}>৳ 21,680</div></div>
                <div className={styles.statCard}><div className={styles.statTitle}>Orders Today</div><div className={styles.statValue}>16</div></div>
                <div className={styles.statCard}><div className={styles.statTitle}>Low Stock Items</div><div className={styles.statValue}>21</div></div>
                <div className={styles.statCard}><div className={styles.statTitle}>Pending Courier</div><div className={styles.statValue}>0</div></div>
                <div className={styles.statCard}><div className={styles.statTitle}>Pending Packing</div><div className={styles.statValue}>0</div></div>
                <div className={styles.statCard}><div className={styles.statTitle}>Today Return</div><div className={styles.statValue}>0</div></div>
            </div>

            {/* বেস্ট সেলিং শাড়ি ও লাইভ অ্যাক্টিভিটি */}
            <div className={styles.gridTwoCol}>
                <div className={styles.cardBox}>
                    <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>Best Selling Sarees</h3>
                        <a href="#" className={styles.viewAll}>View All</a>
                    </div>
                    <div className={styles.sareeGrid}>
                        {[1, 2, 3, 4, 5].map((item) => (
                            <div key={item} className={styles.sareeCard}>
                                <div className={styles.sareeImgPlaceholder}>Img</div>
                                <div className={styles.sareeName}>Jamdani Saree</div>
                                <div className={styles.sareeSold}>Sold: 45</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.cardBox}>
                    <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>Live Activity</h3>
                        <a href="#" className={styles.viewAll}>View All</a>
                    </div>
                    <table className={`${styles.table} ${styles.liveActivityTable}`}>
                        <thead>
                            <tr>
                                <th style={{ color: '#90273c', fontWeight: '700' }}>User Action</th>
                                <th style={{ color: '#2b6cb0', fontWeight: '700' }}>System Event</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>Order created by admin</td><td>Order synced successfully</td></tr>
                            <tr><td>Status updated to packed</td><td>Courier API notified</td></tr>
                            <tr><td>Payment verified manually</td><td>Database updated automatically</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Products Status ও Immediate Attention */}
            <div className={styles.gridTwoCol}>
                <div className={styles.cardBox}>
                    <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>Products Status</h3>
                        <a href="#" className={styles.viewAll}>Details</a>
                    </div>
                    <div className={styles.chartPlaceholder}>
                        <div className={styles.barChartItem} style={{ height: '60%' }}></div>
                        <div className={styles.barChartItem} style={{ height: '85%' }}></div>
                        <div className={styles.barChartItem} style={{ height: '40%' }}></div>
                        <div className={styles.barChartItem} style={{ height: '95%' }}></div>
                        <div className={styles.barChartItem} style={{ height: '70%' }}></div>
                        <div className={styles.barChartItem} style={{ height: '50%' }}></div>
                    </div>
                    <div className={styles.chartLegend}>
                        <span>Sat</span><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span>
                    </div>
                </div>

                <div className={styles.cardBox}>
                    <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>Immediate Attention</h3>
                        <span style={{ fontSize: '12px', color: '#e53e3e', fontWeight: '600' }}>2 Urgent</span>
                    </div>
                    <table className={styles.table}>
                        <thead><tr><th>Task / Issue</th><th>Type</th><th>Action</th></tr></thead>
                        <tbody>
                            <tr><td>Low stock alert</td><td>Inventory</td><td><a href="#" style={{ color: '#90273c' }}>Restock</a></td></tr>
                            <tr><td>Unassigned order</td><td>Shipping</td><td><a href="#" style={{ color: '#90273c' }}>Assign</a></td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Team Performance ও Top District */}
            <div className={styles.gridTwoCol}>
                <div className={styles.cardBox}>
                    <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>Team Performance</h3>
                        <a href="#" className={styles.viewAll}>View All</a>
                    </div>
                    <table className={styles.table}>
                        <thead><tr><th>Staff Name</th><th>Role</th><th>Orders Handled</th></tr></thead>
                        <tbody>
                            <tr><td>Sadia Sultana</td><td>Manager</td><td>42</td></tr>
                            <tr><td>Ullash Ahmed</td><td>Admin</td><td>38</td></tr>
                        </tbody>
                    </table>
                </div>

                <div className={styles.cardBox}>
                    <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>Top District Sales</h3>
                        <a href="#" className={styles.viewAll}>View All</a>
                    </div>
                    <table className={styles.table}>
                        <thead><tr><th>District Name</th><th>Orders</th><th>Sales (৳)</th></tr></thead>
                        <tbody>
                            <tr><td>Dhaka</td><td>85</td><td>৳ 1,45,000</td></tr>
                            <tr><td>Chattogram</td><td>34</td><td>৳ 68,500</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}