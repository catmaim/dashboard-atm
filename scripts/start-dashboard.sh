#!/usr/bin/env bash
set -euo pipefail

PORT="${1:-3000}"

command -v node >/dev/null 2>&1 || {
  echo "❌ ไม่พบ Node.js กรุณาติดตั้ง Node.js 20+ ก่อน"
  exit 1
}

command -v npm >/dev/null 2>&1 || {
  echo "❌ ไม่พบ npm กรุณาติดตั้ง npm ก่อน"
  exit 1
}

if [ ! -d node_modules ]; then
  echo "📦 กำลังติดตั้ง dependencies..."
  if ! npm install; then
    echo "\n❌ ติดตั้ง dependencies ไม่สำเร็จ"
    echo "ลองรันคำสั่งนี้ก่อน แล้วค่อยรันสคริปต์ใหม่:"
    echo "npm config set registry https://registry.npmjs.org/"
    exit 1
  fi
fi

echo "\n✅ พร้อมใช้งาน!"
echo "🌐 เปิดเบราว์เซอร์ที่: http://localhost:${PORT}"
echo "(หยุดเซิร์ฟเวอร์: กด Ctrl + C)"

npm run dev -- -p "${PORT}"
