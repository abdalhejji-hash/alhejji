// ============================================
// View Management for Different Dashboard Pages
// ============================================

class ViewManager {
    constructor() {
        this.currentView = 'overview';
        this.viewContent = {
            overview: this.getOverviewContent(),
            analytics: this.getAnalyticsContent(),
            team: this.getTeamContent(),
            settings: this.getSettingsContent()
        };
    }

    loadView(viewName) {
        const mainContent = document.getElementById('mainContent');
        if (!mainContent) return;

        // Store current view
        this.currentView = viewName;

        // Add fade transition
        mainContent.style.opacity = '0';
        
        setTimeout(() => {
            mainContent.innerHTML = this.viewContent[viewName] || this.viewContent.overview;
            mainContent.style.opacity = '1';
            
            // Re-initialize components based on view
            this.initializeViewComponents(viewName);
        }, 300);
    }

    initializeViewComponents(viewName) {
        switch(viewName) {
            case 'overview':
                // Re-initialize charts for overview
                if (window.ChartsManager) {
                    window.ChartsManager.destroy();
                    window.ChartsManager = new ChartsManager();
                }
                // Re-initialize dashboard controller
                if (window.dashboard) {
                    window.dashboard.init();
                }
                break;
                
            case 'analytics':
                // Initialize analytics-specific charts
                this.initAnalyticsCharts();
                break;
                
            case 'team':
                // Initialize team view components
                this.initTeamComponents();
                break;
                
            case 'settings':
                // Initialize settings handlers
                this.initSettingsHandlers();
                break;
        }
    }

