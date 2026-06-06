// ============================================
// Real-time Data Simulation and WebSocket Mock
// ============================================

class RealtimeDataSimulator {
    constructor() {
        this.isConnected = false;
        this.subscribers = new Map();
        this.intervals = new Map();
        this.metrics = {
            liveTickets: 23,
            responseTime: 2.4,
            resolutionRate: 89,
            csatScore: 4.6,
            agentsOnline: 12,
            agentsBusy: 3,
            agentsAway: 2,
            ticketsInQueue: 5
        };
        
        this.init();
    }

    init() {
        // Simulate WebSocket connection
        this.connect();
        
        // Start real-time updates
        this.startSimulation();
        
        // Add visual indicators for real-time updates
        this.addRealtimeIndicators();
    }

    connect() {
        // Simulate WebSocket connection establishment
        console.log('Establishing real-time connection...');
        
        setTimeout(() => {
            this.isConnected = true;
            console.log('Real-time connection established');
            this.showConnectionStatus(true);
        }, 1000);
    }

    disconnect() {
        this.isConnected = false;
        this.stopSimulation();
        this.showConnectionStatus(false);
    }

    showConnectionStatus(connected) {
        const statusDot = document.querySelector('.status-dot');
        const statusText = document.querySelector('.status-indicator span:last-child');
        
        if (statusDot && statusText) {
            if (connected) {
                statusDot.classList.add('online');
                statusDot.classList.remove('offline');
                statusText.textContent = 'System Online';
            } else {
                statusDot.classList.remove('online');
                statusDot.classList.add('offline');
                statusText.textContent = 'System Offline';
            }
        }
    }

    subscribe(metric, callback) {
        if (!this.subscribers.has(metric)) {
            this.subscribers.set(metric, []);
        }
        this.subscribers.get(metric).push(callback);
    }

    publish(metric, value) {
        const callbacks = this.subscribers.get(metric);
        if (callbacks) {
            callbacks.forEach(callback => callback(value));
        }
    }

    startSimulation() {
        // Simulate live tickets updates
        this.intervals.set('liveTickets', setInterval(() => {
            if (Math.random() > 0.7) {
                this.metrics.liveTickets += Math.random() > 0.5 ? 1 : -1;
                this.metrics.liveTickets = Math.max(0, this.metrics.liveTickets);
                this.updateLiveTickets(this.metrics.liveTickets);
            }
        }, 3000));

        // Simulate response time updates
        this.intervals.set('responseTime', setInterval(() => {
            if (Math.random() > 0.6) {
                const change = (Math.random() - 0.5) * 0.5;
                this.metrics.responseTime = Math.max(0.5, Math.min(5, this.metrics.responseTime + change));
                this.updateResponseTime(this.metrics.responseTime);
            }
        }, 5000));

        // Simulate resolution rate updates
        this.intervals.set('resolutionRate', setInterval(() => {
            if (Math.random() > 0.8) {
                const change = Math.floor((Math.random() - 0.5) * 5);
                this.metrics.resolutionRate = Math.max(75, Math.min(100, this.metrics.resolutionRate + change));
                this.updateResolutionRate(this.metrics.resolutionRate);
            }
        }, 10000));

        // Simulate CSAT score updates
        this.intervals.set('csatScore', setInterval(() => {
            if (Math.random() > 0.9) {
                const change = (Math.random() - 0.5) * 0.2;
                this.metrics.csatScore = Math.max(3.5, Math.min(5, this.metrics.csatScore + change));
                this.updateCSATScore(this.metrics.csatScore);
            }
        }, 15000));

        // Simulate agent status changes
        this.intervals.set('agentStatus', setInterval(() => {
            this.updateAgentStatuses();
        }, 8000));

        // Simulate new feedback arrivals
        this.intervals.set('feedback', setInterval(() => {
            if (Math.random() > 0.7) {
                this.addNewFeedback();
            }
        }, 20000));

        // Simulate ticket flow updates
        this.intervals.set('ticketFlow', setInterval(() => {
            this.updateTicketFlow();
        }, 4000));

        // Simulate performance alerts
        this.intervals.set('alerts', setInterval(() => {
            this.checkPerformanceAlerts();
        }, 30000));
    }

    stopSimulation() {
        this.intervals.forEach(interval => clearInterval(interval));
        this.intervals.clear();
    }

    updateLiveTickets(value) {
        const element = document.querySelector('#liveTickets .number');
        if (element) {
            const current = parseInt(element.textContent);
            this.animateNumber(element, current, value);
            
            // Flash the card for visual feedback
            const card = element.closest('.kpi-card');
            this.flashCard(card);
            
            // Update trend
            const trend = value > current ? 'up' : 'down';
            this.updateTrend(card, trend, Math.abs(value - current));
        }
    }

