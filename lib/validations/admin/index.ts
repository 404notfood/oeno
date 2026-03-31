// Users
export {
  userRoleSchema,
  createUserSchema,
  updateUserSchema,
  userFiltersSchema,
} from "./users";
export type { CreateUserInput, UpdateUserInput, UserFilters } from "./users";

// Establishments
export {
  createEstablishmentSchema,
  updateEstablishmentSchema,
  establishmentFiltersSchema,
} from "./establishments";
export type {
  CreateEstablishmentInput,
  UpdateEstablishmentInput,
  EstablishmentFilters,
} from "./establishments";

// Classes
export {
  createClassSchema,
  updateClassSchema,
  assignTeacherSchema,
  assignStudentsSchema,
  removeStudentSchema,
  classFiltersSchema,
} from "./classes";
export type {
  CreateClassInput,
  UpdateClassInput,
  AssignTeacherInput,
  AssignStudentsInput,
  ClassFilters,
} from "./classes";

// Blocs
export { updateBlocSchema, blocFiltersSchema } from "./blocs";
export type { UpdateBlocInput, BlocFilters } from "./blocs";

// Activities
export {
  activityTypeSchema,
  createActivitySchema,
  updateActivitySchema,
  activityFiltersSchema,
} from "./activities";
export type {
  ActivityType,
  CreateActivityInput,
  UpdateActivityInput,
  ActivityFilters,
} from "./activities";

// Quiz
export {
  questionTypeSchema,
  createOptionSchema,
  createQuestionSchema,
  updateQuestionSchema,
  createQuizSchema,
  updateQuizSchema,
  quizFiltersSchema,
} from "./quiz";
export type {
  QuestionType,
  CreateOptionInput,
  CreateQuestionInput,
  UpdateQuestionInput,
  CreateQuizInput,
  UpdateQuizInput,
  QuizFilters,
} from "./quiz";

// Wines
export {
  wineTypeSchema,
  wineColorSchema,
  acidityLevelSchema,
  alcoholLevelSchema,
  bodyLevelSchema,
  structureTypeSchema,
  tanninLevelSchema,
  finishLengthSchema,
  variabilityLevelSchema,
  sensoryProfileSchema,
  createWineSchema,
  updateWineSchema,
  wineFiltersSchema,
  importWineSchema,
  importWinesSchema,
} from "./wines";
export type {
  WineType,
  WineColor,
  AcidityLevel,
  AlcoholLevel,
  BodyLevel,
  StructureType,
  TanninLevel,
  FinishLength,
  VariabilityLevel,
  SensoryProfileInput,
  ImportWineInput,
  CreateWineInput,
  UpdateWineInput,
  WineFilters,
} from "./wines";

// Grapes
export {
  createGrapeVarietySchema,
  updateGrapeVarietySchema,
  grapeFiltersSchema,
} from "./grapes";
export type {
  CreateGrapeVarietyInput,
  UpdateGrapeVarietyInput,
  GrapeFilters,
} from "./grapes";

// Appellations
export {
  appellationTypeSchema,
  createAppellationSchema,
  updateAppellationSchema,
  appellationFiltersSchema,
} from "./appellations";
export type {
  AppellationType,
  CreateAppellationInput,
  UpdateAppellationInput,
  AppellationFilters,
} from "./appellations";

// Aromas
export {
  createAromaCategorySchema,
  updateAromaCategorySchema,
  createAromaSubCategorySchema,
  updateAromaSubCategorySchema,
  createAromaSchema,
  updateAromaSchema,
} from "./aromas";
export type {
  CreateAromaCategoryInput,
  UpdateAromaCategoryInput,
  CreateAromaSubCategoryInput,
  UpdateAromaSubCategoryInput,
  CreateAromaInput,
  UpdateAromaInput,
} from "./aromas";

// Glossary
export {
  glossaryCategorySchema,
  createGlossaryTermSchema,
  updateGlossaryTermSchema,
  glossaryFiltersSchema,
} from "./glossary";
export type {
  GlossaryCategory,
  CreateGlossaryTermInput,
  UpdateGlossaryTermInput,
  GlossaryFilters,
} from "./glossary";
