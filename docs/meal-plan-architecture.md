# Meal Plan Week View - Visual Architecture

## Component Hierarchy & Responsibilities

```
┌─────────────────────────────────────────────────────────────────┐
│                    MealPlanWeekView                             │
│  (app/(tabs)/meal-plans/meal-plan-week-view.tsx)               │
│                                                                 │
│  Responsibilities:                                              │
│  • Data fetching (meal plan, meals, users, participants)        │
│  • State management (week navigation)                          │
│  • Component composition                                        │
│  • Loading/error states                                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ├─────────────────┐
                              │                 │
                    ┌─────────▼─────────┐  ┌───▼──────────────┐
                    │     TopNav         │  │    MealGrid       │
                    │                    │  │                  │
                    │  Responsibilities: │  │  Responsibilities:│
                    │  • Week navigation │  │  • Grid container│
                    │  • Previous/Next   │  │  • Layout manager│
                    │  • Week label      │  │  • Fixed elements │
                    │  • Boundary checks │  │  • Coordinates    │
                    │                    │  │    header, day,   │
                    └────────────────────┘  │    carousel       │
                                            │                    │
                                            └────────────────────┘
                                                      │
                                                      ├──────────┬──────────┬──────────┐
                                                      │          │          │          │
                                            ┌─────────▼──┐ ┌───▼────┐ ┌───▼────┐    │
                                            │MealGrid    │ │DayColumn│ │WeekCarousel│  │
                                            │Header      │ │         │ │            │  │
                                            │            │ │         │ │            │  │
                                            │Responsibilities:       │ │            │  │
                                            │• Column headers│       │ │            │  │
                                            │• "Day", "Lunch",│      │ │            │  │
                                            │  "Dinner" labels│      │ │            │  │
                                            │• Fixed position│       │ │            │  │
                                            │• z-index: 2    │       │ │            │  │
                                            └────────────┘  │         │ │            │  │
                                                            │         │ │            │  │
                                            Responsibilities:│         │ │            │  │
                                            │• Fixed day     │         │ │            │  │
                                            │  names         │         │ │            │  │
                                            │• Current day   │         │ │            │  │
                                            │  highlighting  │         │ │            │  │
                                            │• z-index: 2    │         │ │            │  │
                                            │• Fixed position│         │ │            │  │
                                            └────────────────┘         │ │            │  │
                                                                       │ │            │  │
                                                                       │ │            │  │
                                            Responsibilities:          │ │            │  │
                                            │• Frame-based    │        │ │            │  │
                                            │  carousel (3    │        │ │            │  │
                                            │  weeks)         │        │ │            │  │
                                            │• Swipe gestures │        │ │            │  │
                                            │• Animation      │        │ │            │  │
                                            │• Width measure  │        │ │            │  │
                                            │• z-index: 1     │        │ │            │  │
                                            └─────────────────┘        │ │            │  │
                                                                       │ │            │  │
                                                                       └─┴────────────┘  │
                                                                                         │
                                                                                         │
                                                                       ┌─────────────────▼──────────────┐
                                                                       │      Animated.View (Carousel)    │
                                                                       │      • 3 WeekFrame components    │
                                                                       │      • translateX animation       │
                                                                       └──────────────────────────────────┘
                                                                    │
                                                                    │
                                            ┌──────────────────────────────────────────┐
                                            │      Animated.View (Carousel Container)   │
                                            │      • 3 frames side-by-side              │
                                            │      • translateX animation               │
                                            │      • width: MEAL_AREA_WIDTH * 3         │
                                            └──────────────────────────────────────────┘
                                                      │
                                                      ├──────────┬──────────┬──────────┐
                                                      │          │          │          │
                                            ┌─────────▼──┐ ┌───▼────┐ ┌───▼────┐    │
                                            │ WeekFrame  │ │WeekFrame│ │WeekFrame│    │
                                            │ (Previous) │ │(Current)│ │ (Next)  │    │
                                            │            │ │         │ │         │    │
                                            │ Week: -1    │ │ Week: 0 │ │ Week: +1│    │
                                            └────────────┘ └─────────┘ └─────────┘    │
                                                      │          │          │          │
                                                      └──────────┴──────────┴──────────┘
                                                                    │
                                                                    │
                                            ┌──────────────────────────────────────────┐
                                            │         MealRowCells (7 rows)             │
                                            │         (One per day of week)             │
                                            │                                           │
                                            │  Responsibilities:                         │
                                            │  • Render lunch & dinner cells             │
                                            │  • No day column (separate component)     │
                                            │  • Meal data display                      │
                                            └──────────────────────────────────────────┘
                                                      │
                                                      ├──────────┬──────────┐
                                                      │          │          │
                                            ┌─────────▼──┐ ┌───▼──────┐   │
                                            │  MealCell  │ │ MealCell │   │
                                            │  (Lunch)    │ │ (Dinner) │   │
                                            │            │ │          │   │
                                            │  Props:     │ │  Props:  │   │
                                            │  • meal     │ │  • meal  │   │
                                            │  • chef     │ │  • chef  │   │
                                            │  • notEating│ │  • notEat│   │
                                            └────────────┘ └──────────┘   │
                                                                    │
                                                                    │
                    ┌───────────────────────────────────────────────▼──────┐
                    │              ParticipantsBar                          │
                    │                                                      │
                    │  Responsibilities:                                   │
                    │  • Display participant avatars                      │
                    │  • Settings button                                  │
                    │  • Fixed at bottom                                  │
                    └──────────────────────────────────────────────────────┘
```

