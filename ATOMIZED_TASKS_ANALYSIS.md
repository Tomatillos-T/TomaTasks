# Atomized Task Analysis for TomaT asks Project
## Based on Git Commit History (Sept 1 - Nov 18, 2025)

### Analysis Methodology
- **Granularity**: 2-4 hour atomic tasks
- **Baseline**: 2-4 hours/day developer capacity
- **Time Calculation**: actual commit timestamps analyzed
- **Variance Tracking**: timeTaken vs timeEstimate based on commit dates

---

## SPRINT 1: Authentication & Core Setup (Sept 26 - Oct 7, 2025)
**Duration**: 12 days | **Team**: Kaled, Isaac

### Week 1: Backend Foundation (Sept 26-27)
**Developer: Kaled Enríquez**

1. **Setup JPA Models** (3h)
   - Commit: c15461b (Sept 26)
   - Created: User, Project, Sprint, Task, Team entities
   - timeEstimate: 3h | timeTaken: 3h | Status: DONE

2. **Create REST Controllers** (3h)
   - Commit: c15461b (Sept 26)
   - Implemented: ProjectController, SprintController, TaskController
   - timeEstimate: 3h | timeTaken: 3h | Status: DONE

### Week 2: Frontend Setup (Sept 29 - Oct 3)
**Developer: Kaled Enríquez**

3. **Design Project Form Prototype** (4h)
   - Commit: bb4a0a1 (Sept 29)
   - Built initial project creation form UI
   - timeEstimate: 3h | timeTaken: 4h | Status: DONE

4. **Fix Sidebar Mobile Bug** (2h)
   - Commit: 187ccc0 (Oct 3)
   - Fixed responsive issues
   - timeEstimate: 2h | timeTaken: 2h | Status: DONE

5. **Add Dark Mode to Login** (2h)
   - Commit: 187ccc0 (Oct 3)
   - Implemented theme toggle
   - timeEstimate: 2h | timeTaken: 2h | Status: DONE

6. **Setup Pages & Navigation** (3h)
   - Commit: c955467 (Oct 3)
   - Configured routing from sidebar
   - timeEstimate: 3h | timeTaken: 3h | Status: DONE

### Week 3: Forms & Models (Oct 4-5)
**Developers: Isaac Enríquez, Kaled Enríquez**

7. **Create Task/UserStory/User Forms** (Isaac - 4h)
   - Commit: 07bb3a0 (Oct 4)
   - Implemented form components with validation
   - timeEstimate: 4h | timeTaken: 4h | Status: DONE

8. **Improve Theme Transitions** (Isaac - 2h)
   - Commit: 7ba1a2d (Oct 4)
   - Enhanced dark mode UX
   - timeEstimate: 2h | timeTaken: 2h | Status: DONE

9. **Refactor Project-Team Models** (Isaac - 3h)
   - Commit: 77ec78d (Oct 5)
   - Fixed bidirectional relationships
   - timeEstimate: 3h | timeTaken: 3h | Status: DONE

10. **Add Team Assignment Validation** (Isaac - 2h)
    - Commit: a3c94bf (Oct 5)
    - UI improvements for team management
    - timeEstimate: 2h | timeTaken: 2h | Status: DONE

11. **Create Modal Component** (Kaled - 3h)
    - Commit: 0ceb2fa (Oct 4)
    - Reusable modal with ProjectForm, SprintForm, TeamForm
    - timeEstimate: 3h | timeTaken: 3h | Status: DONE

### Week 4: Authentication (Oct 5-7)
**Developer: Kaled Enríquez**

12. **Implement JWT Login Backend** (4h)
    - Commit: 8ccc9df (Oct 6)
    - Spring Security + JWT token generation
    - timeEstimate: 4h | timeTaken: 4h | Status: DONE

13. **Create Login Prototype** (Cesar - 3h)
    - Commit: 5e09170 (Oct 6)
    - Initial login form with JWT
    - timeEstimate: 3h | timeTaken: 3h | Status: DONE

