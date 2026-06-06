// ============================================
// Main Dashboard JavaScript
// ============================================

// Dashboard Controller
class DashboardController {
    constructor() {
        this.currentTimeRange = 'today';
        this.refreshInterval = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startAutoRefresh();
        this.animateNumbers();
        this.updateTimestamps();
    }

    setupEventListeners() {
        // Time range selector
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleTimeRangeChange(e);
            });
        });

        // Refresh button
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshDashboard();
            });
        }

        // Notification button
        document.querySelector('.notification-btn')?.addEventListener('click', () => {
            this.showNotifications();
        });

        // Sidebar navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.handleNavigation(e);
            });
        });

        // User profile dropdown
        document.querySelector('.user-profile')?.addEventListener('click', () => {
            this.toggleUserMenu();
        });

        // Sentiment filter
        document.querySelectorAll('.sentiment-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterFeedback(e);
            });
        });

        // Card expand buttons
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.querySelector('i').classList.contains('fa-expand') ? 'expand' : 'download';
                this.handleCardAction(action, e.currentTarget.closest('.chart-card, .gauge-card'));
            });
        });
    }

    handleTimeRangeChange(e) {
        // Update active state
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');
        
        // Update time range
        this.currentTimeRange = e.target.dataset.range;
        
        // Refresh data based on new time range
        this.refreshDashboard();
        
        // Show loading state
        this.showLoadingState();
        
        // Simulate data loading
        setTimeout(() => {
            this.hideLoadingState();
            this.updateCharts();
        }, 500);
    }

    handleNavigation(e) {
        e.preventDefault();
        
        // Update active state
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        e.currentTarget.classList.add('active');
        
        // Get the view name from data attribute
        const viewName = e.currentTarget.dataset.view;
        console.log(`Navigating to ${viewName}`);
        
        // Load the corresponding view
        if (window.viewManager) {
            window.viewManager.loadView(viewName);
            
            // Stop real-time updates for non-overview views
            if (viewName !== 'overview' && window.realtimeSimulator) {
                window.realtimeSimulator.stopSimulation();
            } else if (viewName === 'overview' && window.realtimeSimulator) {
                window.realtimeSimulator.startSimulation();
            }
        }
    }

    refreshDashboard() {
        // Add rotation animation to refresh button
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.querySelector('i').style.animation = 'spin 1s ease-in-out';
            setTimeout(() => {
                refreshBtn.querySelector('i').style.animation = '';
            }, 1000);
        }

        // Update all data
        this.updateKPIs();
        this.updateCharts();
        this.updateLists();
        this.updateFeed();
        
        // Show toast notification
        this.showToast('Dashboard refreshed', 'success');
    }

    updateKPIs() {
        // Simulate updating KPI values with animations
        const kpis = [
            { id: 'liveTickets', min: 15, max: 35 },
            { id: 'responseTime', min: 1.5, max: 3.5, decimals: 1 },
            { id: 'resolutionRate', min: 85, max: 95 },
            { id: 'csatScore', min: 4.3, max: 4.8, decimals: 1 }
        ];

        kpis.forEach(kpi => {
            const element = document.getElementById(kpi.id);
            if (element) {
                const numberElement = element.querySelector('.number');
                if (numberElement) {
                    const currentValue = parseFloat(numberElement.textContent);
                    const newValue = this.randomBetween(kpi.min, kpi.max, kpi.decimals);
                    this.animateValue(numberElement, currentValue, newValue, 1000, kpi.decimals);
                }
            }
        });
    }

    updateLists() {
        // Update top performers list
        const performers = [
            { name: 'Sarah Chen', tickets: Math.floor(Math.random() * 20) + 40, avatar: '4ADE80' },
            { name: 'Mike Johnson', tickets: Math.floor(Math.random() * 20) + 35, avatar: '4FC3F7' },
            { name: 'Lisa Wong', tickets: Math.floor(Math.random() * 20) + 30, avatar: 'AB47BC' },
            { name: 'David Kumar', tickets: Math.floor(Math.random() * 20) + 25, avatar: 'FFB74D' },
            { name: 'Emma Davis', tickets: Math.floor(Math.random() * 20) + 20, avatar: 'FF6B6B' }
        ];

        // Sort by tickets
        performers.sort((a, b) => b.tickets - a.tickets);

        const listContainer = document.getElementById('topPerformers');
        if (listContainer) {
            listContainer.innerHTML = performers.map((performer, index) => `
                <li class="list-item" style="animation: slideIn 0.3s ease ${index * 0.1}s both;">
                    <div class="list-left">
                        <img src="https://ui-avatars.com/api/?name=${performer.name.replace(' ', '+')}&background=${performer.avatar}&color=fff" alt="${performer.name}">
                        <span>${performer.name}</span>
                    </div>
                    <div class="list-right">
                        <span class="list-value">${performer.tickets}</span>
                        <span class="list-label">tickets</span>
                    </div>
                </li>
            `).join('');
        }
    }

    updateFeed() {
        // Add new feedback item with animation
        const feedContainer = document.querySelector('.feed-container');
        if (feedContainer && Math.random() > 0.7) {
            const newFeedback = this.generateFeedbackItem();
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = newFeedback;
            const newItem = tempDiv.firstElementChild;
            newItem.style.animation = 'slideIn 0.5s ease';
            feedContainer.insertBefore(newItem, feedContainer.firstChild);
            
            // Remove old items if too many
            while (feedContainer.children.length > 10) {
                feedContainer.removeChild(feedContainer.lastChild);
            }
        }
    }

    generateFeedbackItem() {
        const feedbacks = [
            { name: 'Alex Morgan', text: 'Quick response and professional service. Very satisfied!', rating: 5, sentiment: 'positive', avatar: '4ADE80' },
            { name: 'Jordan Lee', text: 'The issue was resolved but took longer than expected.', rating: 3, sentiment: 'neutral', avatar: 'FFB74D' },
            { name: 'Taylor Smith', text: 'Outstanding support! The agent went above and beyond.', rating: 5, sentiment: 'positive', avatar: '4FC3F7' },
            { name: 'Pat Johnson', text: 'Still waiting for a resolution. Not happy with the delay.', rating: 2, sentiment: 'negative', avatar: 'FF6B6B' }
        ];

        const feedback = feedbacks[Math.floor(Math.random() * feedbacks.length)];
        const stars = Array(5).fill(0).map((_, i) => 
            `<i class="${i < feedback.rating ? 'fas' : 'far'} fa-star"></i>`
        ).join('');

        return `
            <div class="feed-item">
                <img src="https://ui-avatars.com/api/?name=${feedback.name.replace(' ', '+')}&background=${feedback.avatar}&color=fff" alt="${feedback.name}">
                <div class="feed-content">
                    <div class="feed-header">
                        <span class="customer-name">${feedback.name}</span>
                        <span class="feed-time">just now</span>
                    </div>
                    <p class="feed-text">${feedback.text}</p>
                    <div class="feed-footer">
                        <span class="rating">${stars}</span>
                        <span class="sentiment ${feedback.sentiment}">${feedback.sentiment}</span>
                    </div>
                </div>
            </div>
        `;
    }

    filterFeedback(e) {
        // Update active state
        document.querySelectorAll('.sentiment-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');
        
        const filter = e.target.textContent.toLowerCase();
        const feedItems = document.querySelectorAll('.feed-item');
        
        feedItems.forEach(item => {
            if (filter === 'all') {
                item.style.display = 'flex';
            } else {
                const sentiment = item.querySelector('.sentiment')?.textContent.toLowerCase();
                item.style.display = sentiment === filter ? 'flex' : 'none';
            }
        });
    }

    handleCardAction(action, card) {
        if (action === 'expand') {
            // Toggle fullscreen for the card
            if (!card.classList.contains('fullscreen')) {
                card.classList.add('fullscreen');
                card.style.cssText = `
                    position: fixed;
                    top: 64px;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 1000;
                    margin: 0;
                    border-radius: 0;
                    animation: expandCard 0.3s ease;
                `;
                
                // Change icon to compress
                const btn = card.querySelector('.fa-expand').parentElement;
                btn.innerHTML = '<i class="fas fa-compress"></i>';
            } else {
                card.classList.remove('fullscreen');
                card.style.cssText = '';
                
                // Change icon back to expand
                const btn = card.querySelector('.fa-compress').parentElement;
                btn.innerHTML = '<i class="fas fa-expand"></i>';
            }
        } else if (action === 'download') {
            // Simulate download
            this.showToast('Downloading report...', 'info');
            setTimeout(() => {
                this.showToast('Report downloaded successfully', 'success');
            }, 2000);
        }
    }

    showNotifications() {
        // Simulate showing notifications panel
        this.showToast('3 new notifications', 'info');
        
        // Clear notification badge
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            badge.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                badge.style.display = 'none';
            }, 300);
        }
    }

    toggleUserMenu() {
        // Simulate user menu dropdown
        console.log('Toggling user menu');
    }

    animateNumbers() {
        // Animate KPI numbers on initial load
        document.querySelectorAll('.kpi-value .number').forEach(element => {
            const finalValue = parseFloat(element.textContent);
            const decimals = element.textContent.includes('.') ? 1 : 0;
            element.textContent = '0';
            setTimeout(() => {
                this.animateValue(element, 0, finalValue, 2000, decimals);
            }, Math.random() * 500);
        });
    }

    animateValue(element, start, end, duration, decimals = 0) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                element.textContent = decimals > 0 ? end.toFixed(decimals) : Math.floor(end);
                clearInterval(timer);
            } else {
                element.textContent = decimals > 0 ? current.toFixed(decimals) : Math.floor(current);
            }
        }, 16);
    }

    randomBetween(min, max, decimals = 0) {
        const value = Math.random() * (max - min) + min;
        return decimals > 0 ? parseFloat(value.toFixed(decimals)) : Math.floor(value);
    }

    updateTimestamps() {
        // Update relative timestamps
        setInterval(() => {
            document.querySelectorAll('.feed-time').forEach(element => {
                const text = element.textContent;
                if (text === 'just now') {
                    element.textContent = '1 min ago';
                } else if (text.includes('min ago')) {
                    const minutes = parseInt(text) + 1;
                    if (minutes < 60) {
                        element.textContent = `${minutes} min ago`;
                    } else {
                        element.textContent = '1 hour ago';
                    }
                }
            });
        }, 60000); // Update every minute
    }

    startAutoRefresh() {
        // Auto refresh dashboard every 30 seconds
        this.refreshInterval = setInterval(() => {
            this.refreshDashboard();
        }, 30000);
    }

    showLoadingState() {
        document.querySelectorAll('.kpi-card, .chart-card, .gauge-card, .list-card, .status-card').forEach(card => {
            card.classList.add('loading');
        });
    }

    hideLoadingState() {
        setTimeout(() => {
            document.querySelectorAll('.loading').forEach(card => {
                card.classList.remove('loading');
            });
        }, 500);
    }

    showToast(message, type = 'info') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            padding: 16px 24px;
            background: ${type === 'success' ? '#4ADE80' : type === 'error' ? '#FF6B6B' : '#4FC3F7'};
            color: white;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    updateCharts() {
        // This will be handled by charts.js
        if (window.ChartsManager) {
            window.ChartsManager.updateAllCharts();
        }
    }
}

// Utility functions
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function getTimeGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
}

// Add custom animations
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    @keyframes expandCard {
        from {
            transform: scale(0.9);
            opacity: 0.5;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new DashboardController();
});

// Handle visibility change to pause/resume animations
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations and refresh when tab is hidden
        if (window.dashboard && window.dashboard.refreshInterval) {
            clearInterval(window.dashboard.refreshInterval);
        }
    } else {
        // Resume when tab is visible
        if (window.dashboard) {
            window.dashboard.startAutoRefresh();
            window.dashboard.refreshDashboard();
        }
    }
});