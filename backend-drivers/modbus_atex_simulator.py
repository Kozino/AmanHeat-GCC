#!/usr/bin/env python3
"""
===============================================================================
AmanHeat GCC - Modbus TCP ATEX Sensor Simulator Server
===============================================================================
This script acts as a physical ATEX-certified heat-stress sensor (e.g., QuesTemp 44)
listening on Modbus TCP Port 5020.

It hosts standard 16-bit Modbus Holding Registers:
  - Register 40001 (Offset 0): Natural Wet Bulb Temp T_nw (x10) -> e.g. 302 = 30.2°C
  - Register 40002 (Offset 1): Globe Temp T_g (x10)           -> e.g. 485 = 48.5°C
  - Register 40003 (Offset 2): Dry Bulb Ambient T_d (x10)     -> e.g. 421 = 42.1°C
  - Register 40004 (Offset 3): Relative Humidity RH (x10)     -> e.g. 580 = 58.0%

You can test your ingestion client by connecting to 127.0.0.1:5020!
===============================================================================
"""

import socket
import struct
import random
import time
import threading

HOST = "0.0.0.0"
PORT = 5020  # Port 5020 used for non-root local testing

# Simulated Live Registers (x10 integer representation)
def get_live_registers():
    t_d = int(random.uniform(41.0, 44.0) * 10)     # Dry Bulb (e.g. 42.5°C)
    t_nw = int(random.uniform(29.0, 31.8) * 10)    # Wet Bulb (e.g. 30.2°C)
    t_g = int((t_d / 10.0 + random.uniform(6.0, 9.0)) * 10) # Globe Temp
    rh = int(random.uniform(52.0, 65.0) * 10)      # Humidity

    return [t_nw, t_g, t_d, rh]

def handle_client(conn, addr):
    print(f"[Modbus Simulator] Connected by client at {addr}")
    try:
        while True:
            data = conn.recv(1024)
            if not data or len(data) < 12:
                break

            # Parse Modbus TCP Header (MBAP Header - 7 bytes)
            # Transaction ID (2B), Protocol ID (2B), Length (2B), Unit ID (1B), Function Code (1B)
            trans_id, proto_id, length, unit_id, func_code = struct.unpack(">HHHBB", data[:8])

            # Function Code 0x03 = Read Holding Registers
            if func_code == 3:
                start_reg, reg_count = struct.unpack(">HH", data[8:12])
                registers = get_live_registers()

                # Build Modbus TCP Response
                byte_count = reg_count * 2
                response_mbap = struct.pack(">HHHBB", trans_id, proto_id, 3 + byte_count, unit_id, func_code)
                response_payload = struct.pack(">B", byte_count)

                for r in registers[:reg_count]:
                    response_payload += struct.pack(">H", r)

                conn.sendall(response_mbap + response_payload)
                
                # Print log
                wbgt = round(0.7 * (registers[0]/10.0) + 0.2 * (registers[1]/10.0) + 0.1 * (registers[2]/10.0), 2)
                print(f"[Modbus TCP Server] Modbus Request Read {reg_count} regs -> Returned WBGT: {wbgt}°C (T_nw:{registers[0]/10}°C, T_g:{registers[1]/10}°C, T_d:{registers[2]/10}°C)")
            else:
                # Exception response
                conn.sendall(struct.pack(">HHHBB", trans_id, proto_id, 3, unit_id, func_code + 0x80) + b"\x01")
    except Exception as e:
        print(f"[Modbus Simulator] Client disconnected: {e}")
    finally:
        conn.close()

def start_modbus_server():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server_socket.bind((HOST, PORT))
    server_socket.listen(5)
    print(f"=========================================================================")
    print(f"   Modbus TCP ATEX Sensor Simulator Server Running on {HOST}:{PORT}   ")
    print(f"=========================================================================")

    while True:
        conn, addr = server_socket.accept()
        client_thread = threading.Thread(target=handle_client, args=(conn, addr))
        client_thread.daemon = True
        client_thread.start()

if __name__ == "__main__":
    start_modbus_server()
