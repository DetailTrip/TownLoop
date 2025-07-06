#!/bin/bash
# TownLoop Migration Script - Phase 1: Create new directory structure

echo "Creating new feature-first directory structure..."

# Create main feature directories
mkdir -p src/features/events/{components,pages,forms,api,map}
mkdir -p src/features/auth/{components,pages,hooks}
mkdir -p src/features/community/{components,pages}
mkdir -p src/features/account/{components,pages,hooks}
mkdir -p src/features/admin/{components,pages,api}
mkdir -p src/features/profile/{components,pages}

# Create shared directories
mkdir -p src/shared/{ui,layout,search,lib,constants,content,styles}
mkdir -p src/shared/lib/{context,supabase,types,utils}

# Create test directory
mkdir -p test

echo "Directory structure created successfully!"
echo "Next: Run migration-phase2.sh to move files"