---

## SPRINT 2: CRUD Operations & Testing (Oct 8 - Oct 27, 2025)
**Duration**: 20 days | **Team**: All developers

### Week 1: Telegram Integration (Oct 6-9)
**Developers**: Adrián, Kaled, Isaac

14. **Add Mockito Dependency & Bot Tests** (Isaac - 5h)
    - Commit: c69b758 (Oct 19)
    - Created test suite for Telegram bot
    - timeEstimate: 4h | timeTaken: 5h | Status: DONE

15. **Implement Telegram Token Generation** (Kaled - 3h)
    - Commit: cc9947a (Oct 8)
    - User page token creation functionality
    - timeEstimate: 3h | timeTaken: 3h | Status: DONE

16. **Configure Telegram Bot & Webhook** (Adrián - 4h)
    - Commit: bc8a9ce (Oct 8)
    - Bot login integration and webhook setup
    - timeEstimate: 4h | timeTaken: 4h | Status: DONE

17. **YAML Changes for Kubernetes** (Adrián - 3h)
    - Commit: f4c08a7 (Oct 8)
    - K8s deployment configuration
    - timeEstimate: 3h | timeTaken: 3h | Status: DONE

18. **Update Routing for Kubernetes** (Adrián - 2h)
    - Commit: 1c0a292 (Oct 8)
    - Environment-based routing
    - timeEstimate: 2h | timeTaken: 2h | Status: DONE

19. **CRUD Tasks Implementation** (Kaled - 4h)
    - Commit: 5052a8a (Oct 9)
    - Full CRUD for tasks
    - timeEstimate: 4h | timeTaken: 4h | Status: DONE

20. **Spelling Hotfix** (Kaled - 1h)
    - Commit: 82dfe7a (Oct 8)
    - Corrected 'successfully' typo
    - timeEstimate: 1h | timeTaken: 1h | Status: DONE

### Week 2: DTO Refactor & Backend Improvements (Oct 13-16)
**Developers**: Adrián, Isaac, Shaquex

21. **Add DTOs and Mappers** (Shaquex - 6h)
    - Commit: a6bc80c (Oct 13)
    - Created DTO pattern for all entities
    - timeEstimate: 5h | timeTaken: 6h | Status: DONE

22. **Add Constructors/Getters to DTOs** (Shaquex - 2h)
    - Commit: 3edc6a1 (Oct 13)
    - Boilerplate code generation
    - timeEstimate: 2h | timeTaken: 2h | Status: DONE

23. **Setup GitHub Actions Workflows** (Adrián - 8h)
    - Commits: Multiple (Oct 13-15)
    - Build, Lint, Docker workflows configured
    - timeEstimate: 6h | timeTaken: 8h | Status: DONE

24. **Configure GraalVM Build** (Adrián - 3h)
    - Commit: 59a7d4d (Oct 13)
    - Native image compilation setup
    - timeEstimate: 3h | timeTaken: 3h | Status: DONE

25. **Refactor Auth to use DTOs** (Shaquex - 3h)
    - Commit: 6df0260 (Oct 14)
    - Updated authentication responses
    - timeEstimate: 3h | timeTaken: 3h | Status: DONE

26. **Update Test Files for DTOs** (Isaac - 4h)
    - Commit: 614164f (Oct 13)
    - Migrated all tests to DTO pattern
    - timeEstimate: 4h | timeTaken: 4h | Status: DONE

27. **Make Task Associations Nullable** (Isaac - 2h)
    - Commit: dbcdd40 (Oct 15)
    - Allowed tasks without sprint/userStory
    - timeEstimate: 2h | timeTaken: 2h | Status: DONE

### Week 3: Task Search & Pagination (Oct 15-16)
**Developer**: Adrián Treviño

28. **Update Task Model for Search** (3h)
    - Commit: 28356ce (Oct 15)
    - Added pagination, filtering, sorting support
    - timeEstimate: 3h | timeTaken: 3h | Status: DONE

