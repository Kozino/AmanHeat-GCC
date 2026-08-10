#!/usr/bin/env python3
"""
AmanHeat GCC - Test Modbus Client
Connects to local Modbus TCP Server (127.0.0.1:5020), reads registers 40001-40004,
and computes official Qatar WBGT.
"""

import socket
import struct
import time
import hashlib
import datetime

SERVER_IP = "127.0.0.1"
SERVER_PORT = 5020

def read_modbus_holding_registers(ip, port, start_reg=0, count=4):
    """Sends a Modbus TCP Function Code 0x03 packet."""
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client.connect((ip, port))

    # MBAP Header: Transaction ID=1, Protocol=0, Length=6, Unit ID=1, Function=3, Start=0, Count=4
    request = struct.pack(">HHHBBHH", 1, 0, 6, 1, 3, start_reg, count)
    client.sendall(request)

    response = client.recv(1024)
    client.close()

    if len(response) >= 9 + (count * 2):
        byte_count = response[8]
        register_bytes = response[9:9 + byte_count]
        registers = struct.unpack(f">{count}H", register_bytes)
        return [r / 10.0 for r in registers] # Divide by 10
    else:
        raise ValueError("Invalid Modbus response format")

def test_pipeline():
    print("Connecting to Local Modbus TCP Server Simulator at 127.0.0.1:5020...")
    try:
        t_nw, t_g, t_d, rh = read_modbus_holding_registers(SERVER_IP, SERVER_PORT, start_reg=0, count=4)
        wbgt = round(0.7 * t_nw + 0.2 * t_g + 0.1 * t_d, 2)
        
        status = "CRITICAL_STOP" if wbgt >= 32.1 else ("MANDATORY_REST" if wbgt >= 31.1 else "NORMAL")
        timestamp = datetime.datetime.now(datetime.timezone.utc).isoformat()
        
        sha_raw = f"ATEX-PROBE-01:{timestamp}:{wbgt}:{status}"
        sha_hash = "0x" + hashlib.sha256(sha_raw.encode('utf-8')).hexdigest()

        print("\n=======================================================")
        print(" SUCCESS! Modbus TCP Telemetry Ingestion Confirmed:")
        print("=======================================================")
        print(f" Timestamp         : {timestamp}")
        print(f" Natural Wet Bulb  : {t_nw}°C")
        print(f" Globe Temperature : {t_g}°C")
        print(f" Ambient Dry Bulb  : {t_d}°C")
        print(f" Relative Humidity : {rh}%")
        print(f" Computed WBGT Heat: {wbgt}°C")
        print(f" Legal Qatar Status: {status}")
        print(f" SHA-256 Audit Stamp: {sha_hash}")
        print("=======================================================\n")
        return True
    except Exception as e:
        print(f"Connection failed: {e}")
        return False

if __name__ == "__main__":
    test_pipeline()
