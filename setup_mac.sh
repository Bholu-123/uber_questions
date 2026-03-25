#!/bin/bash
# ============================================================
#  Uber SDE2 Frontend Interview — Mac Setup Script
#  Run this ONCE from your Terminal.
#  It creates all 10 project folders on your Desktop and
#  installs npm dependencies for each.
# ============================================================

set -e

DESKTOP="$HOME/Desktop"
BASE="$DESKTOP/Uber_SDE2_Interview"

echo ""
echo "🚀 Setting up Uber SDE2 Frontend Interview Projects..."
echo "📁 Base folder: $BASE"
echo ""

mkdir -p "$BASE"

# ─── Helper: scaffold one project ─────────────────────────────────────
scaffold() {
  local SLUG="$1"
  local DIR="$BASE/$SLUG"
  mkdir -p "$DIR/src" "$DIR/public"
  echo "✅ Created $SLUG"
}

# ─── Create all folders ────────────────────────────────────────────────
scaffold "Q1_Progress_Bars"
scaffold "Q2_MapAsyncLimit"
scaffold "Q3_Task_Scheduler"
scaffold "Q4_Rate_Limiter"
scaffold "Q5_Priority_Modal"
scaffold "Q6_Overlapping_Circles"
scaffold "Q7_Live_Chat"
scaffold "Q8_File_System"
scaffold "Q9_Google_Calendar"
scaffold "Q10_Collab_UI"

echo ""
echo "📦 Installing dependencies (this may take a few minutes)..."
echo ""

# ─── Install dependencies in each project ─────────────────────────────
for Q in Q1_Progress_Bars Q2_MapAsyncLimit Q3_Task_Scheduler Q4_Rate_Limiter Q5_Priority_Modal Q6_Overlapping_Circles Q7_Live_Chat Q8_File_System Q9_Google_Calendar Q10_Collab_UI; do
  DIR="$BASE/$Q"
  if [ -f "$DIR/package.json" ]; then
    echo "📦 Installing $Q..."
    cd "$DIR"
    npm install --silent
    echo "   ✅ Done"
  fi
done

echo ""
echo "═══════════════════════════════════════════════════════"
echo "  ✅ ALL 10 PROJECTS READY!"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "  To run any project:"
echo "  cd ~/Desktop/Uber_SDE2_Interview/<folder>"
echo "  npm run dev"
echo ""
echo "  Projects:"
echo "  Q1  → Progress Bars with Queue"
echo "  Q2  → mapAsyncLimit"
echo "  Q3  → Task Scheduler"
echo "  Q4  → Rate Limiter"
echo "  Q5  → Priority Modal Manager"
echo "  Q6  → Overlapping Circles"
echo "  Q7  → Live Chat UI"
echo "  Q8  → File System Explorer"
echo "  Q9  → Google Calendar Clone"
echo "  Q10 → Real-time Collaborative UI"
echo ""
