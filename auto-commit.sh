#!/bin/bash
# Auto-commit & push every 30 seconds
# Usage: ./auto-commit.sh
# Stop:  Ctrl+C

REPO_DIR="/Users/shanmukhavardhan/Dev/30-Days/1-QR"
INTERVAL=30

echo "🚀 Auto-commit started (every ${INTERVAL}s)"
echo "   Repo: $REPO_DIR"
echo "   Press Ctrl+C to stop"
echo "─────────────────────────────────"

while true; do
    cd "$REPO_DIR" || exit 1

    # Check if there are any changes
    if [ -n "$(git status --porcelain)" ]; then
        TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
        
        # Get list of changed files for commit message
        CHANGED=$(git diff --name-only --diff-filter=M 2>/dev/null | head -5 | xargs -I{} basename {} | paste -sd ', ' -)
        NEW=$(git ls-files --others --exclude-standard 2>/dev/null | head -5 | xargs -I{} basename {} | paste -sd ', ' -)
        
        MSG="auto: ${TIMESTAMP}"
        [ -n "$CHANGED" ] && MSG="$MSG | modified: $CHANGED"
        [ -n "$NEW" ] && MSG="$MSG | new: $NEW"

        git add .
        git commit -m "$MSG" --quiet
        git push origin main --quiet 2>/dev/null

        echo "✅ [$TIMESTAMP] Committed & pushed"
    else
        echo "⏳ [$(date '+%H:%M:%S')] No changes detected"
    fi

    sleep "$INTERVAL"
done
