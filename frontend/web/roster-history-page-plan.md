I'll help you design a modern UI/UX for the roster history page. Let me first explore the existing components and design patterns in your codebase to ensure consistency.

[15 tools called]

Now I'll create a comprehensive UI/UX design document for the roster history page based on your application's existing design patterns and modern best practices.

[1 tool called]

Based on my analysis of your codebase, here's a comprehensive UI/UX design for the Roster History page:

# Roster History Page - UI/UX Design Document

## 📋 Overview
A modern, user-friendly interface for viewing, managing, and interacting with historical roster records. The design follows your application's existing design patterns and incorporates modern UX best practices.

---

## 🎨 Visual Layout

### **Page Structure**

```
┌─────────────────────────────────────────────────────────────────┐
│ Breadcrumb: 設定 > 值班表 > 紀錄                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Filter Section                                            │  │
│  │  [組織選擇] [部門選擇] [日期範圍]         [建立新值班表]   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ History Table                                              │  │
│  │ ┌─────────┬──────────┬──────────┬──────────┬────────┐   │  │
│  │ │ 部門    │ 建立時間  │ 建立者   │ 日期範圍  │ 動作   │   │  │
│  │ ├─────────┼──────────┼──────────┼──────────┼────────┤   │  │
│  │ │ 急症室  │ 2025/10/10│ John Doe │ 10/10-   │  [⋮]   │   │  │
│  │ │         │ 14:30    │          │ 10/24    │        │   │  │
│  │ ├─────────┼──────────┼──────────┼──────────┼────────┤   │  │
│  │ │ 內科    │ 2025/10/09│ Jane Li  │ 10/09-   │  [⋮]   │   │  │
│  │ │         │ 09:15    │          │ 10/23    │        │   │  │
│  │ └─────────┴──────────┴──────────┴──────────┴────────┘   │  │
│  │                                                            │  │
│  │ Showing 1-10 of 45 entries      [1][2][3][4][5]...       │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔍 Component Breakdown

### **1. Filter Section**
Located at the top of the page within a `CustomCard` component.

**Components:**
- **Organization Selector** - Dropdown to filter by organization
- **Department Selector** - Dropdown to filter by department (filtered by selected organization)
- **Date Range Picker** - Select date range for created date
- **Search Input** - Quick search by creator name
- **Create New Button** - Link to `/roster/new` page (primary button, right-aligned)

**Features:**
- Auto-filter table results as filters change
- Persist filter state in URL query parameters
- "Clear Filters" button when any filter is active
- Responsive layout: stacks vertically on mobile

```tsx
// Example Filter Component Structure
<CustomCard>
  <FilterLayout button={<CreateRosterButton />}>
    <OrganizationComboBox />
    <DepartmentComboBox />
    <DateRangePicker />
    <CreatorSearchInput />
  </FilterLayout>
</CustomCard>
```

---

### **2. History Table**
Displays all roster history entries with sortable columns.

**Table Columns:**

| Column | Description | Sortable | Features |
|--------|-------------|----------|----------|
| **部門** (Department) | Department name | ✅ | Clickable to filter |
| **建立時間** (Created At) | Timestamp | ✅ | Format: `yyyy/MM/dd HH:mm` |
| **建立者** (Created By) | User who created | ✅ | Shows user name + email on hover |
| **日期範圍** (Date Range) | Roster date span | ✅ | Format: `MM/dd - MM/dd` |
| **班次數** (Schedules) | Number of days | ✅ | Badge with count |
| **動作** (Actions) | Action menu | ❌ | Dropdown menu |

**Table Features:**
- Row hover effect with elevated background
- Clickable rows to quickly view (alternative to action menu)
- Pagination (10, 25, 50, 100 items per page)
- Loading skeleton while fetching
- Empty state with helpful message when no data
- Export to Excel/PDF button (optional)

---

### **3. Actions Menu** (Context Menu)
Accessed via the `⋮` button on each row.

**Menu Items:**

```
┌─────────────────────┐
│ 👁️  檢視 (View)      │  ← Opens in modal/drawer (read-only)
├─────────────────────┤
│ ✏️  編輯 (Edit)      │  ← Opens in edit mode
├─────────────────────┤
│ 📋  複製 (Duplicate) │  ← Creates new with same config
├─────────────────────┤
│ 📄  匯出 (Export)    │  ← Download as PDF/Excel
├─────────────────────┤
│ 🗑️  刪除 (Delete)   │  ← Shows confirmation dialog
└─────────────────────┘
```

**Implementation:**
```tsx
<ContextMenu>
  <ViewDropdownMenuItem onClick={() => openViewModal(id)} />
  <EditDropdownMenuItem href={PATH.roster.history.edit(id)} />
  <DuplicateDropdownMenuItem onClick={() => duplicateRoster(id)} />
  <ExportDropdownMenuItem onClick={() => exportRoster(id)} />
  <DeleteDropdownMenuItem onClick={() => setIsOpenDeleteDialog(true)} />
