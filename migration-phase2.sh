#!/bin/bash
# TownLoop Migration Script - Phase 2: Move files to new locations

echo "Moving files to new feature-first structure..."

# Move Events feature files
mv components/events/* src/features/events/components/
mv components/map/* src/features/events/map/
mv components/forms/* src/features/events/forms/
mv app/api/flyers src/features/events/api/
mv app/api/test-events src/features/events/api/
mv app/\(main\)/events src/features/events/pages/
mv app/\(main\)/submit src/features/events/pages/

# Move Auth feature files
mv app/auth src/features/auth/pages/

# Move Community feature files  
mv components/community/* src/features/community/components/
mv app/\(main\)/community src/features/community/pages/
mv app/\(main\)/t src/features/community/pages/

# Move Account feature files
mv app/account/* src/features/account/pages/

# Move Admin feature files
mv components/admin/* src/features/admin/components/
mv app/\(dashboards\)/admin src/features/admin/pages/
mv app/\(dashboards\)/partners src/features/admin/pages/
mv app/api/debug-db-schema src/features/admin/api/

# Move Profile feature files
mv app/\(main\)/profile src/features/profile/pages/

# Move Shared files
mv components/ui/* src/shared/ui/
mv components/layout/* src/shared/layout/
mv components/search/* src/shared/search/
mv lib/* src/shared/lib/
mv constants/* src/shared/constants/
mv content/* src/shared/content/
mv styles/* src/shared/styles/

# Move Test files
mv components/test/* test/

# Clean up empty directories
rmdir components/events components/map components/forms components/community
rmdir components/admin components/ui components/layout components/search components/test
rmdir components/auth components/modals
rmdir components
rmdir lib/context lib/db lib/hooks lib/openai lib/supabase lib/types lib/utils
rmdir lib
rmdir constants content styles

echo "File migration completed!"
echo "Next: Run migration-phase3.sh to update imports"