    getOverviewContent() {
        return `
        <!-- KPI Cards Row -->
        <div class="dashboard-row kpi-row">
            <div class="kpi-card">
                <div class="kpi-header">
                    <h3>Live Tickets</h3>
                    <span class="alert-badge">
                        <i class="fas fa-circle"></i>
                    </span>
                </div>
                <div class="kpi-value" id="liveTickets">
                    <span class="number">23</span>
                </div>
                <div class="kpi-status">
                    <span class="status-tag open">Open</span>
                    <span class="status-tag unassigned">Unassigned</span>
                </div>
                <div class="kpi-trend">
                    <i class="fas fa-arrow-up"></i>
                    <span>12% vs yesterday</span>
                </div>
            </div>

            <div class="kpi-card">
                <div class="kpi-header">
                    <h3>Response Time</h3>
                </div>
                <div class="kpi-value" id="responseTime">
                    <span class="number">2.4</span>
                    <span class="unit">min</span>
                </div>
                <div class="kpi-status">
                    <span class="status-tag success">Within SLA</span>
                </div>
                <div class="kpi-trend positive">
                    <i class="fas fa-arrow-down"></i>
                    <span>8% improvement</span>
                </div>
            </div>

            <div class="kpi-card">
                <div class="kpi-header">
                    <h3>Resolution Rate</h3>
                </div>
                <div class="kpi-value" id="resolutionRate">
                    <span class="number">89</span>
                    <span class="unit">%</span>
                </div>
                <div class="kpi-status">
                    <span class="status-tag success">Above Target</span>
                </div>
                <div class="kpi-trend positive">
                    <i class="fas fa-arrow-up"></i>
                    <span>5% vs last week</span>
                </div>
            </div>

            <div class="kpi-card">
                <div class="kpi-header">
                    <h3>CSAT Score</h3>
                </div>
                <div class="kpi-value" id="csatScore">
                    <span class="number">4.6</span>
                    <span class="unit">/5</span>
                </div>
                <div class="kpi-status">
                    <span class="status-tag excellent">Excellent</span>
                </div>
                <div class="kpi-trend positive">
                    <i class="fas fa-arrow-up"></i>
                    <span>0.2 pts increase</span>
                </div>
            </div>
        </div>

        <!-- Charts Row 1 -->
        <div class="dashboard-row">
            <div class="chart-card wide">
                <div class="card-header">
                    <h3>New Tickets vs Closed</h3>
                    <div class="card-controls">
                        <button class="control-btn">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="control-btn">
                            <i class="fas fa-expand"></i>
                        </button>
                    </div>
                </div>
                <div class="chart-container" style="height: 300px;">
                    <canvas id="ticketsChart"></canvas>
                </div>
            </div>

            <div class="gauge-card">
                <div class="card-header">
                    <h3>SLA Compliance</h3>
                </div>
                <div class="gauge-container">
                    <canvas id="slaGauge"></canvas>
                    <div class="gauge-center">
                        <span class="gauge-value">84%</span>
                        <span class="gauge-label">Today</span>
                    </div>
                </div>
                <div class="gauge-footer">
                    <span class="comparison">vs yesterday: +2%</span>
                </div>
            </div>
        </div>

        <!-- Charts Row 2 -->
        <div class="dashboard-row">
            <div class="chart-card">
                <div class="card-header">
                    <h3>Performance Metrics</h3>
                </div>
                <div class="chart-container" style="height: 250px;">
                    <canvas id="performanceChart"></canvas>
                </div>
            </div>

            <div class="list-card">
                <div class="card-header">
                    <h3>Top Performers</h3>
                    <span class="live-indicator">
                        <span class="pulse"></span>
                        Live
                    </span>
                </div>
                <ul class="top-list" id="topPerformers">
                    <li class="list-item">
                        <div class="list-left">
                            <img src="https://ui-avatars.com/api/?name=Sarah+Chen&background=4ADE80&color=fff" alt="Sarah">
                            <span>Sarah Chen</span>
                        </div>
                        <div class="list-right">
                            <span class="list-value">47</span>
                            <span class="list-label">tickets</span>
                        </div>
                    </li>
                </ul>
            </div>

            <div class="status-card">
                <div class="card-header">
                    <h3>Agent Status</h3>
                    <span class="team-count">15 agents</span>
                </div>
                <div class="status-grid">
                    <div class="agent-status">
                        <img src="https://ui-avatars.com/api/?name=Alex+Turner&background=4ADE80&color=fff" alt="Alex">
                        <span class="agent-name">Alex Turner</span>
                        <span class="status-label online">Online</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bottom Row -->
        <div class="dashboard-row">
            <div class="feed-card">
                <div class="card-header">
                    <h3>Customer Feedback</h3>
                    <div class="sentiment-filter">
                        <button class="sentiment-btn active">All</button>
                        <button class="sentiment-btn positive">Positive</button>
                        <button class="sentiment-btn negative">Negative</button>
                    </div>
                </div>
                <div class="feed-container">
                    <div class="feed-item">
                        <img src="https://ui-avatars.com/api/?name=Customer&background=4ADE80&color=fff" alt="Customer">
                        <div class="feed-content">
                            <div class="feed-header">
                                <span class="customer-name">Rachel Green</span>
                                <span class="feed-time">2 min ago</span>
                            </div>
                            <p class="feed-text">Excellent support! The team resolved my issue within minutes.</p>
                            <div class="feed-footer">
                                <span class="rating">
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                </span>
                                <span class="sentiment positive">Positive</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="chart-card">
                <div class="card-header">
                    <h3>Ticket Categories</h3>
                </div>
                <div class="chart-container" style="height: 300px;">
                    <canvas id="categoriesChart"></canvas>
                </div>
            </div>
        </div>
        `;
    }

