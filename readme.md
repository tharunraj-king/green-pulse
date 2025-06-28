# 🌱 Green Pulse

**Green Pulse** is a real-time system monitoring dashboard built with Flask and Chart.js. It provides insights into system performance, including CPU, memory, disk usage, network statistics, and process monitoring, all presented in a clean and responsive interface.

---

## **✨ Features**

### **🖥️ System Monitoring**
- **⚙️ CPU Usage**: Real-time CPU usage with per-core breakdown.
- **💾 Memory Usage**: Tracks memory utilization.
- **📀 Disk Usage**: Monitors disk read/write speeds and partition usage.
- **🌐 Network Statistics**: Displays packets sent/received and bandwidth usage.
- **📊 Top Processes**: Lists the top 5 processes by CPU usage.

### **📋 System Details**
- Hostname, IP address, CPU model, RAM, and operating system details.

### **📈 Interactive Charts**
- Line charts for CPU, memory, and disk usage.
- Multi-line charts for CPU core usage.
- Gauge charts for CPU and memory utilization.

### **📱 Responsive Design**
- Works seamlessly across devices with a responsive layout.

---

## **🛠️ Technologies Used**

### **🔧 Backend**
- **Flask**: Serves API endpoints and HTML templates.
- **psutil**: Retrieves system metrics like CPU, memory, and disk usage.

### **🎨 Frontend**
- **Chart.js**: Renders interactive charts.
- **HTML/CSS**: Provides a clean and responsive user interface.
- **JavaScript**: Handles dynamic updates and interactivity.

---

## **🚀 Installation**

### **📋 Prerequisites**
- Python 3.8 or higher
- pip (Python package manager)

### **📦 Steps**
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/green-pulse.git
   cd green-pulse
   ```
2. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the application:
   ```bash
   python app.py
   ```
4. Access the dashboard at `http://127.0.0.1:5000`.

---

## **📚 Usage**

- Upon launching, the dashboard provides an overview of system performance.
- Navigate through different sections to view detailed metrics.
- Use the responsive design for monitoring on various devices.

---

# Screenshots and GIFs

Here are some visuals to showcase the functionality of **Green Pulse**:

## **📊 Dashboard Overview**
![Dashboard Overview](https://github.com/user-attachments/assets/7a68b08e-6268-4aab-8eff-c99f9f4b4fe6)
![Screenshot from 2025-06-28 18-29-13](https://github.com/user-attachments/assets/3bb03aeb-5db1-462a-9b24-3908204a68d9)

*The main dashboard showing real-time CPU, memory, and disk usage.*

---

## **🖥️ CPU Core Usage**
![CPU Core Usage](https://github.com/user-attachments/assets/bd1b29d1-57ea-411d-9758-e5cb4a9bc150)

*Multi-line chart displaying per-core CPU usage.*

---

## **📀 Disk I/O Monitoring**
![Disk I/O Monitoring](https://github.com/user-attachments/assets/4b38c291-7b95-4220-a5d0-750c5b18aabd)
*Real-time disk read/write speed charts.*

---

## **🧑‍🤝‍🧑 Contributing**

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/YourFeature`
3. Make your changes and commit them: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Create a pull request.

---



## **Acknowledgements**

- Inspired by the need for efficient system monitoring tools.
- Leveraging Flask and Chart.js for a powerful and flexible dashboard solution.