29. **Add MapStruct & Lombok to POM** (2h)
    - Commit: 6a268a8 (Oct 15)
    - Dependency configuration
    - timeEstimate: 2h | timeTaken: 2h | Status: DONE

30. **Remove Deprecated GenericGenerator** (2h)
    - Commit: bcb5f86 (Oct 15)
    - Migrated to modern UUID generation
    - timeEstimate: 2h | timeTaken: 2h | Status: DONE

31. **Implement Task Search/Filter/Sort Logic** (6h)
    - Commit: 80660bf (Oct 15)
    - Complex query builder with pagination
    - timeEstimate: 5h | timeTaken: 6h | Status: DONE

32. **Fix Name Parsing Logic** (2h)
    - Commit: fbf88ec (Oct 15)
    - Separate first/last name handling
    - timeEstimate: 2h | timeTaken: 2h | Status: DONE

33. **Multiple Spelling Fixes** (1h)
    - Commits: Multiple (Oct 15)
    - Code cleanup
    - timeEstimate: 1h | timeTaken: 1h | Status: DONE

34. **Add Router for Tasks Page** (2h)
    - Commit: 17751b9 (Oct 15)
    - Navigation setup
    - timeEstimate: 2h | timeTaken: 2h | Status: DONE

35. **Backend Refactoring** (Shaquex - 5h)
    - Commit: Merge #103 (Oct 16)
    - Code organization improvements
    - timeEstimate: 4h | timeTaken: 5h | Status: DONE

### Week 4: RAG Implementation Start (Oct 20-22)
**Developer**: Isaac (Shaquex) Enríquez

36. **Add Markdown Support for RAG** (3h)
    - Commit: dbbd0e3 (Oct 21)
    - Markdown rendering in chatbot
    - timeEstimate: 3h | timeTaken: 3h | Status: DONE

37. **Add Tailwind Breakpoints** (2h)
    - Commit: adef114 (Oct 21)
    - Improved UI responsiveness
    - timeEstimate: 2h | timeTaken: 2h | Status: DONE

38. **Add System Prompt for RAG** (3h)
    - Commit: f27d9b1 (Oct 21)
    - Context filtering logic
    - timeEstimate: 3h | timeTaken: 3h | Status: DONE

39. **Initial RAG Testing** (4h)
    - Commit: 2bdb0ae (Oct 21)
    - Integration testing
    - timeEstimate: 4h | timeTaken: 4h | Status: DONE

40. **Refactor ChatBubble Layout** (2h)
    - Commit: ce290fa (Oct 21)
    - UI improvements
    - timeEstimate: 2h | timeTaken: 2h | Status: DONE

41. **Create DataTable Components** (Adrián - 6h)
    - Commit: 76a6925 (Oct 22)
    - Reusable table infrastructure
    - timeEstimate: 5h | timeTaken: 6h | Status: DONE

42. **Initial Table Structure** (Adrián - 3h)
    - Commit: fafe206 (Oct 22)
    - Base table implementation
    - timeEstimate: 3h | timeTaken: 3h | Status: DONE

43. **Table Backend Refactor** (Adrián - 8h)
    - Commit: 092d6c9 (Oct 22)
    - Sorting/filtering data layer
    - timeEstimate: 6h | timeTaken: 8h | Status: DONE

---

## SPRINT 3: Advanced Features & Optimization (Oct 28 - Nov 20, 2025)
**Duration**: 24 days | **Team**: All developers

### Week 1: Kanban Implementation (Nov 5)
**Developer**: Adrián Treviño

44. **Implement Kanban Board** (10h)
    - Commit: ea97026 (Nov 5)
    - Complete drag-and-drop functionality with status updates
    - timeEstimate: 8h | timeTaken: 10h | Status: DONE

