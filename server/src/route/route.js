import { Router } from "express";
import {
  addActionAdmin,
  addAdmin,
  addCourse,
  addLesson,
  addLessonCourse,
  addLessonSection,
  addPath,
  addPathCourse,
  AddProgressCompleted,
  AddUser,
  deleteActionAdmin,
  deleteAdmin,
  deleteCourse,
  deletelesson,
  deleteLessonCourse,
  deleteLessonFromSection,
  DeleteLessonSection,
  deletePath,
  DeletePathCourse,
  deleteProgressByUserId,
  DeleteUser,
  getAdmin,
  getAllActionAdmin,
  getAllDataDashboardAdmin,
  getAllLessons,
  getAllPaths,
  getContentWithGithub,
  getCourseById,
  getCourseByIdForUpdate,
  getCourseByPathWithoutProgress,
  getCourseByPathWithProgress,
  getCourseLessonSectionWithTitleLesson,
  getCourses,
  getDefaultCourseByPath,
  getDetailActionAdmin,
  getDetailAdmin,
  getDetailUser,
  getIdCourseByCourseTitle,
  getIdPathByTitle,
  getLesson,
  getLessonByCourseId,
  getLessonByCourseIdWithoutProgress,
  getLessonById,
  getLessonBySectionId,
  getLessonByTitle,
  getLessonContent,
  getLessonSection,
  getLessonSectionById,
  getPathById,
  getPathCourseByPathId,
  getPaths,
  getpathsCourses,
  getProgressById,
  getTotalCourse,
  getTotalLesson,
  getUsers,
  loginAdmin,
  loginUser,
  logout,
  logoutAdmin,
  publishedPath,
  unPublishedPath,
  updateAdmin,
  updateAdminPassword,
  updateCourse,
  updateIndexLesson,
  updateLesson,
  updateLessonCourse,
  updateLessonSection,
  updateOrderIndexLesson,
  updatePath,
  UpdatePathCourse,
  UpdateUser,
  updateUserPassword,
  UpdateUserPath,
} from "../../src/controller/allC.js";
import { verityToken, verityTokenAdmin } from "../middleware/authMiddleware.js";
import { response } from "../response/response.js";
import upload from "../middleware/upload.js";

const routes = Router();

routes.get("/api/user", getUsers);
routes.get("/api/user/:id", getDetailUser);
routes.delete("/api/user/:id", DeleteUser);
routes.patch("/api/user/:id", upload.single("avatar"), UpdateUser);
routes.patch("/api/user/path/:id", UpdateUserPath);
routes.post("/api/user", AddUser);
routes.patch("/api/user/edit/password/:id", updateUserPassword);

routes.post("/api/login", loginUser);
routes.post("/api/logout", logout);

routes.post("/api/verify/auth", verityToken, (req, res) => {
  response(200, req.user, "Take Data Success", res);
});

// Admin

routes.get("/api/admin", getAdmin);
routes.get("/api/admin/:id", getDetailAdmin);
routes.post("/api/admin", addAdmin);
routes.patch("/api/admin/edit/password/:id", updateAdminPassword);

routes.patch("/api/admin/:id", upload.single("avatar"), updateAdmin);
routes.delete("/api/admin/:id", deleteAdmin);
routes.post("/api/logout/admin", logoutAdmin);

routes.post("/api/admin/login", loginAdmin);
routes.post("/api/verify/auth/admin", verityTokenAdmin, (req, res) => {
  response(200, req.admin, "Take Data Success", res);
});

// Progress

routes.get("/api/progress/:id", getProgressById);
routes.post('/api/progress/completed', AddProgressCompleted)
routes.delete('/api/progress/reset-progress/:userId', deleteProgressByUserId)

// Course

routes.get("/api/course/:id", getCourseById);
routes.get("/api/course/update/:id", getCourseByIdForUpdate);
routes.get("/api/course", getCourses);
routes.get('/api/course-count', getTotalCourse)
routes.get("/api/course/all-lesson/progress/:id/:userId", getLessonByCourseId);
routes.get("/api/course/all-lesson/:id/", getLessonByCourseIdWithoutProgress);
routes.get('/api/id-course/lesson/title/:title', getIdCourseByCourseTitle)
routes.post("/api/course", upload.single("asset"), addCourse);
routes.patch("/api/course/:id", upload.single("asset"), updateCourse);
routes.delete("/api/course/:id", deleteCourse);

// PathCourse

routes.get("/api/pathcourse", getpathsCourses);
routes.get("/api/pathcourse/:id", getPathCourseByPathId);
routes.post("/api/pathcourse", addPathCourse);
routes.patch("/api/pathcourse/update", UpdatePathCourse);
routes.delete("/api/pathcourse/delete/:id", DeletePathCourse);

// Path

routes.get("/api/path", getPaths);
routes.get("/api/all/path", getAllPaths);
routes.patch("/api/path/published/:id", publishedPath);
routes.patch("/api/path/un-published/:id", unPublishedPath);
routes.get("/api/path/:id", getPathById);
routes.get("/api/path/title/:title", getIdPathByTitle);
routes.post("/api/path", upload.single("asset"), addPath);
routes.patch("/api/path/:id", upload.single("asset"), updatePath);
routes.delete("/api/path/:id", deletePath);
routes.get("/api/path/course/:id/:userId", getCourseByPathWithProgress);
routes.get("/api/path/course/:id", getCourseByPathWithoutProgress);
routes.get("/api/default/course", getDefaultCourseByPath);


// Lesson

routes.get('/api/lesson/test', getLessonContent)
routes.get('/api/lesson', getLesson)
routes.get('/api/all/lesson', getAllLessons)
routes.get('/api/total/lesson', getTotalLesson)
routes.get('/api/lesson/:id', getLessonById)
routes.delete('/api/lesson/:id', deletelesson)
routes.patch('/api/lesson/:id', updateLesson)
routes.get('/api/lesson/title/:title/:id', getLessonByTitle)
routes.patch('/api/add-lesson-to-section', updateIndexLesson)
routes.patch('/api/update-lesson-index', updateOrderIndexLesson)
routes.patch('/api/delete-lesson-section/:id', deleteLessonFromSection)
routes.get('/api/lesson-section-id/:id', getLessonBySectionId)
routes.post('/api/lesson', addLesson)
routes.get('/api/lesson/github/:id', getContentWithGithub)
routes.get('/api/lesson/by-title/:title/:pathId', getCourseLessonSectionWithTitleLesson)


// LessonSection

routes.post('/api/lesson-section', addLessonSection)
routes.get('/api/lesson-section', getLessonSection)
routes.get('/api/lesson-section/:id', getLessonSectionById)
routes.patch('/api/lesson-section/:id', updateLessonSection)
routes.delete('/api/lesson-section/:id', DeleteLessonSection)

// LessonCourse

routes.post('/api/lesson-course', addLessonCourse)
routes.patch('/api/lesson-course', updateLessonCourse)
routes.delete('/api/lesson-course/:id', deleteLessonCourse)

// Action Admin

routes.get('/api/action-admin', getAllActionAdmin)
routes.post('/api/action-admin', addActionAdmin)
routes.delete('/api/action-admin/:id', deleteActionAdmin)
routes.get('/api/action-admin/:id', getDetailActionAdmin)

// Dashboard Admin

routes.get('/api/dashboard/admin', getAllDataDashboardAdmin)

export default routes;
