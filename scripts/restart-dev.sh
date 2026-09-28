#!/bin/zsh
# Restart the photography site dev server (run this in your own Terminal / Cursor terminal)
set -e
ROOT="/Users/suchitraswain/Documents/personal projects/photography-website/.worktrees/phase1-portfolio"
cd "$ROOT"

echo "Stopping anything on ports 3000/3001…"
for port in 3000 3001; do
  pids=$(lsof -tiTCP:$port -sTCP:LISTEN 2>/dev/null || true)
  if [[ -n "$pids" ]]; then
    echo "  kill $pids (port $port)"
    kill -9 $pids 2>/dev/null || true
  fi
done

# Also clear Next's stale lock from the hung server
rm -f "$ROOT/.next/dev/lock"

sleep 1
echo "Starting Next.js on http://localhost:3000 …"
exec npm run dev -- --port 3000 --hostname localhost
