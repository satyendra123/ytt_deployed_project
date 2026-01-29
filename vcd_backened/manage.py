#!/usr/bin/env python
import os
import sys
import socket
import psutil


def get_system_ip():
    
    for iface, addrs in psutil.net_if_addrs().items():
        iface_l = iface.lower()

        # Match common Ethernet names
        if any(x in iface_l for x in ["ethernet", "eth", "enp", "ens"]):
            for addr in addrs:
                if addr.family == socket.AF_INET:
                    return addr.address
    
    return "127.0.0.1"


def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'anpr_backened.settings')

    # If user typed only: python manage.py runserver
    if len(sys.argv) == 2 and sys.argv[1] == "runserver":
        system_ip = get_system_ip()
        sys.argv.append(f"{system_ip}:8000")
        print(f"🚀 Django running on system IP: {system_ip}:8000")

    from django.core.management import execute_from_command_line
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
