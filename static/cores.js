// This script is used to create a multi-line chart for CPU core usage

// Button click action
document.getElementById('menuToggle').addEventListener('click', function () {
    document.getElementById('mainNav').classList.toggle('open');
  });

// Import the functions
import { line_chart, multi_line, createTableElement, addTableRow } from './charts_creation.js';

multi_line("cpuCores")
const table_headers=["PID","Process Name","CPU Usage"]

// An asynchronous function to fetch metrics from the server
async function fetchMetrics() {
    const res = await fetch('/cpu_cores');
    const data = await res.json();
    const time = new Date(data.timestamp * 1000).toLocaleTimeString();

    // Remove the timestamp key from the data
    delete data.timestamp;

    // Loop through the JSON object
    Object.entries(data).forEach(([core, value]) => {
        console.log(`Core: ${core}, Value: ${value}`);
        // Add the data to the chart
        let dataset = globalThis["cpuCores"].data.datasets.find(ds => ds.label === core);
        let color = getRandomColor()
        if (!dataset) {
            // If the dataset for this core doesn't exist, create it
            globalThis["cpuCores"].data.datasets.push({
                label: core,
                data: [],
                borderColor: color, // Assign a random color
                borderWidth: 2.5
            });
        }
        // Add the value to the dataset
        dataset = globalThis["cpuCores"].data.datasets.find(ds => ds.label === core);
        dataset.data.push(value);

        // Limit the number of data points to 30
        // if (dataset.data.length > 30) {
        //     dataset.data.shift();
        // }

    });

    // Add the time label to the chart
    globalThis["cpuCores"].data.labels.push(time);
    if (globalThis["cpuCores"].data.labels.length > 30) {
        globalThis["cpuCores"].data.labels.shift();
        // Remove the oldest data point from each dataset
        globalThis["cpuCores"].data.datasets.forEach(dataset => {
            dataset.data.shift();
        });
    }

    // Update the chart
    globalThis["cpuCores"].update();
}

// Helper function to generate random colors
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
const table = document.querySelector('table');
table.appendChild(addTableRow('th', table_headers));

async function topProcess() {
    const res = await fetch('/top_processes');
    const data = await res.json();

    // Clear all rows except the header
    const rows = table.querySelectorAll('tr');
    rows.forEach((row, index) => {
        if (index > 0) { // Skip the header row (index 0)
            row.remove();
        }
    });


    // Loop through the JSON object
    Object.entries(data).forEach(process => {
        const row = document.createElement("tr")

        // Clear all rows except the header
        const rows = table.querySelectorAll('tr');
        rows.forEach((row, index) => {
            if (index > 0) { // Skip the header row (index 0)
                row.remove();
            }
        });

        // Loop through the JSON object and add rows
        data.forEach(process => {
            let row_data=[process.pid, process.name,`${process.cpu_percent}%`]
            table.appendChild(addTableRow('td', row_data));
        });

    });

}

// Fetch metrics every 2 seconds
setInterval(fetchMetrics, 2000);

setInterval(topProcess, 5000);