# app.py
from flask import Flask, jsonify, render_template
import psutil
import time
import socket
import os
import platform
import json
import subprocess

# Function to get the IP address of the machine
def get_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return socket.gethostbyname(socket.gethostname())
    
# Function to get CPU model information
def cpu_info():
        
    if platform.system() == "Linux":
        lscpu = subprocess.check_output("lscpu | grep \"Model name:\"", shell=True).decode()
        cpu_model = lscpu.split(":")[-1].strip()
        return cpu_model
    else:
        return platform.processor()
        
# Initializing Flask app
app = Flask(__name__)

# Setting html templates to routes

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/cores")
def cores():
    return render_template("cores.html")

@app.route("/disk")
def disk():
    return render_template("disk.html")
# Setting API routes

# This route returns system metrics CPU, memory, disk usage, and network packets sent/received
@app.route("/metrics")
def metrics():
    # Get initial network stats
    net1 = psutil.net_io_counters()
    time.sleep(1)  # Wait for 1 second
    # Get network stats after 1 second
    net2 = psutil.net_io_counters()

    # Calculate current usage
    packets_sent = net2.packets_sent - net1.packets_sent
    packets_received = net2.packets_recv - net1.packets_recv
    cpu = psutil.cpu_percent(interval=0.5)
    memory = psutil.virtual_memory().percent
    disk = psutil.disk_usage('/').percent
    net = psutil.net_io_counters()

    return jsonify({
        "cpu": cpu,
        "memory": memory,
        "disk": disk,
        "PacketsSent": packets_sent,
        "PacketsReceived": packets_received,
        "timestamp": time.time()
    })

# This route returns system details IP address, hostname, number of CPUs, CPU model, RAM, and system name
@app.route("/details")
def details():
    ip = get_ip()
    hostname = socket.gethostname()
    no_of_cpus = psutil.cpu_count(logical=True)
    cpu_model = cpu_info()
    cpu_ram = psutil.virtual_memory().total / (1e+9)
    system_name = platform.system() 
    return jsonify({
        "IP": ip,
        "Hostname": hostname,
        "No of CPU": no_of_cpus,
        "CPU Model": cpu_model,
        "CPU RAM": str(round(cpu_ram, 2))+" GB",
        "System": system_name,
        "timestamp": time.time()
    })

# This route returns CPU core usage percentages
@app.route("/cpu_cores")
def cpu_info_route():
    cpu_model = psutil.cpu_percent(interval=0.5, percpu=True)
    cpu_cores={}
    for i, percent in enumerate(cpu_model):
        cpu_cores[f"Core {i}"] = percent
    cpu_cores["timestamp"] = time.time()
    return jsonify(cpu_cores)

# This route returns the top 5 processes by CPU usage
@app.route("/top_processes")
def top_processes():
    num_cores = psutil.cpu_count(logical=True)
    # Get all processes
    processes = []
    for proc in psutil.process_iter(['pid', 'name', 'cpu_percent']):
        try:
            proc.info['cpu_percent'] = round(proc.info['cpu_percent'] / num_cores, 2)  # Round to 2 decimal places
            processes.append(proc.info)
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass

    # Sort processes by CPU usage in descending order
    top_processes = sorted(processes, key=lambda x: x['cpu_percent'], reverse=True)[:5]

    return jsonify(top_processes)

# This route returns disk I/O statistics
@app.route("/disk_io")
def disk_io():
    disk1 = psutil.disk_io_counters()
    time.sleep(1)
    disk2 = psutil.disk_io_counters()
    return jsonify({
        "ReadSpeed": (disk2.read_bytes - disk1.read_bytes) / 1024,  # KB/s
        "WriteSpeed": (disk2.write_bytes - disk1.write_bytes) / 1024,  # KB/s
        "timestamp": time.time()
    })

# This route returns disk partitions
@app.route("/partitions")
def partitions():
    partitions = psutil.disk_partitions()
    partition_info = []

    for partition in partitions:
        if partition.fstype != "squashfs":
            try:
                usage = psutil.disk_usage(partition.mountpoint)
                partition_info.append({
                    "device": partition.device,
                    "mountpoint": partition.mountpoint,
                    "fstype": partition.fstype,
                    "opts": partition.opts,
                    "total_size": round(usage.total / (1024 ** 3), 2),  # Convert to GB
                    "used": round(usage.used / (1024 ** 3), 2),  # Convert to GB
                    "free": round(usage.free / (1024 ** 3), 2),  # Convert to GB
                    "percent_used": usage.percent
                })
            except PermissionError:
                continue

    return jsonify(partition_info)

if __name__ == "__main__":
    app.run()
