#!/bin/bash
# TownLoop Migration Script - Complete Migration

echo "🚀 Starting TownLoop Feature-First Migration..."
echo "================================================"

# Check if git is available and repo is clean
if command -v git &> /dev/null; then
    if [ -n "$(git status --porcelain)" ]; then
        echo "⚠️  Warning: You have uncommitted changes. Please commit or stash them first."
        echo "Run: git status"
        exit 1
    fi
    
    echo "📝 Creating migration branch..."
    git checkout -b feature-first-migration
fi

echo "📁 Phase 1: Creating directory structure..."
chmod +x migration-phase1.sh
./migration-phase1.sh

echo "📦 Phase 2: Moving files..."
chmod +x migration-phase2.sh
./migration-phase2.sh

echo "🔧 Phase 3: Updating imports..."
chmod +x migration-phase3.sh
./migration-phase3.sh

echo "⚙️  Phase 4: Updating configurations..."
# Backup original tsconfig
cp tsconfig.json tsconfig-backup.json
cp tsconfig-new.json tsconfig.json

# Remove empty app/globals.css since it's empty
rm -f app/globals.css

echo "🧹 Phase 5: Cleanup..."
# Remove migration scripts
rm -f migration-phase1.sh migration-phase2.sh migration-phase3.sh tsconfig-new.json

echo "✅ Migration completed successfully!"
echo "================================================"
echo "🔍 Next steps:"
echo "1. Test your application: npm run dev"
echo "2. Run your test suite if you have one"
echo "3. Check for any remaining import issues"
echo "4. Commit changes: git add . && git commit -m 'Migrate to feature-first structure'"
echo ""
echo "📋 If there are issues:"
echo "- Check MIGRATION_PLAN.md for manual fixes"
echo "- Restore backup: cp tsconfig-backup.json tsconfig.json"
echo "- Rollback: git checkout main && git branch -D feature-first-migration"
