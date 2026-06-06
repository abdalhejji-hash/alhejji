// ============================================
// Chart.js Configurations and Management
// ============================================

class ChartsManager {
    constructor() {
        this.charts = {};
        this.colors = {
            primary: '#4FC3F7',
            secondary: '#29B6F6',
            success: '#4ADE80',
            warning: '#FFB74D',
            danger: '#FF6B6B',
            purple: '#AB47BC',
            gray: '#5A5A6E',
            lightGray: '#9E9EB0'
        };
        
        // Set default Chart.js options
        this.setDefaults();
        
        // Initialize all charts
        this.initCharts();
    }

    setDefaults() {
        // Set global Chart.js defaults
        Chart.defaults.color = '#B4B4C8';
        Chart.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
        Chart.defaults.font.size = 12;
        Chart.defaults.plugins.legend.display = true;
        Chart.defaults.plugins.legend.position = 'bottom';
        Chart.defaults.plugins.legend.labels.usePointStyle = true;
        Chart.defaults.plugins.legend.labels.padding = 15;
        Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(42, 42, 62, 0.95)';
        Chart.defaults.plugins.tooltip.padding = 12;
        Chart.defaults.plugins.tooltip.cornerRadius = 8;
        Chart.defaults.plugins.tooltip.titleFont.size = 13;
        Chart.defaults.plugins.tooltip.bodyFont.size = 12;
        Chart.defaults.scale.grid.color = 'rgba(255, 255, 255, 0.05)';
        Chart.defaults.scale.grid.drawBorder = false;
    }

    initCharts() {
        this.initTicketsChart();
        this.initSLAGauge();
        this.initPerformanceChart();
        this.initCategoriesChart();
    }