## Visual Layout Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Screen Container                              │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │                      TopNav (Fixed)                            │ │
│  │  [◄ Previous]  [Nov 11 - Nov 17, 2024]  [Next ►]              │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │                        MealGrid                                  │ │
│  │  (Container for all grid-related components)                     │ │
│  │                                                                 │ │
│  │  ┌───────────────────────────────────────────────────────────┐ │ │
│  │  │              MealGridHeader (Fixed)                        │ │ │
│  │  │  ┌──────┐  ┌──────────────────────────────────────────┐  │ │ │
│  │  │  │ Day  │  │    Lunch          │        Dinner         │  │ │ │
│  │  │  └──────┘  └──────────────────────────────────────────┘  │ │ │
│  │  └───────────────────────────────────────────────────────────┘ │ │
│  │                                                                 │ │
│  │  ┌───────────────────────────────────────────────────────────┐ │ │
│  │  │              Grid Content Area (Flex: 1)                   │ │ │
│  │  │                                                           │ │ │
│  │  │  ┌──────┐  ┌──────────────────────────────────────────┐  │ │ │
│  │  │  │ Mon  │  │  ┌──────────┐  ┌──────────┐  ┌────────┐│  │ │ │
│  │  │  │      │  │  │  Frame   │  │  Frame   │  │  Frame  ││  │ │ │
│  │  │  │      │  │  │  (Prev)  │  │ (Current)│  │  (Next) ││  │ │ │
│  │  │  │      │  │  │          │  │          │  │         ││  │ │ │
│  │  │  │      │  │  │ [Lunch]  │  │ [Lunch]  │  │ [Lunch] ││  │ │ │
│  │  │  │      │  │  │ [Dinner] │  │ [Dinner] │  │ [Dinner]││  │ │ │
│  │  │  └──────┘  │  └──────────┘  └──────────┘  └────────┘│  │ │ │
│  │  │  │ Tue  │  │         ↑                              │  │ │ │
│  │  │  │      │  │         │ Animated (translateX)       │  │ │ │
│  │  │  │      │  │         │                              │  │ │ │
│  │  │  │      │  │  [Lunch] [Dinner] (Current visible)   │  │ │ │
│  │  │  └──────┘  └──────────────────────────────────────────┘  │ │ │
│  │  │  │ Wed  │                                                 │ │ │
│  │  │  │      │                                                 │ │ │
│  │  │  │      │                                                 │ │ │
│  │  │  └──────┘                                                 │ │ │
│  │  │  │ Thu  │                                                 │ │ │
│  │  │  │      │                                                 │ │ │
│  │  │  │      │                                                 │ │ │
│  │  │  └──────┘                                                 │ │ │
│  │  │  │ Fri  │                                                 │ │ │
│  │  │  │      │                                                 │ │ │
│  │  │  │      │                                                 │ │ │
│  │  │  └──────┘                                                 │ │ │
│  │  │  │ Sat  │                                                 │ │ │
│  │  │  │      │                                                 │ │ │
│  │  │  │      │                                                 │ │ │
│  │  │  └──────┘                                                 │ │ │
│  │  │  │ Sun  │                                                 │ │ │
│  │  │  │      │                                                 │ │ │
│  │  │  │      │                                                 │ │ │
│  │  │  └──────┘                                                 │ │ │
│  │  │                                                           │ │ │
│  │  │  DayColumn (Fixed, z-index: 2) │ WeekCarousel (Animated, z-index: 1)│ │ │
│  │  └───────────────────────────────────────────────────────────┘ │ │
│  │                                                                 │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │                  ParticipantsBar (Fixed)                        │ │
│  │  [👤] [👤] [👤] [+2]                    [⚙️ Settings]           │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

