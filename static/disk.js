// disk.js

// Import the functions
import { line_chart, multi_line, createTableElement, addTableRow } from './charts_creation.js';


// Button click action
document.getElementById('menuToggle').addEventListener('click', function () {
  document.getElementById('mainNav').classList.toggle('open');
});

let line_charts = []
const table_headers = ['Device', 'Free', 'fstype', 'Mount Point', 'Opts', 'Percent Used', 'Total Size', 'Used'];

// Initialize line charts for CPU, Memory, Network Packets Sent, Network Packets Received, and Disk usage
line_charts.push(line_chart('ReadSpeedChart', 'Reads KB/s', 'yellow', 'rgba(0, 255, 149, 0.1)'))
console.log(line_charts)

// Initialize line charts for CPU, Memory, Network Packets Sent, Network Packets Received, and Disk usage
line_charts.push(line_chart('WriteSpeedChart', 'Writes KB/s', 'green', 'rgba(0, 195, 255, 0.1)'))
console.log(line_charts)



// An asynchronous function to fetch metrics from the server
// and update the charts and flexboard
async function fetchMetrics() {
  const res = await fetch('/disk_io');
  const data = await res.json();
  const time = new Date(data.timestamp * 1000).toLocaleTimeString();


  line_charts.forEach(chart => chart.data.labels.push(time));

  // Chart update

  // cpu_gauge.data.datasets[0].data = [data.cpu, 100 - data.cpu];
  // cpu_gauge.data.datasets[0].backgroundColor = [COLORS[index(data.cpu)], "white"];
  // cpu_gauge.options.plugins.annotation.annotations[0].content = [(data.cpu+' %'),"CPU Utilization"];
  // cpu_gauge.update();
  ReadSpeedChart.data.datasets[0].data.push(data.ReadSpeed);
  WriteSpeedChart.data.datasets[0].data.push(data.WriteSpeed);

  line_charts.forEach(chart => chart.update());

  line_charts.forEach(chart => {
    if (chart.data.labels.length > 30) {
      chart.data.labels.shift();
      chart.data.datasets[0].data.shift();
    }
  });
}


const table = document.querySelector('table');
table.appendChild(addTableRow('th', table_headers));


async function diskUsage() {
  const res = await fetch('/partitions');
  const data = await res.json();

  // Clear all rows except the header
  const rows = table.querySelectorAll('tr');
  rows.forEach((row, index) => {
    if (index > 0) { // Skip the header row (index 0)
      row.remove();
    }
  });


  // Loop through the JSON object
  Object.entries(data).forEach(partition => {
    const row = document.createElement("tr")

    // Clear all rows except the header
    const rows = table.querySelectorAll('tr');
    rows.forEach((row, index) => {
      if (index > 0) { // Skip the header row (index 0)
        row.remove();
      }
    });

    // Loop through the JSON object and add rows
    data.forEach(partition => {
      let row_data = [partition.device, partition.fstype, partition.mountpoint, partition.opts, `${partition.percent_used} %`, `${partition.total_size} GB`, `${partition.free} GB`, `${partition.used} GB`]
      table.appendChild(addTableRow('td', row_data));

    });

  });

}

// Call the fetchMetrics function every 5 seconds to update the charts
setInterval(diskUsage, 5000);

// Call the fetchMetrics function every 2 seconds to update the charts
setInterval(fetchMetrics, 2000);