import { useEffect, useState } from 'react';
import { createChart } from 'lightweight-charts';

const BettingChart = () => {
  const [bettingData, setBettingData] = useState(null);

  // Define an array of colors for different series
  const colors = [
    '#FF5733', // Red
    '#33FF57', // Green
    '#3357FF', // Blue
    '#FF33A1', // Pink
    '#FFD700', // Yellow
    '#8A2BE2', // Purple
    '#FF6347', // Tomato
  ];

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/bettingData');
      const result = await response.json();
      console.log(result)
      setBettingData(result.data.betMarketListingHistory);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!bettingData) return;

    const chartContainer = document.getElementById('chart');
    const chart = createChart(chartContainer, { 
      width: 1800, 
      height: 400,
      layout: {
        backgroundColor: '#ffffff',  // Chart background color
        textColor: '#000000',  // Axis text color
      },
      rightPriceScale: {
        visible: true, // Hide the right price scale (Y-axis)
      },
      leftPriceScale: {
        visible: true, // Hide the left price scale (Y-axis)
      },
      crosshair: {
        mode: 0, // Disable crosshair
      },
    });

    const labels = [];

    bettingData.forEach((market, index) => {
      const series = chart.addLineSeries({
        color: colors[index % colors.length],  // Assign a color from the array
        title: market.siteId,
      });

      labels.push({
        siteId: market.siteId,
        color: colors[index % colors.length],  // Same color for the label
      });

      // Sort by timeStamp and remove duplicates
      const sortedData = market.odds
        .filter((odd) => odd.americanOdds !== null)
        .sort((a, b) => a.timeStamp - b.timeStamp)  // Ascending sort
        .reduce((uniqueData, odd) => {
          const timeString = new Date(odd.timeStamp * 1000);
          const formattedDate = timeString.toISOString().split('T')[0]; // Get yyyy-mm-dd format

          // Ensure unique timestamps with formatted date
          if (!uniqueData.some((data) => data.time === formattedDate)) {
            uniqueData.push({
              time: formattedDate, // Only yyyy-mm-dd
              value: odd.americanOdds,
            });
          }
          return uniqueData;
        }, []);

      series.setData(sortedData);
      
      // Set initial zoom to the last N data points (e.g., 10)
      const visiblePoints = 1; // Number of data points to show initially
      if (sortedData.length > visiblePoints) {
        chart.timeScale().setVisibleLogicalRange({
          from: sortedData.length - visiblePoints,
          to: sortedData.length - 1,
        });
      }
    });

    // Create custom labels above the chart
    const labelContainer = document.getElementById('labels');
    labels.forEach((label, index) => {
      const labelElement = document.createElement('div');
      labelElement.textContent = label.siteId;
      labelElement.style.color = label.color;
      labelElement.style.display = 'inline-block';
      labelElement.style.marginRight = '15px';
      labelElement.style.padding = '5px';
      labelContainer.appendChild(labelElement);
    });
  }, [bettingData]);

  return (
    <div>
      <div id="labels" className="flex justify-center mb-2"></div>
      <div id="chart" className="w-full"></div>
    </div>
  );
};

export default BettingChart;
