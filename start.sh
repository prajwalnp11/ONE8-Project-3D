#!/bin/bash
# ONE8 Project: Start both Django backend and React frontend together

cleanup() {
  echo ""
  echo "🛑 Stopping ONE8 servers..."
  kill $(jobs -p) 2>/dev/null
  exit 0
}
trap cleanup SIGINT SIGTERM EXIT

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=================================================="
echo "⚡ Starting ONE8 Django Backend (Port 8000)..."
echo "=================================================="
cd "$SCRIPT_DIR/backend"
if [ -d ".venv" ]; then
  source .venv/bin/activate
fi
python manage.py runserver 127.0.0.1:8000 &
BACKEND_PID=$!

# Wait 2 seconds for Django to initialize
sleep 2

echo ""
echo "=================================================="
echo "⚡ Starting ONE8 React Vite Frontend (Port 5173)..."
echo "=================================================="
cd "$SCRIPT_DIR/frontend"
npm run dev
