// Function to create a line chart
export function line_chart(variableName, label, bcolor, bgcolor, legendTextColor = '#fff') {
    globalThis[variableName] = new Chart(document.getElementById(variableName).getContext('2d'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: label, data: [], borderColor: bcolor, fill: true,
                backgroundColor: bgcolor,  // light color fill
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    grid: {
                        color: '#444' // Dark gray for X axis grid lines
                    },
                    ticks: {
                        color: '#ccc' // Optional: change tick label color
                    }
                },
                y: {
                    grid: {
                        color: '#444' // Dark gray for Y axis grid lines
                    },
                    ticks: {
                        color: '#ccc'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: legendTextColor || '#fff' // Use configurable color or default to white
                    }
                }
            }
        }
    });
    return globalThis[variableName]
}


// Multi-line chart for CPU cores
export function multi_line(variableName, legendTextColor = '#fff') {
    console.log(variableName)
    globalThis[variableName] = new Chart(document.getElementById(variableName).getContext('2d'), {
        type: 'line',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    grid: {
                        color: '#444' // Dark gray for X axis grid lines
                    },
                    ticks: {
                        color: '#ccc' // Optional: change tick label color
                    }
                },
                y: {
                    grid: {
                        color: '#444' // Dark gray for Y axis grid lines
                    },
                    ticks: {
                        color: '#ccc'
                    },
                    min: 0, // Set the minimum value of the Y-axis
                    max: 100 // Set the maximum value of the Y-axis

                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: legendTextColor || '#fff' // Use configurable color or default to white
                    }
                },
                tooltip: {
                    enabled: true, // Enable tooltips
                    callbacks: {
                        label: function (context) {
                            // Customize the tooltip label
                            const label = context.dataset.label || '';
                            const value = context.raw; // Get the raw value of the data point
                            return `${label}: ${value}%`; // Example: "Core 0: 75%"
                        }
                    }
                }
            }

        }
    });
}


export function createTableElement(type, content) {
    const table_cell = document.createElement(type);
    table_cell.textContent = content;
    return table_cell
}

export function addTableRow(type, element_list) {
    const row = document.createElement('tr');
    element_list.forEach(el => row.appendChild(createTableElement(type, el)));
    return row

}