## Z-Index Hierarchy (Visual Layering)

```
Layer 3 (Top)
┌─────────────────────────────────────┐
│  TopNav                             │
│  ParticipantsBar                    │
│  MealGridHeader                     │
│  DayColumn                          │
│  (z-index: 2, fixed position)       │
└─────────────────────────────────────┘
         │
         │ (behind)
         ▼
Layer 2 (Middle)
┌─────────────────────────────────────┐
│  Animated.View (Carousel Container) │
│  • 3 WeekFrame components           │
│  • translateX animation             │
│  (z-index: 1, animated)             │
└─────────────────────────────────────┘
         │
         │ (contains)
         ▼
Layer 1 (Bottom)
┌─────────────────────────────────────┐
│  MealRowCells                       │
│  MealCell components                │
│  (z-index: 0, static within frame)  │
└─────────────────────────────────────┘
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Data Sources                                  │
│                                                                 │
│  • getMealPlan(mealPlanId)                                     │
│  • getMeals({ meal_plan_id })                                   │
│  • getUsers()                                                   │
│  • getParticipants(mealPlanId)                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              MealPlanWeekView (Data Processing)                  │
│                                                                 │
│  • Filters meals by week (mealsByDateAndType Map)               │
│  • Maps participants to users (participantUsers)                │
│  • Manages currentWeekStart state                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ├──────────────────┐
                              │                  │
                              ▼                  ▼
┌─────────────────────┐  ┌─────────────────────────────────────┐
│   TopNav            │  │   WeekCarousel                       │
│                     │  │                                      │
│  Props:             │  │  Props:                             │
│  • currentWeekStart │  │  • currentWeekStart                 │
│  • canGoPrevious    │  │  • meals (all meals, not filtered) │
│  • canGoNext        │  │  • users                            │
│  • weekLabel        │  │                                      │
│                     │  │  Internal:                          │
│  Actions:           │  │  • Calculates 3 weeks (prev/curr/next)│
│  • onPrevious       │  │  • Creates mealsByDateAndType Map     │
│  • onNext           │  │  • Measures meal area width         │
└─────────────────────┘  └─────────────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │      WeekFrame (x3)           │
                    │                               │
                    │  Props:                       │
                    │  • weekStart (Date)           │
                    │  • mealsByDateAndType (Map)   │
                    │  • users                      │
                    │                               │
                    │  Internal:                    │
                    │  • Filters meals for this week│
                    │  • Maps chefs & notEating     │
                    └───────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │    MealRowCells (x7)          │
                    │                               │
                    │  Props:                       │
                    │  • lunchMeal, dinnerMeal     │
                    │  • lunchChef, dinnerChef      │
                    │  • lunchNotEating, dinnerNotEat│
                    └───────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │    MealCell (x14 per frame)    │
                    │                               │
                    │  Displays:                     │
                    │  • Meal title                  │
                    │  • Chef avatar                 │
                    │  • Not-eating users            │
                    └───────────────────────────────┘
```