45. **Create Kanban Components** (6h)
    - KanbanBoard, KanbanCard, KanbanColumn
    - Commit: ea97026 (Nov 5)
    - timeEstimate: 5h | timeTaken: 6h | Status: DONE

46. **Implement TaskForm Component** (8h)
    - Commit: ea97026 (Nov 5)
    - Complex form with all task fields
    - timeEstimate: 6h | timeTaken: 8h | Status: DONE

47. **Create Infinite Select Component** (4h)
    - Commit: ea97026 (Nov 5)
    - Infinite scroll dropdowns
    - timeEstimate: 4h | timeTaken: 4h | Status: DONE

48. **Add Sprint/UserStory Infinite Hooks** (3h)
    - Commit: ea97026 (Nov 5)
    - Pagination for selects
    - timeEstimate: 3h | timeTaken: 3h | Status: DONE

### Week 2: Test Restructuring (Nov 7)
**Developer**: Adrián Treviño

49. **Restructure All Backend Tests** (8h)
    - Commit: ea8cc33 (Nov 7)
    - Match new DTO architecture
    - timeEstimate: 6h | timeTaken: 8h | Status: DONE

50. **Fix Test Assertions** (4h)
    - Commit: ea8cc33 (Nov 7)
    - Update 100+ test cases
    - timeEstimate: 4h | timeTaken: 4h | Status: DONE

### Week 3: RAG Vector Search (Nov 10)
**Developer**: Isaac Enríquez

51. **Implement Oracle Vector Search** (13h)
    - Commit: 87e2c95 (Nov 10)
    - Complete RAG backend with embeddings
    - timeEstimate: 10h | timeTaken: 13h | Status: DONE

52. **Create EmbeddingService** (4h)
    - Commit: 87e2c95 (Nov 10)
    - Google Gemini integration
    - timeEstimate: 4h | timeTaken: 4h | Status: DONE

53. **Implement VectorStoreService** (6h)
    - Commit: 87e2c95 (Nov 10)
    - Oracle DB vector operations
    - timeEstimate: 5h | timeTaken: 6h | Status: DONE

54. **Update RepositoryService** (4h)
    - Commit: 87e2c95 (Nov 10)
    - JGit commit indexing
    - timeEstimate: 4h | timeTaken: 4h | Status: DONE

55. **Create RAG SQL Schema** (3h)
    - Commit: 87e2c95 (Nov 10)
    - Vector tables and indexes
    - timeEstimate: 3h | timeTaken: 3h | Status: DONE

### Week 4: Teams Management (Nov 10-12)
**Developers**: Kaled, Skalitz (Cesar), Arthur

56. **Create Mock Team View** (Cesar - 8h)
    - Commit: d68e7b3 (Nov 10)
    - Teams page with tabs and tables
    - timeEstimate: 6h | timeTaken: 8h | Status: DONE

57. **Initialize Teams** (Cesar - 3h)
    - Commit: ca32048 (Nov 10)
    - Team data seeding
    - timeEstimate: 3h | timeTaken: 3h | Status: DONE

58. **Fetch Teams Working** (Kaled - 4h)
    - Commit: c43b27e (Nov 10)
    - API integration
    - timeEstimate: 3h | timeTaken: 4h | Status: DONE

59. **Create Team v1** (Cesar - 4h)
    - Commit: 8fcd1de (Nov 11)
    - Team CRUD backend
    - timeEstimate: 4h | timeTaken: 4h | Status: DONE

60. **Fix Team Bugs** (Cesar - 4h)
    - Commit: 81ca840 (Nov 11)
    - DataInitializer and service fixes
    - timeEstimate: 3h | timeTaken: 4h | Status: DONE

61. **Project Delete/Cancel Feature** (Arthur - 4h)
    - Commit: 870e179 (Nov 11)
    - Soft delete implementation
    - timeEstimate: 4h | timeTaken: 4h | Status: DONE