</ContextMenu>
```

---

## 📱 View Modal/Drawer Design

When user clicks **"檢視"** (View), show roster in a modal or side drawer.

### **Modal Layout:**

```
┌────────────────────────────────────────────────────────┐
│  值班表紀錄 - 急症室 (2025/10/10)            [×]       │
├────────────────────────────────────────────────────────┤
│                                                          │
│  📊 Summary Bar                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │ 建立時間: 2025/10/10 14:30                       │  │
│  │ 建立者: John Doe (john@example.com)              │  │
│  │ 日期範圍: 2025/10/10 - 2025/10/24               │  │
│  │ 班次數: 15 天                                    │  │
│  └─────────────────────────────────────────────────┘  │
│                                                          │
│  🗓️ Roster Schedule Table (Read-Only)                 │
│  ┌──────┬────────┬────────┬────────┬────────┐         │
│  │ 職位 │ 10/10  │ 10/11  │ 10/12  │ 10/13  │ ...    │
│  ├──────┼────────┼────────┼────────┼────────┤         │
│  │ 早班 │ Alice  │ Bob    │ Carol  │ Dave   │ ...    │
│  │ 午班 │ Eve    │ Frank  │ Grace  │ Helen  │ ...    │
│  │ 夜班 │ Ian    │ Jane   │ Kevin  │ Lisa   │ ...    │
│  └──────┴────────┴────────┴────────┴────────┘         │
│                                                          │
│  [匯出 PDF] [匯出 Excel] [編輯] [關閉]                  │
│                                                          │
└────────────────────────────────────────────────────────┘
```

**Features:**
- Scrollable table with fixed header
- Sticky first column (職位)
- Hover shows worker details
- Quick action buttons at bottom
- Responsive: Full screen on mobile

---

## ✏️ Edit Mode Design

When user clicks **"編輯"** (Edit), navigate to a dedicated edit page.

### **URL Pattern:**
```
/roster/history/:historyId/edit
```

### **Layout:**
Similar to `/roster/new` but:
- Pre-populated with existing data
- Show "Last Modified" timestamp
- Ability to save changes (creates new history entry)
- Option to "Save as New" vs "Update"
- Warning if modifying old records

**Action Buttons:**
```
[取消 (Cancel)]  [重置 (Reset)]  [儲存變更 (Save Changes)]
```

---

## 🗑️ Delete Confirmation Dialog

When user clicks **"刪除"** (Delete):

```
┌─────────────────────────────────────────┐
│  ⚠️  確認刪除                            │
├─────────────────────────────────────────┤
│                                           │
│  您確定要刪除此值班表紀錄嗎？              │
│                                           │
│  部門: 急症室                             │
│  日期範圍: 2025/10/10 - 2025/10/24       │
│  建立時間: 2025/10/10 14:30              │
│                                           │
│  ⚠️  此操作無法復原                       │
│                                           │
│  [取消]              [確認刪除]           │
│                                           │
└─────────────────────────────────────────┘
```

**Features:**
- Show key details for confirmation
- Warning message about irreversibility
- Primary action is "Cancel" (safer default)
- Destructive action in red
- Loading state during deletion

---

## 📊 Empty State Design

When no history records exist:

```
┌─────────────────────────────────────────┐
│                                           │
│           📋                              │
│                                           │
│      暫無值班表紀錄                        │
│                                           │
│   開始建立您的第一個值班表                 │
│                                           │
│      [建立新值班表]                        │
│                                           │
└─────────────────────────────────────────┘
```

When filters return no results:

```
┌─────────────────────────────────────────┐
│                                           │
│           🔍                              │
│                                           │
│      找不到符合條件的紀錄                  │
│                                           │
│   嘗試調整篩選條件或清除篩選               │
│                                           │
│      [清除篩選]                           │
│                                           │
└─────────────────────────────────────────┘
```

---

## 🎯 Key UX Principles

### **1. Progressive Disclosure**
- Show essential info in table
- Detailed info in view modal
- Edit mode for modifications

### **2. Visual Hierarchy**
- **Primary Action:** Create New (prominent button)
- **Secondary Actions:** View, Edit (context menu)
- **Destructive Action:** Delete (red, confirmation required)

### **3. Feedback & Confirmation**
- Loading states for all async operations
- Success/error toasts after actions
- Confirmation dialogs for destructive actions

### **4. Performance**
- Lazy load table data with pagination
- Skeleton loaders while fetching
- Optimize re-renders with proper memoization

### **5. Accessibility**
- Keyboard navigation support
- ARIA labels for screen readers
- Focus management in modals
- High contrast for important elements

---

## 🚀 Technical Implementation Notes

### **File Structure:**
```
app/(private)/roster/history/
├── page.tsx                          # Main page
├── [historyId]/
│   ├── page.tsx                      # View detail page
│   └── edit/
│       └── page.tsx                  # Edit page
└── _components/
    ├── filter/
    │   ├── history-filter.tsx
    │   ├── organization-filter-field.tsx
    │   └── department-filter-field.tsx
    ├── table/
    │   ├── history-table-server.tsx
    │   ├── history-table-column.tsx
    │   └── history-table-row-action.tsx
    ├── view/
    │   ├── view-history-modal.tsx
    │   └── history-roster-table.tsx
    └── delete/
        └── delete-history-dialog.tsx