## Component Responsibilities Summary

### MealPlanWeekView
- **Data Management**: Fetches all data (meal plan, meals, users, participants)
- **State Management**: Manages `currentWeekStart` via `useWeekNavigation` hook
- **Data Processing**: Creates `mealsByDateAndType` map, maps participants to users
- **Composition**: Assembles TopNav, MealGrid, and ParticipantsBar

### MealGrid
- **Grid Container**: Wraps all grid-related components (header, day column, carousel)
- **Layout Coordination**: Manages the layout relationship between fixed and animated elements
- **Spacing Management**: Handles padding, gaps, and positioning
- **Visual Hierarchy**: Ensures proper z-index layering (header/day on top, carousel below)

### TopNav
- **Navigation UI**: Previous/Next buttons, week label
- **Boundary Logic**: Disables buttons at meal plan boundaries
- **Fixed Position**: Stays at top, doesn't scroll

### WeekCarousel
- **Frame Management**: Pre-renders 3 weeks (previous, current, next)
- **Animation**: Handles swipe gestures and translateX animations
- **Width Measurement**: Uses `onLayout` to measure actual meal area width
- **Gesture Handling**: Pan gestures for swipe left/right
- **Focused Responsibility**: Only handles the animated carousel, not layout/header concerns

### DayColumn
- **Fixed Display**: Shows day names (Mon-Sun) for current week
- **Visual Hierarchy**: z-index 2, fixed position, covers full height
- **Styling**: Highlights current day (bold, uppercase)

### MealGridHeader
- **Column Headers**: "Day", "Lunch", "Dinner" labels
- **Fixed Position**: Stays at top, doesn't scroll

### WeekFrame
- **Week Rendering**: Renders one week's meal cells
- **Data Filtering**: Filters meals for specific week from mealsByDateAndType
- **User Mapping**: Maps meal chef_id and not_eating_users to User objects

### MealRowCells
- **Row Rendering**: Renders lunch and dinner cells for one day
- **No Day Column**: Day name is handled separately by DayColumn

### MealCell
- **Meal Display**: Shows meal title, chef avatar, not-eating users
- **Empty State**: Shows "Empty" when no meal exists
- **Interactive**: Handles press events

### ParticipantsBar
- **Participant Display**: Shows participant avatars (max 5 visible)
- **Settings**: Settings button
- **Fixed Position**: Stays at bottom

## Animation Flow

```
User Swipes Right (Previous Week)
│
├─► GestureDetector detects Pan gesture
│   ├─► onUpdate: translateX.value = clamped(translationX)
│   └─► onEnd: Check velocity/threshold
│
├─► handlePreviousWeek() called
│   ├─► Haptic feedback
│   ├─► translateX.value = withSpring(MEAL_AREA_WIDTH)
│   │   └─► Animated.View slides right
│   │
│   └─► Animation callback:
│       ├─► onWeekChange('prev') → updateWeekState('prev')
│       ├─► translateX.value = 0 (reset)
│       └─► WeekFrame components re-render with new weeks
│
└─► Result: Smooth transition to previous week
```

## Key Design Decisions