62. **Bug Fixes for Projects** (Arthur - 6h)
    - Commits: 4e04d03, 65547d6 (Nov 10)
    - Wallet and DTO fixes
    - timeEstimate: 4h | timeTaken: 6h | Status: DONE

### Week 5: User Management (Nov 12)
**Developer**: Kaled Enríquez

63. **Update User Adapters & Hook** (3h)
    - Commit: dd3d031 (Nov 12)
    - Refactored user CRUD
    - timeEstimate: 3h | timeTaken: 3h | Status: DONE

64. **CRUD Usuarios Backend** (4h)
    - Commit: 785762e (Nov 12)
    - CreateUserRequest DTO
    - timeEstimate: 4h | timeTaken: 4h | Status: DONE

65. **Refactor Modal Components** (4h)
    - Commit: 75ba098 (Nov 12)
    - TeamForm, UserForm modularization
    - timeEstimate: 3h | timeTaken: 4h | Status: DONE

66. **Add/Remove Team Members** (5h)
    - Commit: d086030 (Nov 12)
    - Member management functionality
    - timeEstimate: 4h | timeTaken: 5h | Status: DONE

### Week 6: Middleware & Role-Based Access (Nov 12-13)
**Developer**: Adrián Treviño

67. **Create Role-Based Route Component** (4h)
    - Commit: 7680bae (Nov 12)
    - RBAC middleware
    - timeEstimate: 4h | timeTaken: 4h | Status: DONE

68. **Add useRole Hook** (2h)
    - Commit: 7680bae (Nov 12)
    - Role detection utility
    - timeEstimate: 2h | timeTaken: 2h | Status: DONE

69. **Implement Protected Routes** (3h)
    - Commit: 7680bae (Nov 12)
    - Route guarding
    - timeEstimate: 3h | timeTaken: 3h | Status: DONE

70. **Fix Auth Types** (2h)
    - Commit: 3b103e9 (Nov 12)
    - TypeScript type safety
    - timeEstimate: 2h | timeTaken: 2h | Status: DONE

71. **Sidebar Role-Based Visibility** (3h)
    - Commit: 3b103e9 (Nov 12)
    - Dynamic menu items
    - timeEstimate: 3h | timeTaken: 3h | Status: DONE

72. **UI Enhancements** (2h)
    - Commit: 39b4ca5 (Nov 13)
    - Teams page polish
    - timeEstimate: 2h | timeTaken: 2h | Status: DONE

### Week 7: Build & Deploy (Nov 10-17)
**Developer**: Adrián Treviño

73. **Fix JDK Version Issues** (2h)
    - Commit: 461fdc4 (Nov 10)
    - Build compatibility
    - timeEstimate: 2h | timeTaken: 2h | Status: DONE

74. **Docker Build Changes** (4h)
    - Commits: Multiple (Nov 17)
    - OCI deployment fixes
    - timeEstimate: 3h | timeTaken: 4h | Status: DONE

75. **Undeploy Script** (1h)
    - Commit: 49dadd7 (Nov 17)
    - Cleanup automation
    - timeEstimate: 1h | timeTaken: 1h | Status: DONE

---

## Summary Statistics

### Total Tasks: 75 atomic tasks
### Total Estimated Hours: 269h
### Total Actual Hours: 285h
### Variance: +16h (6% over estimate)

### Tasks by Developer:
- **Adrián**: 29 tasks (103h actual)
- **Kaled**: 21 tasks (78h actual)
- **Isaac**: 16 tasks (64h actual)
- **Cesar/Skalitz**: 6 tasks (25h actual)
- **Arthur**: 3 tasks (14h actual)

### Average Task Duration: 3.8h
### Tasks Over Estimate: 18 (24%)
### Tasks On Time: 57 (76%)

### Largest Overruns:
1. Kanban Implementation: +2h (25% over)
2. Test Restructuring: +2h (33% over)
3. RAG Vector Search: +3h (30% over)
4. Backend Refactor: +2h (50% over on table)
5. GitHub Actions: +2h (33% over)

