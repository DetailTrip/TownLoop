#!/bin/bash
# TownLoop Migration Script - Phase 3: Update import statements

echo "Updating import statements throughout the codebase..."

# Function to update imports in a file
update_imports() {
    local file="$1"
    
    # Update component imports
    sed -i "s|@/components/events/|@/features/events/components/|g" "$file"
    sed -i "s|@/components/community/|@/features/community/components/|g" "$file"
    sed -i "s|@/components/admin/|@/features/admin/components/|g" "$file"
    sed -i "s|@/components/forms/|@/features/events/forms/|g" "$file"
    sed -i "s|@/components/map/|@/features/events/map/|g" "$file"
    sed -i "s|@/components/ui/|@/shared/ui/|g" "$file"
    sed -i "s|@/components/layout/|@/shared/layout/|g" "$file"
    sed -i "s|@/components/search/|@/shared/search/|g" "$file"
    
    # Update lib imports
    sed -i "s|@/lib/context/|@/shared/lib/context/|g" "$file"
    sed -i "s|@/lib/supabase/|@/shared/lib/supabase/|g" "$file"
    sed -i "s|@/lib/types/|@/shared/lib/types/|g" "$file"
    sed -i "s|@/lib/utils/|@/shared/lib/utils/|g" "$file"
    sed -i "s|@/lib/database.types|@/shared/lib/database.types|g" "$file"
    
    # Update constants imports
    sed -i "s|@/constants|@/shared/constants|g" "$file"
    
    echo "Updated imports in: $file"
}

# Find all TypeScript/JavaScript files and update their imports
find src/ app/ -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" | while read file; do
    update_imports "$file"
done

# Update test files
find test/ -name "*.tsx" -o -name "*.ts" | while read file; do
    update_imports "$file"
done

echo "Import statements updated successfully!"
echo "Next: Update tsconfig.json path aliases"