    initTicketsChart() {
        const ctx = document.getElementById('ticketsChart');
        if (!ctx) return;

        // Generate time labels for the day
        const labels = [];
        for (let i = 0; i <= 24; i += 2) {
            labels.push(`${i}:00`);
        }

        // Generate sample data
        const newTicketsData = this.generateTimeSeriesData(13, 20, 40);
        const closedTicketsData = this.generateTimeSeriesData(13, 15, 35);

        this.charts.tickets = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'New Tickets',
                    data: newTicketsData,
                    borderColor: this.colors.primary,
                    backgroundColor: `${this.colors.primary}20`,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: this.colors.primary,
                    pointBorderColor: '#2A2A3E',
                    pointBorderWidth: 2
                }, {
                    label: 'Closed Tickets',
                    data: closedTicketsData,
                    borderColor: this.colors.warning,
                    backgroundColor: `${this.colors.warning}20`,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: this.colors.warning,
                    pointBorderColor: '#2A2A3E',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 13
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y + ' tickets';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: true,
                            color: 'rgba(255, 255, 255, 0.03)'
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: true,
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        ticks: {
                            font: {
                                size: 11
                            },
                            callback: function(value) {
                                return value + ' ';
                            }
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    initSLAGauge() {
        const ctx = document.getElementById('slaGauge');
        if (!ctx) return;

        const value = 84;
        const remaining = 100 - value;

        this.charts.slaGauge = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Achieved', 'Remaining'],
                datasets: [{
                    data: [value, remaining],
                    backgroundColor: [
                        this.colors.success,
                        'rgba(90, 90, 110, 0.2)'
                    ],
                    borderWidth: 0,
                    cutout: '75%',
                    rotation: -90,
                    circumference: 360
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
                },
                animation: {
                    animateRotate: true,
                    duration: 1500,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    initPerformanceChart() {
        const ctx = document.getElementById('performanceChart');
        if (!ctx) return;

        const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
        this.charts.performance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Response Time (min)',
                    data: [2.4, 2.1, 2.8, 1.9, 2.2, 3.1, 2.5],
                    backgroundColor: this.colors.primary,
                    borderRadius: 6,
                    barThickness: 20,
                    yAxisID: 'y'
                }, {
                    label: 'Resolution Rate (%)',
                    data: [89, 92, 85, 94, 91, 87, 90],
                    type: 'line',
                    borderColor: this.colors.success,
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointBackgroundColor: this.colors.success,
                    tension: 0.3,
                    yAxisID: 'y1'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        grid: {
                            display: true,
                            color: 'rgba(255, 255, 255, 0.03)'
                        },
                        ticks: {
                            font: {
                                size: 11
                            },
                            callback: function(value) {
                                return value + ' min';
                            }
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 11
                            },
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    initCategoriesChart() {
        const ctx = document.getElementById('categoriesChart');
        if (!ctx) return;

        const data = {
            labels: ['Technical Support', 'Billing', 'Account Issues', 'Feature Request', 'Bug Report', 'Other'],
            datasets: [{
                data: [30, 20, 18, 15, 12, 5],
                backgroundColor: [
                    this.colors.primary,
                    this.colors.success,
                    this.colors.warning,
                    this.colors.purple,
                    this.colors.danger,
                    this.colors.gray
                ],
                borderWidth: 0,
                hoverOffset: 10
            }]
        };

        this.charts.categories = new Chart(ctx, {
            type: 'pie',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'right',
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: {
                                size: 12
                            },
                            generateLabels: function(chart) {
                                const data = chart.data;
                                if (data.labels.length && data.datasets.length) {
                                    return data.labels.map(function(label, i) {
                                        const dataset = data.datasets[0];
                                        const value = dataset.data[i];
                                        const total = dataset.data.reduce((a, b) => a + b, 0);
                                        const percentage = ((value / total) * 100).toFixed(1);
                                        
                                        return {
                                            text: `${label}: ${percentage}%`,
                                            fillStyle: dataset.backgroundColor[i],
                                            hidden: false,
                                            index: i
                                        };
                                    });
                                }
                                return [];
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} tickets (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    animateScale: true,
                    duration: 1500,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    generateTimeSeriesData(points, min, max) {
        const data = [];
        let value = Math.random() * (max - min) + min;
        
        for (let i = 0; i < points; i++) {
            // Add some random walk
            value += (Math.random() - 0.5) * 10;
            // Keep within bounds
            value = Math.max(min, Math.min(max, value));
            data.push(Math.round(value));
        }
        
        return data;
    }

    updateAllCharts() {
        // Update tickets chart with new data
        if (this.charts.tickets) {
            const chart = this.charts.tickets;
            chart.data.datasets[0].data = this.generateTimeSeriesData(13, 20, 40);
            chart.data.datasets[1].data = this.generateTimeSeriesData(13, 15, 35);
            chart.update('active');
        }

        // Update SLA gauge with new value
        if (this.charts.slaGauge) {
            const newValue = Math.floor(Math.random() * 15) + 80;
            const chart = this.charts.slaGauge;
            chart.data.datasets[0].data = [newValue, 100 - newValue];
            chart.update('active');
            
            // Update the center text
            document.querySelector('.gauge-value').textContent = newValue + '%';
        }

        // Update performance chart
        if (this.charts.performance) {
            const chart = this.charts.performance;
            const newResponseTimes = chart.data.labels.map(() => 
                (Math.random() * 2 + 1.5).toFixed(1)
            );
            const newResolutionRates = chart.data.labels.map(() => 
                Math.floor(Math.random() * 10) + 85
            );
            
            chart.data.datasets[0].data = newResponseTimes;
            chart.data.datasets[1].data = newResolutionRates;
            chart.update('active');
        }

        // Update categories chart
        if (this.charts.categories) {
            const chart = this.charts.categories;
            const total = 100;
            const values = [
                Math.floor(Math.random() * 10) + 25,
                Math.floor(Math.random() * 10) + 15,
                Math.floor(Math.random() * 10) + 15,
                Math.floor(Math.random() * 10) + 10,
                Math.floor(Math.random() * 10) + 10,
                5
            ];
            
            // Normalize to ensure it adds up to roughly 100
            const sum = values.reduce((a, b) => a + b, 0);
            const normalized = values.map(v => Math.floor((v / sum) * total));
            
            chart.data.datasets[0].data = normalized;
            chart.update('active');
        }
    }

    destroy() {
        // Clean up all charts
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });
    }
}

// Initialize Charts Manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.ChartsManager = new ChartsManager();
    
    // Make charts responsive to window resize
    window.addEventListener('resize', () => {
        Object.values(window.ChartsManager.charts).forEach(chart => {
            if (chart) {
                chart.resize();
            }
        });
    });
});