    getAnalyticsContent() {
        return `
        <!-- Analytics View -->
        <div class="view-header">
            <h1 class="view-title">Analytics Dashboard</h1>
            <p class="view-description">Detailed performance analytics and trends</p>
        </div>

        <!-- Analytics KPIs -->
        <div class="dashboard-row kpi-row">
            <div class="kpi-card">
                <div class="kpi-header">
                    <h3>Avg Handle Time</h3>
                </div>
                <div class="kpi-value">
                    <span class="number">8.3</span>
                    <span class="unit">min</span>
                </div>
                <div class="kpi-trend positive">
                    <i class="fas fa-arrow-down"></i>
                    <span>15% faster</span>
                </div>
            </div>

            <div class="kpi-card">
                <div class="kpi-header">
                    <h3>First Call Resolution</h3>
                </div>
                <div class="kpi-value">
                    <span class="number">72</span>
                    <span class="unit">%</span>
                </div>
                <div class="kpi-trend positive">
                    <i class="fas fa-arrow-up"></i>
                    <span>3% improvement</span>
                </div>
            </div>

            <div class="kpi-card">
                <div class="kpi-header">
                    <h3>Ticket Volume</h3>
                </div>
                <div class="kpi-value">
                    <span class="number">1.2K</span>
                </div>
                <div class="kpi-trend">
                    <i class="fas fa-arrow-up"></i>
                    <span>8% increase</span>
                </div>
            </div>

            <div class="kpi-card">
                <div class="kpi-header">
                    <h3>Avg Wait Time</h3>
                </div>
                <div class="kpi-value">
                    <span class="number">45</span>
                    <span class="unit">sec</span>
                </div>
                <div class="kpi-trend positive">
                    <i class="fas fa-arrow-down"></i>
                    <span>20% reduced</span>
                </div>
            </div>
        </div>

        <!-- Trend Analysis Charts -->
        <div class="dashboard-row">
            <div class="chart-card wide">
                <div class="card-header">
                    <h3>30-Day Performance Trend</h3>
                    <div class="card-controls">
                        <button class="control-btn">
                            <i class="fas fa-download"></i>
                        </button>
                    </div>
                </div>
                <div class="chart-container" style="height: 350px;">
                    <canvas id="trendChart"></canvas>
                </div>
            </div>
        </div>

        <!-- Distribution Charts -->
        <div class="dashboard-row">
            <div class="chart-card">
                <div class="card-header">
                    <h3>Channel Distribution</h3>
                </div>
                <div class="chart-container" style="height: 300px;">
                    <canvas id="channelChart"></canvas>
                </div>
            </div>

            <div class="chart-card">
                <div class="card-header">
                    <h3>Response Time Heatmap</h3>
                </div>
                <div class="heatmap-container">
                    <div class="heatmap-grid">
                        ${this.generateHeatmapGrid()}
                    </div>
                </div>
            </div>

            <div class="chart-card">
                <div class="card-header">
                    <h3>Customer Satisfaction Trend</h3>
                </div>
                <div class="chart-container" style="height: 300px;">
                    <canvas id="satisfactionChart"></canvas>
                </div>
            </div>
        </div>

        <!-- Comparison Table -->
        <div class="dashboard-row">
            <div class="chart-card wide">
                <div class="card-header">
                    <h3>Department Comparison</h3>
                </div>
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Department</th>
                                <th>Tickets</th>
                                <th>Avg Response</th>
                                <th>Resolution Rate</th>
                                <th>CSAT</th>
                                <th>Trend</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Technical Support</td>
                                <td>456</td>
                                <td>2.3 min</td>
                                <td>92%</td>
                                <td>4.7</td>
                                <td><span class="trend-up">↑ 5%</span></td>
                            </tr>
                            <tr>
                                <td>Customer Service</td>
                                <td>389</td>
                                <td>1.8 min</td>
                                <td>88%</td>
                                <td>4.5</td>
                                <td><span class="trend-up">↑ 3%</span></td>
                            </tr>
                            <tr>
                                <td>Billing</td>
                                <td>234</td>
                                <td>3.1 min</td>
                                <td>85%</td>
                                <td>4.3</td>
                                <td><span class="trend-down">↓ 2%</span></td>
                            </tr>
                            <tr>
                                <td>Sales</td>
                                <td>167</td>
                                <td>1.5 min</td>
                                <td>94%</td>
                                <td>4.8</td>
                                <td><span class="trend-up">↑ 8%</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        `;
    }

