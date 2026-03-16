#!/bin/bash
set -e

echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

echo "🦕 Installing Deno (required by yt-dlp for JS challenge solving)..."
curl -fsSL https://deno.land/install.sh | sh

# Add Deno to PATH for this session
export DENO_INSTALL="$HOME/.deno"
export PATH="$DENO_INSTALL/bin:$PATH"

echo "✅ Deno version: $(deno --version | head -1)"
echo "✅ yt-dlp version: $(python -m yt_dlp --version)"
echo "🎉 Build complete!"