    updateResponseTime(value) {
        const element = document.querySelector('#responseTime .number');
        if (element) {
            const current = parseFloat(element.textContent);
            this.animateNumber(element, current, value, true);
            
            // Update SLA status
            const statusTag = element.closest('.kpi-card').querySelector('.status-tag');
            if (statusTag) {
                if (value <= 3) {
                    statusTag.textContent = 'Within SLA';
                    statusTag.className = 'status-tag success';
                } else {
                    statusTag.textContent = 'SLA Risk';
                    statusTag.className = 'status-tag warning';
                }
            }
        }
    }

    updateResolutionRate(value) {
        const element = document.querySelector('#resolutionRate .number');
        if (element) {
            const current = parseInt(element.textContent);
            this.animateNumber(element, current, value);
            
            // Update status based on value
            const statusTag = element.closest('.kpi-card').querySelector('.status-tag');
            if (statusTag) {
                if (value >= 90) {
                    statusTag.textContent = 'Excellent';
                    statusTag.className = 'status-tag excellent';
                } else if (value >= 80) {
                    statusTag.textContent = 'Above Target';
                    statusTag.className = 'status-tag success';
                } else {
                    statusTag.textContent = 'Below Target';
                    statusTag.className = 'status-tag warning';
                }
            }
        }
    }

    updateCSATScore(value) {
        const element = document.querySelector('#csatScore .number');
        if (element) {
            const current = parseFloat(element.textContent);
            this.animateNumber(element, current, value, true);
            
            // Add star animation if score improved
            if (value > current) {
                this.showStarAnimation(element.closest('.kpi-card'));
            }
        }
    }

    updateAgentStatuses() {
        const statuses = ['online', 'busy', 'away', 'offline'];
        const statusLabels = ['Online', 'Taking call', 'Away', 'Offline'];
        const agents = document.querySelectorAll('.agent-status');
        
        // Randomly change 1-2 agent statuses
        const numChanges = Math.floor(Math.random() * 2) + 1;
        const indices = [];
        while (indices.length < numChanges && indices.length < agents.length) {
            const idx = Math.floor(Math.random() * agents.length);
            if (!indices.includes(idx)) {
                indices.push(idx);
            }
        }
        
        indices.forEach(idx => {
            const agent = agents[idx];
            const statusLabel = agent.querySelector('.status-label');
            if (statusLabel) {
                const newStatusIdx = Math.floor(Math.random() * statuses.length);
                statusLabel.className = `status-label ${statuses[newStatusIdx]}`;
                statusLabel.textContent = statusLabels[newStatusIdx];
                
                // Add animation
                agent.style.animation = 'pulse 0.5s ease';
                setTimeout(() => {
                    agent.style.animation = '';
                }, 500);
            }
        });
        
        // Update team count
        const onlineCount = document.querySelectorAll('.status-label.online').length;
        const teamCount = document.querySelector('.team-count');
        if (teamCount) {
            teamCount.textContent = `${agents.length} agents (${onlineCount} online)`;
        }
    }

    addNewFeedback() {
        const feedbacks = [
            {
                name: 'Michael Chen',
                text: 'The support team was incredibly helpful and resolved my issue quickly!',
                rating: 5,
                sentiment: 'positive',
                avatar: '4ADE80'
            },
            {
                name: 'Jennifer Wilson',
                text: 'Good service but the wait time could be improved.',
                rating: 3,
                sentiment: 'neutral',
                avatar: 'FFB74D'
            },
            {
                name: 'Robert Taylor',
                text: 'Excellent experience! The agent was very knowledgeable.',
                rating: 5,
                sentiment: 'positive',
                avatar: '4FC3F7'
            },
            {
                name: 'Amanda Brown',
                text: 'Still waiting for my issue to be resolved. Not satisfied.',
                rating: 2,
                sentiment: 'negative',
                avatar: 'FF6B6B'
            },
            {
                name: 'Daniel Martinez',
                text: 'Quick response and professional service. Thank you!',
                rating: 4,
                sentiment: 'positive',
                avatar: 'AB47BC'
            }
        ];

        const feedback = feedbacks[Math.floor(Math.random() * feedbacks.length)];
        const feedContainer = document.querySelector('.feed-container');
        
        if (feedContainer) {
            const stars = Array(5).fill(0).map((_, i) => 
                `<i class="${i < feedback.rating ? 'fas' : 'far'} fa-star"></i>`
            ).join('');

            const feedItem = document.createElement('div');
            feedItem.className = 'feed-item';
            feedItem.style.animation = 'slideIn 0.5s ease';
            feedItem.innerHTML = `
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
            `;

            // Add notification effect
            this.showNotification(`New ${feedback.sentiment} feedback from ${feedback.name}`);
            
            feedContainer.insertBefore(feedItem, feedContainer.firstChild);
            
            // Remove old items if too many
            while (feedContainer.children.length > 8) {
                feedContainer.removeChild(feedContainer.lastChild);
            }
        }
    }