```

### **Data Fetching Strategy:**
- **Server Component** for initial table data
- **Client Component** for filters and interactions
- **React Query/SWR** for caching and revalidation
- **Suspense boundaries** for loading states

### **State Management:**
- URL query params for filters (shareable links)
- Zustand store for modal state
- React Hook Form for edit mode

---

## 📐 Responsive Design

### **Desktop (≥1024px)**
- Full table with all columns visible
- Side-by-side filters
- Modal width: 80% max-width

### **Tablet (768px - 1023px)**
- Collapsible columns (hide less important)
- Stacked filters
- Full-width modal

### **Mobile (<768px)**
- Card-based layout instead of table
- Bottom sheet for filters
- Full-screen modals
- Swipe gestures for actions

**Mobile Card Layout:**
```
┌───────────────────────────────┐
│ 急症室                         │
│ 2025/10/10 14:30             │
│                               │
│ 建立者: John Doe              │
│ 日期範圍: 10/10 - 10/24       │
│ 班次數: 15 天                 │
│                               │
│ [檢視] [編輯] [⋮]             │
└───────────────────────────────┘
```

---

## 🎨 Color & Typography

Following your app's design system:

**Colors:**
- **Primary:** Theme primary color
- **Success:** Green (for saves)
- **Warning:** Yellow (for warnings)
- **Destructive:** Red (for delete)
- **Muted:** Gray (for secondary text)

**Typography:**
- **Headers:** Bold, larger size
- **Body:** Regular weight
- **Meta info:** Smaller, muted color
- **Action labels:** Medium weight

---

## ✅ Success Metrics

**User Experience Goals:**
1. Users can find any historical roster in < 3 clicks
2. View mode loads in < 1 second
3. Zero data loss during edits
4. Clear feedback for all actions
5. Mobile-friendly interaction patterns

---

This design maintains consistency with your existing application patterns while providing a modern, efficient interface for managing roster history. The implementation follows React/Next.js best practices and your established component architecture.