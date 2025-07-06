```
src/
├── features/
│   ├── events/
│   │   ├── components/
│   │   │   ├── CategoryFilter.tsx
│   │   │   ├── EventCard.tsx
│   │   │   ├── EventComments.tsx
│   │   │   ├── EventDetail.tsx
│   │   │   ├── FavoriteButton.tsx
│   │   │   ├── RelatedEvents.tsx
│   │   │   ├── ShareButton.tsx
│   │   │   └── UpcomingEvents.tsx
│   │   ├── pages/
│   │   │   ├── events/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [eventId]/
│   │   │   │       └── page.tsx
│   │   │   └── submit/
│   │   │       └── page.tsx
│   │   ├── forms/
│   │   │   ├── SubmitEventForm.tsx
│   │   │   └── TagSelector.tsx
│   │   ├── api/
│   │   │   ├── flyers/
│   │   │   │   └── route.ts
│   │   │   └── test-events/
│   │   │       └── route.ts
│   │   ├── map/
│   │   │   └── EventMap.tsx
│   │   └── types.ts
│   ├── auth/
│   │   ├── components/
│   │   ├── pages/
│   │   │   └── auth/
│   │   │       └── page.tsx
│   │   ├── hooks/
│   │   └── types.ts
│   ├── community/
│   │   ├── components/
│   │   │   ├── CommunityHub.tsx
│   │   │   ├── CommunityHubSimple.tsx
│   │   │   ├── EditorialSpotlight.tsx
│   │   │   └── SpottedFlyers.tsx
│   │   ├── pages/
│   │   │   ├── community/
│   │   │   │   └── page.tsx
│   │   │   └── t/
│   │   │       └── [townSlug]/
│   │   │           └── page.tsx
│   │   └── types.ts
│   ├── account/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── my-events/
│   │   │   │   ├── page.tsx
│   │   │   │   └── edit/
│   │   │   │       └── [eventId]/
│   │   │   │           └── page.tsx
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── hooks/
│   │   └── types.ts
│   ├── admin/
│   │   ├── components/
│   │   │   ├── ActivityLogs.tsx
│   │   │   ├── AdminAlerts.tsx
│   │   │   ├── AnalyticsCharts.tsx
│   │   │   ├── BulkEventOperations.tsx
│   │   │   ├── PlatformSettings.tsx
│   │   │   ├── SystemMetrics.tsx
│   │   │   └── UserManagement.tsx
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   └── page.tsx
│   │   │   └── partners/
│   │   │       └── page.tsx
│   │   ├── api/
│   │   │   └── debug-db-schema/
│   │   │       └── route.ts
│   │   └── types.ts
│   └── profile/
│       ├── components/
│       ├── pages/
│       │   └── profile/
│       │       └── [username]/
│       │           └── page.tsx
│       └── types.ts
├── shared/
│   ├── ui/
│   │   ├── DateInput.tsx
│   │   ├── SelectInput.tsx
│   │   ├── Spinner.tsx
│   │   ├── TextAreaInput.tsx
│   │   ├── TextInput.tsx
│   │   └── TimeInput.tsx
│   ├── layout/
│   │   ├── Breadcrumb.tsx
│   │   ├── CardGrid.tsx
│   │   ├── ClientLayout.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── HeaderWithImprovedSelector.tsx
│   │   ├── Hero.tsx
│   │   ├── ImprovedTownSelector.tsx
│   │   ├── MobileBottomNav.tsx
│   │   ├── MobileFloatingAction.tsx
│   │   ├── MobileTownSelector.tsx
│   │   ├── TestTownSelector.tsx
│   │   └── TownSelector.tsx
│   ├── search/
│   │   └── SearchModal.tsx
│   ├── lib/
│   │   ├── context/
│   │   │   └── UserContext.tsx
│   │   ├── supabase/
│   │   │   └── client.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   └── index.ts
│   │   └── database.types.ts
│   ├── constants/
│   │   ├── categories.ts
│   │   ├── gamification.ts
│   │   ├── index.ts
│   │   ├── tags.ts
│   │   ├── towns.ts
│   │   └── vibes.ts
│   ├── content/
│   │   ├── sponsoredHighlights.ts
│   │   └── spotlightEvents.ts
│   └── styles/
│       └── globals.css
├── app/
│   ├── (dashboards)/
│   │   └── layout.tsx
│   ├── (main)/
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   ├── privacy/
│   │   │   └── page.tsx
│   │   ├── terms/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── globals.css (remove - empty)
│   └── layout.tsx
├── public/
│   ├── icons/
│   └── images/
├── scripts/
│   └── seed-events.js
├── supabase/
│   └── migrations/
└── test/
    ├── HydrationTest.tsx
    └── UserTest.tsx
```

## Key Changes in This Structure:

1. **Features are self-contained**: Each feature has its own components, pages, API routes, and types.
2. **Shared code is clearly separated**: UI components, layout, constants, and utilities are in the `shared/` folder.
3. **Cleaner app/ directory**: Only contains routing structure and static pages.
4. **Empty folders removed**: auth/, modals/, db/, hooks/, openai/ folders that were empty.
5. **Test components moved**: To a dedicated test/ folder at the root.

## Next Steps:

1. **Path Aliases Update**: Update tsconfig.json to include paths for `@/features/*` and `@/shared/*`
2. **File Migration**: Move files to their new locations
3. **Import Updates**: Update all import statements throughout the codebase
4. **Testing**: Verify everything works correctly

Would you like me to proceed with creating the migration scripts and updated configurations?
