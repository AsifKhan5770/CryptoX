import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { format } from 'date-fns';

// Register the financial chart type
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
Chart.register(CandlestickController, CandlestickElement);

const CandleChart = ({ data, symbol, onClose }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    
    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: 'candlestick',
      data: {
        datasets: [{
          label: `${symbol} Price`,
          data: data.map(item => ({
            x: item.time,
            o: item.open,
            h: item.high,
            l: item.low,
            c: item.close
          })),
          color: {
            up: 'rgba(34, 197, 94, 0.95)',      // Brighter green for bullish candles
            down: 'rgba(239, 68, 68, 0.95)',    // Brighter red for bearish candles
            unchanged: 'rgba(156, 163, 175, 0.9)',
          },
          borderColor: {
            up: 'rgba(34, 197, 94, 1)',         // Solid green border
            down: 'rgba(239, 68, 68, 1)',       // Solid red border
            unchanged: 'rgba(156, 163, 175, 1)',
          },
          borderWidth: 1.2,                      // Increased border width for better separation
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        animation: {
          duration: 300, // Fast animation for real-time
          easing: 'easeOutQuart'
        },
        transitions: {
          active: {
            animation: {
              duration: 150
            }
          }
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'minute',
              tooltipFormat: 'MMM d, HH:mm:ss',
              displayFormats: {
                minute: 'HH:mm',
                hour: 'MMM d',
                day: 'MMM d'
              }
            },
            title: {
              display: false
            },
            grid: {
              color: 'rgba(156, 163, 175, 0.1)'
            },
            ticks: {
              color: '#9ca3af',
              maxTicksLimit: 12,
              source: 'auto'
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: false
            },
            ticks: {
              callback: function(value) {
                return '$' + value.toLocaleString();
              },
              color: '#9ca3af',
              maxTicksLimit: 8
            },
            grid: {
              color: 'rgba(156, 163, 175, 0.1)'
            }
          }
        },
        plugins: {
          tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.95)',
            titleColor: '#ffffff',
            bodyColor: '#9ca3af',
            borderColor: 'rgba(156, 163, 175, 0.2)',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              label: function(context) {
                const point = context.raw;
                return [
                  `Open: $${point.o.toLocaleString()}`,
                  `High: $${point.h.toLocaleString()}`,
                  `Low: $${point.l.toLocaleString()}`,
                  `Close: $${point.c.toLocaleString()}`
                ];
              },
              title: function(context) {
                return format(new Date(context[0].raw.x), 'MMM d, yyyy HH:mm:ss');
              }
            }
          },
          legend: {
            display: false
          }
        },
        // Ensure proper candlestick rendering with better separation
        elements: {
          candlestick: {
            borderWidth: 1.2,
            borderSkipped: false,
            backgroundColor: {
              up: 'rgba(34, 197, 94, 0.8)',      // Semi-transparent green fill
              down: 'rgba(239, 68, 68, 0.8)',    // Semi-transparent red fill
              unchanged: 'rgba(156, 163, 175, 0.8)',
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, symbol]);

  // Update chart data smoothly when new data arrives
  useEffect(() => {
    if (chartInstance.current && data.length > 0) {
      const newData = data.map(item => ({
        x: item.time,
        o: item.open,
        h: item.high,
        l: item.low,
        c: item.close
      }));
      
      chartInstance.current.data.datasets[0].data = newData;
      chartInstance.current.update('none'); // Update without animation for real-time
    }
  }, [data]);

  return (
    <div className="simple-candle-chart">
      <div className="realtime-indicator">
        <span className="pulse-dot"></span>
        <span className="realtime-text">LIVE</span>
      </div>
      <canvas ref={chartRef} />
    </div>
  );
};

export default CandleChart;