1. **Frame-Based Carousel**: Pre-renders 3 weeks to eliminate jitter during animation
2. **Fixed Day Column**: Day names stay fixed while meals slide, similar to Google Calendar
3. **Width Measurement**: Uses `onLayout` instead of calculated widths for accuracy
4. **Z-Index Layering**: Fixed elements (day column, header) on top, animated content below
5. **Data Pre-loading**: All meals loaded upfront, filtered per frame
6. **Component Separation**: Day column separate from meal cells for independent animation
7. **MealGrid Container**: Groups all grid-related components for better organization and layout coordination

---

## Proposed Architecture Change: Analysis

### Current Structure
```
MealPlanWeekView
├── TopNav
├── WeekCarousel
│   ├── MealGridHeader
│   ├── DayColumn
│   └── Animated.View (carousel)
└── ParticipantsBar
```

### Proposed Structure
```
MealPlanWeekView
├── TopNav
├── MealGrid
│   ├── MealGridHeader
│   ├── DayColumn
│   └── WeekCarousel
│       └── Animated.View (carousel)
└── ParticipantsBar
```

### Pros ✅

1. **Better Semantic Organization**
   - `MealGrid` clearly represents the entire grid system
   - All grid-related components are grouped logically
   - Easier to understand component relationships

2. **Improved Separation of Concerns**
   - `WeekCarousel` focuses solely on animation/carousel logic
   - `MealGrid` handles layout coordination between fixed and animated elements
   - Clearer responsibility boundaries

3. **Easier Layout Management**
   - `MealGrid` can manage padding, spacing, and layout for all grid components
   - Single source of truth for grid layout calculations
   - Easier to adjust spacing between header, day column, and carousel

4. **Better Component Reusability**
   - `MealGrid` could be reused in other contexts (month view, etc.)
   - `WeekCarousel` is more focused and reusable independently
   - Clearer component boundaries

5. **Simplified Props Flow**
   - `MealGrid` receives layout-related props once
   - Props don't need to be passed through `WeekCarousel` to reach header/day column
   - Cleaner prop drilling

6. **Easier Testing**
   - Can test `MealGrid` layout independently
   - `WeekCarousel` can be tested in isolation
   - Clearer test boundaries

### Cons ❌

1. **Additional Component Layer**
   - Adds one more component to the tree
   - Slight performance overhead (minimal, but exists)
   - More files to maintain

2. **Potential Prop Drilling**
   - `MealGrid` might need to pass props to `WeekCarousel`
   - Need to ensure props flow correctly through the new layer
   - Could complicate prop interfaces

3. **Refactoring Effort**
   - Need to move `MealGridHeader` and `DayColumn` out of `WeekCarousel`
   - Update all imports and exports
   - Test thoroughly to ensure nothing breaks

4. **Width Calculation Complexity**
   - `WeekCarousel` still needs to measure width, but now `MealGrid` controls layout
   - Need to ensure width measurement works correctly with new structure
   - May need to coordinate between `MealGrid` and `WeekCarousel` for width

5. **Initial Complexity**
   - Slightly more complex component tree
   - Developers need to understand the new layer
   - More indirection in component hierarchy

### Recommendation 💡

**✅ PROCEED with the change** - The pros significantly outweigh the cons:

1. **Better Architecture**: The proposed structure is more semantically correct and follows better component design principles
2. **Maintainability**: Clearer separation of concerns will make the codebase easier to maintain
3. **Scalability**: If you need to add more grid-related features (e.g., month view, filters), `MealGrid` provides a natural extension point
4. **Code Clarity**: The component hierarchy will be more intuitive for new developers

### Implementation Considerations

1. **Width Measurement**: Ensure `WeekCarousel` can still measure its width correctly when nested in `MealGrid`
2. **Props Interface**: Design `MealGrid` props carefully to avoid unnecessary prop drilling
3. **Layout Calculations**: Move layout-related calculations (padding, spacing) to `MealGrid`
4. **Z-Index Management**: Ensure z-index values are still correct with the new structure
5. **Testing**: Test thoroughly, especially the animation and layout coordination