    updateTicketFlow() {
        // Simulate ticket flow changes in charts
        if (window.ChartsManager && window.ChartsManager.charts.tickets) {
            const chart = window.ChartsManager.charts.tickets;
            const lastIndex = chart.data.datasets[0].data.length - 1;
            
            // Update last data point with new value
            chart.data.datasets[0].data[lastIndex] = Math.floor(Math.random() * 20) + 20;
            chart.data.datasets[1].data[lastIndex] = Math.floor(Math.random() * 15) + 15;
            
            chart.update('none');
        }
    }

    checkPerformanceAlerts() {
        // Check for performance issues and show alerts
        if (this.metrics.responseTime > 4) {
            this.showAlert('High response time detected', 'warning');
        }
        
        if (this.metrics.resolutionRate < 80) {
            this.showAlert('Resolution rate below target', 'danger');
        }
        
        if (this.metrics.liveTickets > 30) {
            this.showAlert('High ticket volume', 'warning');
        }
    }

    animateNumber(element, from, to, isDecimal = false) {
        const duration = 500;
        const start = performance.now();
        
        const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = from + (to - from) * this.easeOutQuad(progress);
            element.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    easeOutQuad(t) {
        return t * (2 - t);
    }

    flashCard(card) {
        if (!card) return;
        
        card.style.transition = 'all 0.3s ease';
        card.style.transform = 'scale(1.02)';
        card.style.boxShadow = '0 0 20px rgba(79, 195, 247, 0.3)';
        
        setTimeout(() => {
            card.style.transform = '';
            card.style.boxShadow = '';
        }, 300);
    }

    updateTrend(card, direction, value) {
        const trendElement = card.querySelector('.kpi-trend');
        if (trendElement) {
            const icon = trendElement.querySelector('i');
            icon.className = `fas fa-arrow-${direction}`;
            trendElement.querySelector('span').textContent = `${value} ${direction === 'up' ? 'increase' : 'decrease'}`;
            
            if (direction === 'up' && card.id === 'liveTickets') {
                trendElement.classList.remove('positive');
            } else if (direction === 'down' && card.id === 'liveTickets') {
                trendElement.classList.add('positive');
            }
        }
    }

    showStarAnimation(card) {
        const star = document.createElement('i');
        star.className = 'fas fa-star';
        star.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            font-size: 30px;
            color: #FFB74D;
            animation: starBurst 1s ease;
            pointer-events: none;
        `;
        
        card.appendChild(star);
        
        setTimeout(() => {
            star.remove();
        }, 1000);
    }

    showNotification(message, type = 'info') {
        // Update notification badge
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            const count = parseInt(badge.textContent) + 1;
            badge.textContent = count;
            badge.style.display = 'flex';
            badge.style.animation = 'pulse 0.5s ease';
        }

        // Create floating notification
        const notification = document.createElement('div');
        notification.className = 'floating-notification';
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 24px;
            padding: 12px 20px;
            background: linear-gradient(135deg, #2A2A3E, #323248);
            color: white;
            border-radius: 8px;
            font-size: 13px;
            border-left: 3px solid ${type === 'info' ? '#4FC3F7' : '#4ADE80'};
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
    }

    showAlert(message, type) {
        const alertCard = document.querySelector(`.kpi-card .alert-badge`);
        if (alertCard) {
            alertCard.style.color = type === 'warning' ? '#FFB74D' : '#FF6B6B';
            alertCard.style.animation = 'pulse 1s ease infinite';
        }
        
        this.showNotification(message, type);
    }

    addRealtimeIndicators() {
        // Add pulsing indicators to show real-time updates
        const style = document.createElement('style');
        style.textContent = `
            @keyframes starBurst {
                0% {
                    transform: translate(-50%, -50%) scale(0) rotate(0deg);
                    opacity: 1;
                }
                50% {
                    transform: translate(-50%, -50%) scale(1.5) rotate(180deg);
                    opacity: 0.8;
                }
                100% {
                    transform: translate(-50%, -50%) scale(0) rotate(360deg);
                    opacity: 0;
                }
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            .realtime-indicator {
                display: inline-block;
                width: 6px;
                height: 6px;
                background: #4ADE80;
                border-radius: 50%;
                margin-left: 8px;
                animation: pulse 2s infinite;
            }
        `;
        document.head.appendChild(style);

        // Add indicators to cards
        document.querySelectorAll('.kpi-header h3, .card-header h3').forEach(header => {
            if (!header.querySelector('.realtime-indicator')) {
                const indicator = document.createElement('span');
                indicator.className = 'realtime-indicator';
                header.appendChild(indicator);
            }
        });
    }
}

// Initialize Real-time Simulator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.realtimeSimulator = new RealtimeDataSimulator();
    
    // Simulate connection loss and recovery
    window.addEventListener('online', () => {
        window.realtimeSimulator.connect();
    });
    
    window.addEventListener('offline', () => {
        window.realtimeSimulator.disconnect();
    });
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (window.realtimeSimulator) {
        window.realtimeSimulator.stopSimulation();
    }
});