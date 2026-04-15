#!/usr/bin/env bash
# Regenerates the self-signed cert with your actual local IP as a SAN.
# Quest's Chrome-based browser needs the IP in the Subject Alternative Name
# (SAN) field — CN alone is ignored by modern browsers.
#
# Run this once whenever your local IP changes, then restart serve_https.py.
#
# Usage:
#   chmod +x regen_cert.sh
#   ./regen_cert.sh

set -e

CERT_DIR="$(dirname "$0")/.cert"
mkdir -p "$CERT_DIR"

# Detect local IP (works on macOS and Linux)
LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null \
  || ipconfig getifaddr en1 2>/dev/null \
  || ip route get 1.1.1.1 2>/dev/null | awk '{for(i=1;i<=NF;i++) if($i=="src") print $(i+1)}' \
  || hostname -I 2>/dev/null | awk '{print $1}')

if [ -z "$LOCAL_IP" ]; then
  echo "ERROR: Could not detect your local IP automatically."
  echo "       Edit this script and set LOCAL_IP manually."
  exit 1
fi

echo "Local IP detected: $LOCAL_IP"

# Write an openssl config with the IP in the SAN
CONF=$(mktemp /tmp/cert_XXXXXX.cnf)
cat > "$CONF" <<EOF
[req]
default_bits       = 2048
prompt             = no
distinguished_name = dn
x509_extensions    = v3_req

[dn]
CN = $LOCAL_IP

[v3_req]
subjectAltName = @alt_names
basicConstraints = CA:FALSE
keyUsage = digitalSignature, keyEncipherment

[alt_names]
IP.1 = $LOCAL_IP
IP.2 = 127.0.0.1
DNS.1 = localhost
EOF

openssl req -x509 -newkey rsa:2048 \
  -keyout "$CERT_DIR/key.pem" \
  -out    "$CERT_DIR/cert.pem" \
  -days   365 -nodes \
  -config "$CONF"

rm -f "$CONF"

echo ""
echo "  ✓ New cert written to .cert/"
echo ""
echo "  Next steps:"
echo "  1. Run:  python3 serve_https.py"
echo "  2. On the Quest, open:  https://$LOCAL_IP:8443/quest/"
echo "  3. The browser will still warn (self-signed). Tap:"
echo "     Advanced → Proceed to $LOCAL_IP (unsafe)"
echo ""
echo "  Tip: if the Quest still refuses, go to https://$LOCAL_IP:8443"
echo "  first (just the root), accept there, then navigate to /quest/"
