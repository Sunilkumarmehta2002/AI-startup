#!/usr/bin/env python3
"""
Simple HTTP Server for AI Growth Hub India Website
Run this file to serve the website locally
"""

import http.server
import socketserver
import webbrowser
import os
from pathlib import Path

# Configuration
PORT = 8000
WEBSITE_DIR = Path(__file__).parent

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(WEBSITE_DIR), **kwargs)
    
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def serve_website(port=None):
    """Start the local web server"""
    if port is None:
        port = PORT
    try:
        with socketserver.TCPServer(("", port), CustomHTTPRequestHandler) as httpd:
            print(f"""
🚀 AI Growth Hub India - Local Server Started!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 Serving from: {WEBSITE_DIR}
🌐 Local URL: http://localhost:{port}
🔗 Network URL: http://192.168.1.XXX:{port}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👥 Founders: Sunil Kumar Mehta & Himanshu Raj
🎨 Design: Premium 3D Glassmorphism
📱 Features: Fully Responsive & Interactive
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔥 Opening browser automatically...
Press Ctrl+C to stop the server
            """)
            
            # Open browser automatically
            webbrowser.open(f'http://localhost:{port}')
            
            # Start serving
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except OSError as e:
        if e.errno == 48:  # Port already in use
            print(f"❌ Port {port} is already in use. Try a different port.")
            # Try alternative ports
            for alt_port in [8001, 8080, 3000, 5000]:
                try:
                    serve_website(alt_port)
                    break
                except OSError:
                    continue
        else:
            print(f"❌ Error starting server: {e}")

if __name__ == "__main__":
    # Check if we're in the right directory
    if not os.path.exists("index.html"):
        print("❌ index.html not found in current directory!")
        print("Make sure you're running this script from the website folder.")
        exit(1)
    
    serve_website()