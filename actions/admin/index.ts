// Audit
export { createAuditLog, getAuditLogs, getAuditLogActions, getAuditLogEntityTypes } from "./audit";

// Users
export {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateUserRole,
  getUsersCount,
  importUsersFromCsv,
} from "./users";

// Establishments
export {
  getEstablishments,
  getEstablishmentById,
  createEstablishment,
  updateEstablishment,
  deleteEstablishment,
  getEstablishmentsCount,
  getEstablishmentRegions,
  getAllEstablishments,
} from "./establishments";

// Classes
export {
  getClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  assignTeacherToClass,
  removeTeacherFromClass,
  assignStudentsToClass,
  removeStudentFromClass,
  getClassesCount,
  getClassYears,
  getClassLevels,
  getAvailableStudents,
  getAvailableTeachers,
  importClassesFromCsv,
} from "./classes";

// Blocs
export {
  getBlocs,
  getBlocById,
  updateBloc,
  getBlocsCount,
  reorderBlocs,
} from "./blocs";

// Activities
export {
  getActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
  getActivitiesCount,
  reorderActivities,
  getAllActivities,
} from "./activities";

// Quiz
export {
  getQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  reorderQuestions,
  getQuizzesCount,
} from "./quiz";

// Wines
export {
  getWines,
  getWineById,
  createWine,
  updateWine,
  deleteWine,
  getWinesCount,
  getWineRegions,
  getWineCountries,
  importWinesFromJson,
  getWineWithSensoryProfile,
  updateWineSensoryProfile,
  deleteWineSensoryProfile,
} from "./wines";

// Grapes
export {
  getGrapeVarieties,
  getGrapeVarietyById,
  createGrapeVariety,
  updateGrapeVariety,
  deleteGrapeVariety,
  getGrapeVarietiesCount,
  getAllGrapeVarieties,
} from "./grapes";

// Appellations
export {
  getAppellations,
  getAppellationById,
  createAppellation,
  updateAppellation,
  deleteAppellation,
  getAppellationsCount,
  getAppellationRegions,
  getAllAppellations,
} from "./appellations";

// Aromas
export {
  getAromaTree,
  getAromaCategories,
  createAromaCategory,
  updateAromaCategory,
  deleteAromaCategory,
  createAromaSubCategory,
  updateAromaSubCategory,
  deleteAromaSubCategory,
  createAroma,
  updateAroma,
  deleteAroma,
  getAromasCount,
  reorderAromaCategories,
  reorderAromaSubCategories,
  reorderAromas,
} from "./aromas";

// Glossary
export {
  getGlossaryTerms,
  getGlossaryTermById,
  createGlossaryTerm,
  updateGlossaryTerm,
  deleteGlossaryTerm,
  getGlossaryTermsCount,
  getGlossaryCategories,
  getAllTerms,
} from "./glossary";

// Stats
export {
  getGlobalStats,
  getRecentActivity,
  getUserStats,
  getProgressStats,
  getContentStats,
} from "./stats";

// Settings
export {
  getSettings,
  getSetting,
  getPublicSettings,
  updateSetting,
  updateSettings,
  resetSetting,
  getSettingCategories,
} from "./settings";

// Analytics
export {
  getUserRegistrationStats,
  getUserRoleDistribution,
  getActivityByBloc,
  getQuizCompletionStats,
  getLoginStats,
  getEstablishmentsByRegion,
  getClassesByLevel,
  getContentStats as getAnalyticsContentStats,
  getGlobalTrends,
} from "./analytics";

// Permissions
export {
  getRolePermissions,
  getAllRolePermissions,
  updateRolePermissions,
  getUserPermissions,
  setUserPermission,
  removeUserPermission,
  hasPermission,
  getCurrentUserPermissions,
  getPermissionsList,
  getPermissionsByCategory,
  type Permission,
  type UserRole,
} from "./permissions";
