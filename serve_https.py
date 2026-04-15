#!/usr/bin/env python3
"""
HTTPS dev server for Constellation Explorer VR.

WebXR immersive mode requires a secure context (HTTPS).
Plain http:// on a non-localhost address will silently disable the VR button
on the Meta Quest browser.

Usage:
    python3 serve_https.py

Then open on the Quest (same Wi-Fi network):
    https://<YOUR-COMPUTER-IP>:8443/quest/

First visit: the Quest browser will warn about the self-signed cert.
Tap  Advanced → Proceed  to trust it for this session.
"""

import ssl
import http.server
import pathlib
import socket

ROOT = pathlib.Path(__file__).parent
CERT = ROOT / ".cert" / "cert.pem"
KEY  = ROOT / ".cert" / "key.pem"
PORT = 8443


def local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "<YOUR-COMPUTER-IP>"


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, fmt, *args):
        # Suppress noisy access logs; keep errors.
        if args and str(args[1]) not in ("200", "304"):
            super().log_message(fmt, *args)


if not CERT.exists() or not KEY.exists():
    raise FileNotFoundError(
        f"Cert files not found:\n  {CERT}\n  {KEY}\n"
        "Run: openssl req -x509 -newkey rsa:2048 -keyout .cert/key.pem "
        "-out .cert/cert.pem -days 365 -nodes -subj '/CN=localhost'"
    )

ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ctx.load_cert_chain(CERT, KEY)

ip = local_ip()

with http.server.HTTPServer(("", PORT), Handler) as httpd:
    httpd.socket = ctx.wrap_socket(httpd.socket, server_side=True)
    print()
    print("  ✦  Constellation Explorer VR — HTTPS server")
    print()
    print(f"  Desktop  →  https://localhost:{PORT}/quest/")
    print(f"  Quest    →  https://{ip}:{PORT}/quest/")
    print()
    print("  ⚠  Self-signed cert: on the Quest browser, tap")
    print("     Advanced → Proceed (unsafe) the first time.")
    print()
    print("  Ctrl-C to stop.")
    print()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n  Server stopped.")