    getTeamContent() {
        return `
        <!-- Team View -->
        <div class="view-header">
            <h1 class="view-title">Team Performance</h1>
            <p class="view-description">Monitor and manage team productivity</p>
        </div>

        <!-- Team Overview Cards -->
        <div class="dashboard-row kpi-row">
            <div class="kpi-card">
                <div class="kpi-header">
                    <h3>Total Agents</h3>
                </div>
                <div class="kpi-value">
                    <span class="number">24</span>
                </div>
                <div class="kpi-status">
                    <span class="status-tag success">15 Online</span>
                    <span class="status-tag warning">5 Away</span>
                </div>
            </div>

            <div class="kpi-card">
                <div class="kpi-header">
                    <h3>Avg Productivity</h3>
                </div>
                <div class="kpi-value">
                    <span class="number">87</span>
                    <span class="unit">%</span>
                </div>
                <div class="kpi-trend positive">
                    <i class="fas fa-arrow-up"></i>
                    <span>12% increase</span>
                </div>
            </div>

            <div class="kpi-card">
                <div class="kpi-header">
                    <h3>Team CSAT</h3>
                </div>
                <div class="kpi-value">
                    <span class="number">4.5</span>
                    <span class="unit">/5</span>
                </div>
                <div class="kpi-status">
                    <span class="status-tag excellent">Excellent</span>
                </div>
            </div>

            <div class="kpi-card">
                <div class="kpi-header">
                    <h3>Tickets/Agent</h3>
                </div>
                <div class="kpi-value">
                    <span class="number">18.5</span>
                </div>
                <div class="kpi-trend">
                    <i class="fas fa-equals"></i>
                    <span>On target</span>
                </div>
            </div>
        </div>

        <!-- Team Members Grid -->
        <div class="dashboard-row">
            <div class="chart-card wide">
                <div class="card-header">
                    <h3>Agent Performance Matrix</h3>
                    <div class="view-toggle">
                        <button class="toggle-btn active">Grid</button>
                        <button class="toggle-btn">List</button>
                    </div>
                </div>
                <div class="team-grid">
                    ${this.generateTeamMembers()}
                </div>
            </div>
        </div>

        <!-- Performance Charts -->
        <div class="dashboard-row">
            <div class="chart-card">
                <div class="card-header">
                    <h3>Individual Performance</h3>
                </div>
                <div class="chart-container" style="height: 300px;">
                    <canvas id="individualChart"></canvas>
                </div>
            </div>

            <div class="chart-card">
                <div class="card-header">
                    <h3>Skill Distribution</h3>
                </div>
                <div class="skill-matrix">
                    <div class="skill-item">
                        <span class="skill-name">Technical</span>
                        <div class="skill-bar">
                            <div class="skill-progress" style="width: 85%"></div>
                        </div>
                        <span class="skill-value">85%</span>
                    </div>
                    <div class="skill-item">
                        <span class="skill-name">Communication</span>
                        <div class="skill-bar">
                            <div class="skill-progress" style="width: 92%"></div>
                        </div>
                        <span class="skill-value">92%</span>
                    </div>
                    <div class="skill-item">
                        <span class="skill-name">Problem Solving</span>
                        <div class="skill-bar">
                            <div class="skill-progress" style="width: 78%"></div>
                        </div>
                        <span class="skill-value">78%</span>
                    </div>
                    <div class="skill-item">
                        <span class="skill-name">Product Knowledge</span>
                        <div class="skill-bar">
                            <div class="skill-progress" style="width: 88%"></div>
                        </div>
                        <span class="skill-value">88%</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Leaderboard -->
        <div class="dashboard-row">
            <div class="chart-card">
                <div class="card-header">
                    <h3>Weekly Leaderboard</h3>
                    <span class="badge">Week 48</span>
                </div>
                <div class="leaderboard">
                    ${this.generateLeaderboard()}
                </div>
            </div>

            <div class="chart-card">
                <div class="card-header">
                    <h3>Training & Certifications</h3>
                </div>
                <div class="training-list">
                    <div class="training-item">
                        <div class="training-info">
                            <i class="fas fa-certificate"></i>
                            <div>
                                <span class="training-name">Customer Excellence</span>
                                <span class="training-date">18 agents certified</span>
                            </div>
                        </div>
                        <span class="training-status completed">75%</span>
                    </div>
                    <div class="training-item">
                        <div class="training-info">
                            <i class="fas fa-graduation-cap"></i>
                            <div>
                                <span class="training-name">Product Training v2.0</span>
                                <span class="training-date">12 agents certified</span>
                            </div>
                        </div>
                        <span class="training-status in-progress">50%</span>
                    </div>
                    <div class="training-item">
                        <div class="training-info">
                            <i class="fas fa-award"></i>
                            <div>
                                <span class="training-name">Advanced Support Skills</span>
                                <span class="training-date">8 agents certified</span>
                            </div>
                        </div>
                        <span class="training-status">33%</span>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    getSettingsContent() {
        return `
        <!-- Settings View -->
        <div class="view-header">
            <h1 class="view-title">Dashboard Settings</h1>
            <p class="view-description">Customize your dashboard experience</p>
        </div>

        <div class="dashboard-row">
            <div class="settings-card">
                <div class="card-header">
                    <h3>General Settings</h3>
                </div>
                <div class="settings-content">
                    <div class="setting-item">
                        <div class="setting-info">
                            <label>Auto Refresh</label>
                            <span class="setting-description">Automatically refresh dashboard data</span>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" checked>
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="setting-item">
                        <div class="setting-info">
                            <label>Refresh Interval</label>
                            <span class="setting-description">How often to refresh data</span>
                        </div>
                        <select class="setting-select">
                            <option>15 seconds</option>
                            <option selected>30 seconds</option>
                            <option>1 minute</option>
                            <option>5 minutes</option>
                        </select>
                    </div>
                    <div class="setting-item">
                        <div class="setting-info">
                            <label>Sound Notifications</label>
                            <span class="setting-description">Play sound for alerts</span>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox">
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="setting-item">
                        <div class="setting-info">
                            <label>Time Zone</label>
                            <span class="setting-description">Display times in selected timezone</span>
                        </div>
                        <select class="setting-select">
                            <option>UTC</option>
                            <option selected>EST (UTC-5)</option>
                            <option>PST (UTC-8)</option>
                            <option>CST (UTC-6)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="settings-card">
                <div class="card-header">
                    <h3>Display Preferences</h3>
                </div>
                <div class="settings-content">
                    <div class="setting-item">
                        <div class="setting-info">
                            <label>Theme</label>
                            <span class="setting-description">Choose your preferred theme</span>
                        </div>
                        <select class="setting-select">
                            <option selected>Dark Mode</option>
                            <option>Light Mode</option>
                            <option>Auto (System)</option>
                        </select>
                    </div>
                    <div class="setting-item">
                        <div class="setting-info">
                            <label>Compact View</label>
                            <span class="setting-description">Show more data in less space</span>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox">
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="setting-item">
                        <div class="setting-info">
                            <label>Show Animations</label>
                            <span class="setting-description">Enable chart and transition animations</span>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" checked>
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="setting-item">
                        <div class="setting-info">
                            <label>Data Labels</label>
                            <span class="setting-description">Show values on charts</span>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" checked>
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>

        <div class="dashboard-row">
            <div class="settings-card">
                <div class="card-header">
                    <h3>Alert Settings</h3>
                </div>
                <div class="settings-content">
                    <div class="setting-item">
                        <div class="setting-info">
                            <label>High Priority Alerts</label>
                            <span class="setting-description">Tickets exceeding SLA</span>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" checked>
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="setting-item">
                        <div class="setting-info">
                            <label>Performance Alerts</label>
                            <span class="setting-description">Below target metrics</span>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" checked>
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="setting-item">
                        <div class="setting-info">
                            <label>Team Alerts</label>
                            <span class="setting-description">Agent status changes</span>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox">
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
            </div>

            <div class="settings-card">
                <div class="card-header">
                    <h3>Data Export</h3>
                </div>
                <div class="settings-content">
                    <div class="export-options">
                        <button class="export-btn">
                            <i class="fas fa-file-csv"></i>
                            Export to CSV
                        </button>
                        <button class="export-btn">
                            <i class="fas fa-file-pdf"></i>
                            Export to PDF
                        </button>
                        <button class="export-btn">
                            <i class="fas fa-file-excel"></i>
                            Export to Excel
                        </button>
                    </div>
                    <div class="export-info">
                        <p>Last export: December 15, 2024 at 3:45 PM</p>
                        <p>Export includes data from selected time range</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="dashboard-row">
            <div class="settings-card wide">
                <div class="card-header">
                    <h3>Dashboard Version</h3>
                </div>
                <div class="settings-content">
                    <div class="version-info">
                        <div class="version-item">
                            <span class="version-label">Version</span>
                            <span class="version-value">1.0.0</span>
                        </div>
                        <div class="version-item">
                            <span class="version-label">Last Updated</span>
                            <span class="version-value">December 2024</span>
                        </div>
                        <div class="version-item">
                            <span class="version-label">Environment</span>
                            <span class="version-value">Production</span>
                        </div>
                        <button class="btn-primary">Check for Updates</button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    generateHeatmapGrid() {
        const hours = ['12AM', '6AM', '12PM', '6PM'];
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        let html = '<div class="heatmap-labels-y">';
        
        hours.forEach(hour => {
            html += `<span>${hour}</span>`;
        });
        html += '</div><div class="heatmap-cells">';
        
        for (let d = 0; d < days.length; d++) {
            for (let h = 0; h < 4; h++) {
                const intensity = Math.random();
                const color = intensity > 0.7 ? 'high' : intensity > 0.4 ? 'medium' : 'low';
                html += `<div class="heatmap-cell ${color}" title="${days[d]} ${hours[h]}"></div>`;
            }
        }
        
        html += '</div><div class="heatmap-labels-x">';
        days.forEach(day => {
            html += `<span>${day}</span>`;
        });
        html += '</div>';
        
        return html;
    }

    generateTeamMembers() {
        const members = [
            { name: 'Sarah Chen', status: 'online', tickets: 47, csat: 4.8 },
            { name: 'Mike Johnson', status: 'busy', tickets: 42, csat: 4.6 },
            { name: 'Lisa Wong', status: 'online', tickets: 39, csat: 4.7 },
            { name: 'David Kumar', status: 'away', tickets: 35, csat: 4.5 },
            { name: 'Emma Davis', status: 'online', tickets: 31, csat: 4.9 },
            { name: 'Alex Turner', status: 'offline', tickets: 28, csat: 4.4 },
            { name: 'Nina Patel', status: 'online', tickets: 33, csat: 4.7 },
            { name: 'Tom Wilson', status: 'busy', tickets: 29, csat: 4.6 }
        ];

        return members.map(member => `
            <div class="team-member-card">
                <div class="member-header">
                    <img src="https://ui-avatars.com/api/?name=${member.name.replace(' ', '+')}&background=4FC3F7&color=fff" alt="${member.name}">
                    <span class="member-status ${member.status}"></span>
                </div>
                <div class="member-info">
                    <h4>${member.name}</h4>
                    <span class="member-role">Support Agent</span>
                </div>
                <div class="member-stats">
                    <div class="stat">
                        <span class="stat-value">${member.tickets}</span>
                        <span class="stat-label">Tickets</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${member.csat}</span>
                        <span class="stat-label">CSAT</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    generateLeaderboard() {
        const leaders = [
            { name: 'Sarah Chen', score: 947, change: '+12' },
            { name: 'Mike Johnson', score: 892, change: '+8' },
            { name: 'Lisa Wong', score: 856, change: '-3' },
            { name: 'David Kumar', score: 823, change: '+5' },
            { name: 'Emma Davis', score: 798, change: '+15' }
        ];

        return leaders.map((leader, index) => `
            <div class="leaderboard-item">
                <span class="rank">#${index + 1}</span>
                <img src="https://ui-avatars.com/api/?name=${leader.name.replace(' ', '+')}&background=${index === 0 ? 'FFD700' : index === 1 ? 'C0C0C0' : index === 2 ? 'CD7F32' : '4FC3F7'}&color=fff" alt="${leader.name}">
                <div class="leader-info">
                    <span class="leader-name">${leader.name}</span>
                    <span class="leader-score">${leader.score} pts</span>
                </div>
                <span class="leader-change ${leader.change.startsWith('+') ? 'positive' : 'negative'}">${leader.change}</span>
            </div>
        `).join('');
    }

    initAnalyticsCharts() {
        // Initialize trend chart
        const trendCtx = document.getElementById('trendChart');
        if (trendCtx) {
            new Chart(trendCtx, {
                type: 'line',
                data: {
                    labels: Array.from({length: 30}, (_, i) => `Day ${i + 1}`),
                    datasets: [{
                        label: 'Response Time',
                        data: Array.from({length: 30}, () => Math.random() * 3 + 1),
                        borderColor: '#4FC3F7',
                        tension: 0.3
                    }, {
                        label: 'Resolution Rate',
                        data: Array.from({length: 30}, () => Math.random() * 20 + 80),
                        borderColor: '#4ADE80',
                        tension: 0.3,
                        yAxisID: 'y1'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            type: 'linear',
                            position: 'left',
                            title: { display: true, text: 'Response Time (min)' }
                        },
                        y1: {
                            type: 'linear',
                            position: 'right',
                            title: { display: true, text: 'Resolution Rate (%)' },
                            grid: { drawOnChartArea: false }
                        }
                    }
                }
            });
        }

        // Initialize channel chart
        const channelCtx = document.getElementById('channelChart');
        if (channelCtx) {
            new Chart(channelCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Phone', 'Email', 'Chat', 'Social'],
                    datasets: [{
                        data: [35, 30, 25, 10],
                        backgroundColor: ['#4FC3F7', '#4ADE80', '#FFB74D', '#AB47BC']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }

        // Initialize satisfaction chart
        const satisfactionCtx = document.getElementById('satisfactionChart');
        if (satisfactionCtx) {
            new Chart(satisfactionCtx, {
                type: 'bar',
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    datasets: [{
                        label: 'CSAT Score',
                        data: [4.3, 4.5, 4.4, 4.6],
                        backgroundColor: '#4ADE80'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: false,
                            min: 3.5,
                            max: 5
                        }
                    }
                }
            });
        }
    }

    initTeamComponents() {
        // Initialize individual performance chart
        const individualCtx = document.getElementById('individualChart');
        if (individualCtx) {
            new Chart(individualCtx, {
                type: 'radar',
                data: {
                    labels: ['Tickets', 'Response', 'Resolution', 'CSAT', 'Efficiency'],
                    datasets: [{
                        label: 'Team Average',
                        data: [65, 75, 80, 85, 70],
                        backgroundColor: 'rgba(79, 195, 247, 0.2)',
                        borderColor: '#4FC3F7',
                        pointBackgroundColor: '#4FC3F7'
                    }, {
                        label: 'Top Performer',
                        data: [90, 88, 92, 95, 85],
                        backgroundColor: 'rgba(74, 222, 128, 0.2)',
                        borderColor: '#4ADE80',
                        pointBackgroundColor: '#4ADE80'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });
        }
    }

    initSettingsHandlers() {
        // Initialize toggle switches
        document.querySelectorAll('.toggle-switch input').forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                console.log(`Setting changed: ${e.target.checked}`);
                // Save setting to localStorage
                const settingName = e.target.closest('.setting-item').querySelector('label').textContent;
                localStorage.setItem(settingName, e.target.checked);
            });
        });

        // Initialize select dropdowns
        document.querySelectorAll('.setting-select').forEach(select => {
            select.addEventListener('change', (e) => {
                console.log(`Setting changed: ${e.target.value}`);
                // Save setting to localStorage
                const settingName = e.target.closest('.setting-item').querySelector('label').textContent;
                localStorage.setItem(settingName, e.target.value);
            });
        });

        // Initialize export buttons
        document.querySelectorAll('.export-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const format = btn.textContent.trim();
                this.showExportNotification(format);
            });
        });
    }

    showExportNotification(format) {
        if (window.dashboard) {
            window.dashboard.showToast(`Exporting data to ${format}...`, 'info');
            setTimeout(() => {
                window.dashboard.showToast(`${format} export completed!`, 'success');
            }, 2000);
        }
    }
}

// Initialize View Manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.viewManager = new ViewManager();
});