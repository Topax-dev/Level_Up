import { PrismaClient } from "@prisma/client";
import { response } from "../response/response.js";
import bcrypt from "bcrypt";
import { generateToken } from "../helpers/auth.js";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";

const prisma = new PrismaClient();

export async function getUsers(req, res) {
  try {
    const data = await prisma.user.findMany();
    return response(200, data, "Get All Users Success", res);
  } catch (error) {
    return response(500, error.message, "Get All Users Failed", res);
  }
}

export async function getDetailUser(req, res) {
  const { id } = req.params;
  try {
    const data = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    return response(200, data, "Get Detail User With Id Success", res);
  } catch (error) {
    return response(500, error.message, "Get Detail User With Id Failed", res);
  }
}

export async function AddUser(req, res) {
  const { name, email, password } = req.body;
  const defaultAvatar = `https://res.cloudinary.com/dmcact5os/image/upload/v1760489316/avatars/s9virokftxkiyvzqtmql.png`;
  const defaultPurpose = "I Want To Be Hero";
  const saltRound = 10;
  const hashedPassword = await bcrypt.hash(password, saltRound);
  try {
    const matchName = await prisma.$queryRaw`
      SELECT username from user WHERE LOWER(username) = LOWER(${name})
    `;
    const matchEmail = await prisma.$queryRaw`
      SELECT email from user WHERE LOWER(email)  = LOWER(${email})
    `;
    if (matchName.length > 0)
      return response(403, "Login Failed", "Username Already Exist", res);
    if (matchEmail.length > 0)
      return response(403, "Login Failed", "Email Already Exist", res);
    const data = await prisma.user.create({
      data: {
        avatar: defaultAvatar,
        username: name,
        email,
        password: hashedPassword,
        purpose: defaultPurpose,
      },
    });
    return response(200, data, "Add User Success", res);
  } catch (error) {
    return response(500, error.message, "Add User Failed", res);
  }
}

export async function DeleteUser(req, res) {
  try {
    const id = Number(req.params.id);
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return response(404, "User not found", "Delete User Failed", res);
    }

    await prisma.user.delete({ where: { id } });
    return response(200, "Delete success", "Delete User Success", res);
  } catch (error) {
    return response(500, error.message, "Delete User Failed", res);
  }
}

export async function UpdateUser(req, res) {
  const { id } = req.params;
  const { username, email, purpose } = req.body;

  try {
    let avatarUrl = null;

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "avatars" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      avatarUrl = uploadResult.secure_url;
    }

    const data = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        username,
        email,
        purpose,
        ...(avatarUrl && { avatar: avatarUrl }),
      },
    });

    return response(200, data, "Update User With Id Success", res);
  } catch (error) {
    return response(500, error.message, "Update User With Id Failed", res);
  }
}

export async function UpdateUserPath(req, res) {
  const { id } = req.params;
  const { selectedPath } = req.body;
  try {
    const data = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        selectedPath,
      },
    });
    return response(200, data, "Update Selected Path Success", res);
  } catch (error) {
    return response(500, error.message, "Update Selected Path Failed", res);
  }
}

export async function updateUserPassword(req, res) {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      return response(404, null, "User not found", res);
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return response(401, null, "Password lama salah", res);
    }

    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRound);

    const data = await prisma.user.update({
      where: { id: Number(id) },
      data: { password: hashedPassword },
    });

    return response(200, data, "Update User Password Success", res);
  } catch (error) {
    return response(
      500,
      error.message,
      "Update User Password With Id Failed",
      res
    );
  }
}

export async function loginUser(req, res) {
  const { email, password, remember } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user)
      return response(404, "Email Or Password Wrong", "Login User Failed", res);

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return response(404, "Email Or Password Wrong", "Login User Failed", res);

    const token = generateToken({ id: user.id, name: user.email });
    req.session.userId = user.id;

    const cookieOptions = {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
      domain: "localhost",
      maxAge: remember ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000,
      path: "/",
    };

    res.cookie("access_token", token, cookieOptions);
    return response(200, { token }, "Login Success", res);
  } catch (error) {
    return response(500, error.message, "Login User Failed", res);
  }
}
export async function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      return response(500, "Logout Failed", "Logout Failed", res);
    }

    res.clearCookie("access_token", { path: "/" });
    return response(200, "Logout Success", "Logout Success", res);
  });
}

// admin

export async function logoutAdmin(req, res) {
  req.session.destroy((err) => {
    if (err) {
      return response(500, "Logout Failed", "Logout Failed", res);
    }

    res.clearCookie("vip_access_token", { path: "/" });
    return response(200, "Logout Success", "Logout Success", res);
  });
}

export async function updateAdminPassword(req, res) {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    const admin = await prisma.admin.findUnique({
      where: { id: Number(id) },
    });

    if (!admin) {
      return response(404, null, "User not found", res);
    }

    const passwordMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!passwordMatch) {
      return response(401, null, "Password lama salah", res);
    }

    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRound);

    const data = await prisma.admin.update({
      where: { id: Number(id) },
      data: { password: hashedPassword },
    });

    return response(200, data, "Update User Password Success", res);
  } catch (error) {
    return response(
      500,
      error.message,
      "Update User Password With Id Failed",
      res
    );
  }
}

export async function getAdmin(req, res) {
  try {
    const data = await prisma.admin.findMany({
      where: {
        role: "admin",
      },
    });
    return response(200, data, "Get Admin Success", res);
  } catch (error) {
    return response(500, error.message, "Get Admin Failed", res);
  }
}

export async function getDetailAdmin(req, res) {
  const { id } = req.params;
  try {
    const data = await prisma.admin.findUnique({
      where: {
        id: Number(id),
      },
    });
    return response(200, data, "Get Detail Admin With Id Success", res);
  } catch (error) {
    return response(500, error.message, "Get Detail Admin With Id Failed", res);
  }
}

export async function addAdmin(req, res) {
  const { name, email, password } = req.body;
  const defaultAvatar =
    "https://res.cloudinary.com/dmcact5os/image/upload/v1760489316/avatars/s9virokftxkiyvzqtmql.png";
  const saltRound = 10;
  const hashedPassword = await bcrypt.hash(password, saltRound);
  try {
    const matchName = await prisma.$queryRaw`
      SELECT username FROM admin WHERE LOWER(username) = LOWER(${name})
    `;
    const matchEmail = await prisma.$queryRaw`
      SELECT email FROM admin WHERE LOWER(email) = LOWER(${email})
    `;
    if (matchName.length > 0)
      return response(
        403,
        "Username Already Exist",
        "Sign Up Admin Failed",
        res
      );
    if (matchEmail.length > 0)
      return response(403, "email Already Exist", "Sign Up Admin Failed", res);
    const data = await prisma.admin.create({
      data: {
        username: name,
        email,
        password: hashedPassword,
        avatar: defaultAvatar,
      },
    });
    return response(200, data, "Add Admin Success", res);
  } catch (error) {
    return response(500, error.message, "Add Admin Failed", res);
  }
}

export async function updateAdmin(req, res) {
  const { id } = req.params;
  const { username, email } = req.body;
  try {
    // const matchName = await prisma.$queryRaw`
    //   SELECT * FROM admin WHERE LOWER(username) = LOWER(${username})
    // `;
    // const matchEmail = await prisma.$queryRaw`
    //   SELECT email FROM admin WHERE LOWER(email) = LOWER(${email})
    // `;
    // if (matchName.length > 0)
    //   return response(
    //     403,
    //     "Username Already Exist",
    //     "Sign Up Admin Failed",
    //     res
    //   );
    // if (matchEmail.length > 0)
    //   return response(403, "email Already Exist", "Sign Up Admin Failed", res);
    let avatarUrl = null;

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "avatars" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      avatarUrl = uploadResult.secure_url;
    }

    const data = await prisma.admin.update({
      where: {
        id: Number(id),
      },
      data: {
        username,
        email,
        ...(avatarUrl && { avatar: avatarUrl }),
      },
    });
    return response(200, data, "Update Admin With Id Success", res);
  } catch (error) {
    return response(500, error.message, "Update Admin With Id Failed", res);
  }
}

export async function deleteAdmin(req, res) {
  const { id } = req.params;
  try {
    const data = await prisma.admin.delete({
      where: {
        id: Number(id),
      },
    });
    return response(200, data, "Delete Admin With Id Success", res);
  } catch (error) {
    return response(500, error.message, "Delete Admin With Id Failed", res);
  }
}

export async function loginAdmin(req, res) {
  const { email, password, remember } = req.body;
  try {
    const admin = await prisma.admin.findUnique({
      where: {
        email,
      },
    });
    if (!admin) {
      return response(403, "Email Or Password Wrong", "Login Failed", res);
    }

    const matchPassword = await bcrypt.compare(password, admin.password);
    if (!matchPassword) {
      return response(403, "Email Or Password Wrong", "Login Failed", res);
    }

    const token = generateToken({
      id: admin.id,
      name: admin.email,
      role: admin.role,
    });

    req.session.adminId = admin.id;
    const cookieOptions = {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: remember ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000,
      path: "/",
    };

    res.cookie("vip_access_token", token, cookieOptions);
    return response(200, { token }, "Login Success", res);
  } catch (error) {
    return response(500, error, "Login Failed", res);
  }
}

// Progress

export async function getProgressById(req, res) {
  const { id } = req.params;
  try {
    const data = await prisma.progress.findMany({
      where: {
        userId: Number(id),
      },
    });
    return response(200, data, "Get Progress With Id Success", res);
  } catch (error) {
    return response(500, error.message, "Get Progress With Id Failed", res);
  }
}

export async function AddProgressCompleted(req, res) {
  const { userId, lessonId } = req.body;
  try {
    const data = await prisma.progress.create({
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
        userId: Number(userId),
        lessonId: lessonId,
      },
    });
    return response(200, data, "Add Progress Completed Success", res);
  } catch (error) {
    return response(500, error.message, "Add Progress Completed Failed", res);
  }
}

export async function deleteProgressByUserId(req, res) {
  const { userId } = req.params;
  try {
    const data = await prisma.progress.deleteMany({
      where: {
        userId: Number(userId),
      },
    });
    return response(200, data, "Delete Progress by User Id Success", res);
  } catch (error) {
    return response(
      500,
      error.message,
      "Delete Progress by User Id Failed",
      res
    );
  }
}

// Coursee

export async function getCourseByIdForUpdate(req, res) {
  const { id } = req.params;
  try {
    const data = await prisma.course.findUnique({
      where: {
        id: Number(id),
      },
    });
    return response(200, data, "Get Course By Id For Update Success", res);
  } catch (error) {
    return response(
      500,
      error.message,
      "Get Course By id For Update Failed",
      res
    );
  }
}

export async function getCourseById(req, res) {
  const { id } = req.params;
  try {
    const data = await prisma.course.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        pathCourses: {
          include: {
            path: true,
          },
        },
        LessonCourse: {
          include: {
            LessonSection: {
              include: {
                _count: true,
                lesson: {
                  select: {
                    title: true,
                    type: true,
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    const totalLesson = data.LessonCourse.reduce((total, lc) => {
      return total + (lc.LessonSection?._count?.lesson || 0);
    }, 0);

    return response(200, [data, totalLesson], "Get Course By Id Success", res);
  } catch (error) {
    return response(500, error.message, "Get Course By Id Failes", res);
  }
}

export async function getIdCourseByCourseTitle(req, res) {
  const { title } = req.params;
  try {
    const data = await prisma.$queryRaw`
      SELECT id FROM  course WHERE LOWER(title) = LOWER(${title})
    `;

    return response(
      200,
      data,
      "Get lesson course by course title success",
      res
    );
  } catch (error) {
    return response(
      500,
      error.message,
      "Get lesson course by course title failed",
      res
    );
  }
}

export async function getTotalCourse(req, res) {
  try {
    const data = await prisma.course.count();
    return response(200, data, "Get Total Course Success", res);
  } catch (error) {
    return response(500, error.message, "Get Total Course Failed", res);
  }
}

export async function getCourses(req, res) {
  try {
    const { page, search } = req.query;

    const take = 10;
    const skip = ((Number(page) || 1) - 1) * take;

    const data = await prisma.course.findMany({
      skip,
      take,
      where: search
        ? {
            title: {
              contains: search,
            },
          }
        : {},
      include: {
        LessonCourse: {
          include: {
            LessonSection: {
              include: {
                lesson: {
                  select: { type: true },
                },
              },
            },
          },
        },
      },
    });

    const withCounts = data.map((course) => {
      const lessonCourses = course.LessonCourse || [];

      const counts = lessonCourses.map((lc) => {
        const lessons = lc.LessonSection?.lesson || [];

        return {
          projectCount: lessons.filter((l) => l.type === "PROJECT").length,
          readingCount: lessons.filter((l) => l.type === "READING").length,
        };
      });

      const totalCounts = counts.reduce(
        (acc, curr) => ({
          projectCount: acc.projectCount + curr.projectCount,
          readingCount: acc.readingCount + curr.readingCount,
        }),
        { projectCount: 0, readingCount: 0 }
      );

      return {
        ...course,
        totalProjectCount: totalCounts.projectCount,
        totalReadingCount: totalCounts.readingCount,
        totalCourse: data.length,
      };
    });

    return response(200, withCounts, "Get Courses Success", res);
  } catch (error) {
    console.error(error);
    return response(500, error.message, "Get Courses Failed", res);
  }
}

export async function getLessonByCourseId(req, res) {
  const { id, userId } = req.params;
  try {
    const data = await prisma.course.findMany({
      where: {
        id: Number(id),
      },
      include: {
        LessonCourse: {
          include: {
            LessonSection: {
              include: {
                lesson: {
                  orderBy: {
                    orderIndex: "asc",
                  },
                  include: {
                    progress: {
                      where: {
                        userId: Number(userId),
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: {
            orderIndex: "asc",
          },
        },
      },
    });
    return response(200, data, "Get Course By Path Id Success", res);
  } catch (error) {
    return response(500, error.message, "Get Courses By Path Id Failed", res);
  }
}

export async function getLessonByCourseIdWithoutProgress(req, res) {
  const { id } = req.params;
  try {
    const data = await prisma.course.findMany({
      where: {
        id: Number(id),
      },
      include: {
        LessonCourse: {
          include: {
            LessonSection: {
              include: {
                lesson: {
                  orderBy: {
                    orderIndex: "asc",
                  },
                },
              },
            },
          },
          orderBy: {
            orderIndex: "asc",
          },
        },
      },
    });
    return response(200, data, "Get Course By Path Id Success", res);
  } catch (error) {
    return response(500, error.message, "Get Courses By Path Id Failed", res);
  }
}

export async function addCourse(req, res) {
  const { title, description, orderIndex } = req.body;
  try {
    const matchTitle = await prisma.$queryRaw`
      SELECT title FROM course WHERE LOWER(title) = LOWER(${title})
    `;
    if (matchTitle.length > 0)
      return response(
        403,
        "Course Title Already Exist",
        "Add Course Failed",
        res
      );
    let asset = null;
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "asset" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
      asset = uploadResult.secure_url;
    }
    const data = await prisma.course.create({
      data: {
        title,
        description,
        orderIndex,
        imageCourse: asset,
      },
    });
    return response(200, data, "Add Course Success", res);
  } catch (error) {
    return response(500, error.message, "Get Courses Failed", res);
  }
}

export async function updateCourse(req, res) {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    const matchTitle = await prisma.$queryRaw`
      SELECT title FROM course WHERE LOWER(title) = LOWER(${title}) AND id != ${Number(
      id
    )}
    `;
    if (matchTitle.length > 0)
      return response(
        403,
        "Course Title Already Exist",
        "Add Course Failed",
        res
      );
    let asset = null;
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "asset" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      asset = uploadResult.secure_url;
    }

    const data = await prisma.course.update({
      where: {
        id: Number(id),
      },
      data: {
        title,
        description,
        ...(asset && { imageCourse: asset }),
      },
    });
    return response(200, data, "Update Course Success", res);
  } catch (error) {
    return response(500, error.message, "Update Course Failed", res);
  }
}

export async function deleteCourse(req, res) {
  const { id } = req.params;
  try {
    const data = await prisma.course.delete({
      where: {
        id: Number(id),
      },
    });
    return response(200, data, "Delete Course Success", res);
  } catch (error) {
    return response(500, error.message, "Get Courses Failed", res);
  }
}

// PathCourse

export async function getpathsCourses(req, res) {
  try {
    const data = await prisma.pathCourse.findMany();
    return response(200, data, "Get Path Course Success", res);
  } catch (error) {
    return response(500, error.message, "Get Path Course Failed", res);
  }
}

export async function getPathCourseByPathId(req, res) {
  const { id } = req.params;
  try {
    const data = await prisma.pathCourse.findMany({
      where: {
        pathId: Number(id),
      },
    });
    return response(200, data, "Get Course Path Success", res);
  } catch (error) {
    return response(500, error.message, "Get Course Path Course", res);
  }
}

export async function addPathCourse(req, res) {
  try {
    const dataArray = req.body;

    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      return response(400, null, "Invalid data format", res);
    }

    const lastIndex = await prisma.pathCourse.findFirst({
      where: {
        pathId: dataArray[0].pathId,
      },
      orderBy: {
        orderIndex: "desc",
      },
      select: {
        orderIndex: true,
      },
    });

    let startIndex = lastIndex ? lastIndex.orderIndex + 1 : 1;

    const data = await prisma.pathCourse.createMany({
      data: dataArray.map(({ pathId, courseId }) => ({
        pathId,
        courseId,
        orderIndex: startIndex++,
      })),
    });

    return response(200, data, "Add Course Path Success", res);
  } catch (error) {
    console.error(error);
    return response(500, error.message, "Add Course Path Failed", res);
  }
}

export async function DeletePathCourse(req, res) {
  const { id } = req.params;
  try {
    const data = await prisma.pathCourse.delete({
      where: {
        id: Number(id),
      },
    });
    return response(200, data, "Delete Course Path Success", res);
  } catch (error) {
    return response(500, error.message, "Delete Course Path Course", res);
  }
}

export async function UpdatePathCourse(req, res) {
  const payload = req.body;

  try {
    for (const item of payload) {
      await prisma.pathCourse.update({
        where: { id: Number(item.id) },
        data: { orderIndex: Number(item.orderIndex) },
      });
    }

    return response(200, null, "Update Course Path Success", res);
  } catch (error) {
    return response(500, error.message, "Update Course Path Failed", res);
  }
}

// Paths

export async function getPaths(req, res) {
  try {
    const { name } = req.query;

    const data = name
      ? await prisma.path.findMany({
          where: { name: "Foundations" },
          include: {
            _count: {
              select: { pathCourses: true },
            },
          },
        })
      : await prisma.path.findMany({
          where: {
            NOT: {
              name: "Foundations",
            },
            isPublished: true,
          },
          include: {
            _count: {
              select: { pathCourses: true },
            },
          },
        });

    if (!data) {
      return response(404, null, "Path not found", res);
    }

    return response(200, data, "Get Paths Success", res);
  } catch (error) {
    return response(500, error.message, "Get Paths Failed", res);
  }
}

export async function getAllPaths(req, res) {
  try {
    const data = await prisma.path.findMany({
      include: {
        _count: {
          select: { pathCourses: true },
        },
      },
    });
    return response(200, data, "Get All Paths Success", res);
  } catch (error) {
    return response(500, error.message, "Get All Paths Failed", res);
  }
}

export async function publishedPath(req, res) {
  const { id } = req.params;
  try {
    const data = await prisma.path.update({
      where: {
        id: Number(id),
      },
      data: {
        isPublished: true,
      },
    });
    return response(200, data, "Published Path Success", res);
  } catch (error) {
    return response(500, error.message, "Published Path Failed", res);
  }
}

export async function unPublishedPath(req, res) {
  const { id } = req.params;
  try {
    const data = await prisma.path.update({
      where: {
        id: Number(id),
      },
      data: {
        isPublished: false,
      },
    });
    return response(200, data, "UnPublished Path Success", res);
  } catch (error) {
    return response(500, error.message, "UnPublished Path Failed", res);
  }
}

export async function getPathById(req, res) {
  const { id } = req.params;
  try {
    const data = await prisma.path.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        pathCourses: {
          include: {
            course: {
              select: { id: true, title: true },
            },
          },
        },
      },
    });
    return response(200, data, "Get Path By Id Success", res);
  } catch (error) {
    return response(500, error.message, "Get Path By Id Failed", res);
  }
}

export async function addPath(req, res) {
  const { name, description, orderIndex } = req.body;
  try {
    const matchTitle = await prisma.$queryRaw`
      SELECT name FROM path WHERE LOWER(name) = LOWER(${name})
    `;
    if (matchTitle.length > 0)
      return response(403, "Title Already Exist", "Add Path Failed", res);
    let asset = null;
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "asset" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      asset = uploadResult.secure_url;
    }
    const data = await prisma.path.create({
      data: {
        name,
        description,
        orderIndex,
        imagePath: asset,
      },
    });
    return response(200, data, "Add Path Success", res);
  } catch (error) {
    return response(500, error.message, "Add Path Failed", res);
  }
}

export async function updatePath(req, res) {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const matchTitle = await prisma.$queryRaw`
      SELECT name FROM path WHERE LOWER(name) = LOWER(${name}) AND id != ${Number(
      id
    )}
    `;
    if (matchTitle.length > 0)
      return response(
        403,
        "Path Title Already Exist",
        "Add Course Failed",
        res
      );
    let asset = null;
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "asser" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
      asset = uploadResult.secure_url;
    }

    const data = await prisma.path.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        description,
        ...(asset && { imagePath: asset }),
      },
    });
    return response(200, data, "Update Path Success", res);
  } catch (error) {
    return response(500, error.message, "Updat4e Path Failed", res);
  }
}

export async function deletePath(req, res) {
  const { id } = req.params;
  try {
    const data = await prisma.path.delete({
      where: {
        id: Number(id),
      },
    });
    return response(200, data, "Delete Path Success", res);
  } catch (error) {
    return response(500, error.message, "Delete Path Failed", res);
  }
}

export async function getCourseByPathWithProgress(req, res) {
  const { id, userId } = req.params;
  try {
    const data = await prisma.path.findUnique({
      where: { id: Number(id) },
      include: {
        pathCourses: {
          orderBy: { orderIndex: "asc" },
          include: {
            course: {
              include: {
                LessonCourse: {
                  include: {
                    LessonSection: {
                      include: {
                        lesson: {
                          include: {
                            progress: {
                              where: { userId: Number(userId) },
                            },
                          },
                          orderBy: { orderIndex: "asc" },
                        },
                      },
                    },
                  },
                  orderBy: { orderIndex: "asc" },
                },
              },
            },
          },
        },
      },
    });

    if (!data) return response(404, null, "Path not found", res);

    const withCounts = {
      ...data,
      pathCourses: data.pathCourses.map((pc) => {
        const sectionsWithCounts = pc.course.LessonCourse.map((lc) => ({
          ...lc.LessonSection,
          lessons: lc.LessonSection?.lesson || [],
          projectCount:
            lc.LessonSection?.lesson?.filter((l) => l.type === "PROJECT")
              .length || 0,
          readingCount:
            lc.LessonSection?.lesson?.filter((l) => l.type === "READING")
              .length || 0,
        }));

        const allLessons = sectionsWithCounts.flatMap(
          (section) => section.lessons
        );

        const totalProjectCount = allLessons.filter(
          (l) => l.type === "PROJECT"
        ).length;
        const totalReadingCount = allLessons.filter(
          (l) => l.type === "READING"
        ).length;

        const completedLesson = allLessons.filter(
          (l) => l.progress && l.progress.some((p) => p.status === "COMPLETED")
        ).length;

        return {
          ...pc,
          course: {
            ...pc.course,
            sections: sectionsWithCounts,
            projectCount: totalProjectCount,
            readingCount: totalReadingCount,
            totalLessons: allLessons.length,
            completedLesson,
          },
        };
      }),
    };

    return response(200, withCounts, "Get Course By Path Success", res);
  } catch (error) {
    console.error(error);
    return response(500, error.message, "Get Course By Path Failed", res);
  }
}

export async function getCourseByPathWithoutProgress(req, res) {
  const { id } = req.params;
  try {
    const data = await prisma.path.findUnique({
      where: { id: Number(id) },
      include: {
        pathCourses: {
          orderBy: { orderIndex: "asc" },
          include: {
            course: {
              include: {
                LessonCourse: {
                  include: {
                    LessonSection: {
                      include: {
                        lesson: {
                          orderBy: { orderIndex: "asc" },
                        },
                      },
                    },
                  },
                  orderBy: { orderIndex: "asc" },
                },
              },
            },
          },
        },
      },
    });

    if (!data) return response(404, null, "Path not found", res);

    const withCounts = {
      ...data,
      pathCourses: data.pathCourses.map((pc) => {
        const sectionsWithCounts = pc.course.LessonCourse.map((lc) => ({
          ...lc.LessonSection,
          lessons: lc.LessonSection?.lesson || [],
          projectCount:
            lc.LessonSection?.lesson?.filter((l) => l.type === "PROJECT")
              .length || 0,
          readingCount:
            lc.LessonSection?.lesson?.filter((l) => l.type === "READING")
              .length || 0,
        }));

        const allLessons = sectionsWithCounts.flatMap(
          (section) => section.lessons
        );

        const totalProjectCount = allLessons.filter(
          (l) => l.type === "PROJECT"
        ).length;
        const totalReadingCount = allLessons.filter(
          (l) => l.type === "READING"
        ).length;

        return {
          ...pc,
          course: {
            ...pc.course,
            sections: sectionsWithCounts,
            projectCount: totalProjectCount,
            readingCount: totalReadingCount,
            totalLessons: allLessons.length,
          },
        };
      }),
    };

    return response(200, withCounts, "Get Course By Path Success", res);
  } catch (error) {
    console.error(error);
    return response(500, error.message, "Get Course By Path Failed", res);
  }
}

export async function getDefaultCourseByPath(req, res) {
  try {
    const data = await prisma.path.findFirst({
      where: { name: "Foundations" },
      include: {
        pathCourses: {
          orderBy: { orderIndex: "asc" },
          include: {
            course: {
              include: {
                LessonCourse: {
                  include: {
                    LessonSection: {
                      include: {
                        lesson: {
                          orderBy: {
                            orderIndex: "asc",
                          },
                        },
                      },
                    },
                  },
                  orderBy: {
                    orderIndex: "asc",
                  },
                },
              },
            },
          },
        },
      },
    });

    const withCounts = {
      ...data,
      pathCourses: data.pathCourses.map((pc) => {
        const sectionsWithCounts = pc.course.LessonCourse.map((lc) => ({
          ...lc.LessonSection,
          lessons: lc.LessonSection?.lesson || [],
          projectCount:
            lc.LessonSection?.lesson?.filter((l) => l.type === "PROJECT")
              .length || 0,
          readingCount:
            lc.LessonSection?.lesson?.filter((l) => l.type === "READING")
              .length || 0,
        }));

        const allLessons = sectionsWithCounts.flatMap(
          (section) => section.lessons
        );
        const totalProjectCount = allLessons.filter(
          (l) => l.type === "PROJECT"
        ).length;
        const totalReadingCount = allLessons.filter(
          (l) => l.type === "READING"
        ).length;

        return {
          ...pc,
          course: {
            ...pc.course,
            sections: sectionsWithCounts,
            projectCount: totalProjectCount,
            readingCount: totalReadingCount,
            totalLessons: allLessons.length,
          },
        };
      }),
    };

    return response(200, withCounts, "Get Course By Path Success", res);
  } catch (error) {
    console.error(error);
    return response(500, error.message, "Get Course By Path Failed", res);
  }
}

export async function getIdPathByTitle(req, res) {
  const { title } = req.params;
  try {
    const data = await prisma.$queryRaw`
      SELECT id FROM path 
      WHERE LOWER(name) = LOWER(${title})
    `;
    return response(200, data, "Get Id By Title Success", res);
  } catch (error) {
    return response(500, error.message, "Get Id Peth By Title Failed", res);
  }
}

// Lesson

export async function deletelesson(req, res) {
  const { id } = req.params;
  try {
    const data = await prisma.lesson.delete({
      where: {
        id: Number(id),
      },
    });
    return response(200, data, "Delete Lesson Success", res);
  } catch (error) {
    return response(500, error.message, "Delete Lesson Failed", res);
  }
}

export async function getLessonContent(req, res) {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/Topax-dev/Lesson_levelUp/refs/heads/main/README.md"
    );
    const content = await response.text();
    return res.status(200).json({
      message: "Lesson content fetched successfully",
      content,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch lesson content",
      error: error.message,
    });
  }
}

export async function getLesson(req, res) {
  try {
    const data = await prisma.lesson.findMany({
      where: {
        lessonSectionId: null,
      },
      orderBy: {
        orderIndex: "asc",
      },
    });
    return response(200, data, "Get Lesson Success", res);
  } catch (error) {
    return response(500, error.message, "Get Lesson Failed", res);
  }
}

export async function getAllLessons(req, res) {
  const { page, search } = req.query;
  try {
    const take = 10;
    const skip = ((Number(page) || 1) - 1) * take;
    const data = await prisma.lesson.findMany({
      take,
      skip,
      where: search
        ? {
            title: {
              contains: search,
            },
          }
        : {},
    });
    return response(200, data, "Get All Lessons Success", res);
  } catch (error) {
    return response(500, error.message, "Get All Lessons Failed", res);
  }
}

export async function getTotalLesson(req, res) {
  try {
    const data = await prisma.lesson.count();
    return response(200, data, "Get Total Lesson Success", res);
  } catch (error) {
    return response(500, error.message, "Get Total Lesson Failed", res);
  }
}

export async function updateIndexLesson(req, res) {
  const payload = req.body;
  try {
    const lastLesson = await prisma.lesson.findFirst({
      where: {
        lessonSectionId: Number(payload[0].lessonSectionId),
      },
      orderBy: {
        orderIndex: "desc",
      },
      select: {
        orderIndex: true,
      },
    });

    let startIndex = lastLesson ? lastLesson.orderIndex + 1 : 1;

    for (const item of payload) {
      await prisma.lesson.update({
        where: {
          id: Number(item.id),
        },
        data: {
          lessonSectionId: Number(item.lessonSectionId),
          orderIndex: startIndex++,
        },
      });
    }
    return response(200, null, "Update lesson Success", res);
  } catch (error) {
    return response(500, error.message, "Update Lesson Failed", res);
  }
}

export async function updateOrderIndexLesson(req, res) {
  const payload = req.body;
  try {
    for (const item of payload) {
      await prisma.lesson.update({
        where: {
          id: Number(item.id),
        },
        data: {
          orderIndex: item.orderIndex,
        },
      });
    }
    return response(200, null, "Update lesson Success", res);
  } catch (error) {
    return response(500, error.message, "Update Lesson Failed", res);
  }
}

export async function getLessonBySectionId(req, res) {
  const { id } = req.params;
  try {
    const data = await prisma.lesson.findMany({
      where: {
        lessonSectionId: Number(id),
      },
      orderBy: {
        orderIndex: "asc",
      },
    });
    return response(200, data, "Get Lesson By Section Id Success", res);
  } catch (error) {
    return response(500, error.message, "Get Lesson By Section Id Failed", res);
  }
}

export async function deleteLessonFromSection(req, res) {
  const { id } = req.params;
  try {
    const data = await prisma.lesson.update({
      where: {
        id: Number(id),
      },
      data: {
        lessonSectionId: null,
      },
    });
    return response(200, data, "Delete Lesson From Section Success", res);
  } catch (error) {
    return response(
      500,
      error.message,
      "Delete Lesson From Section Failed",
      res
    );
  }
}

export async function addLesson(req, res) {
  const { title, type, sourceUrl, content } = req.body;
  try {
    const mathcTitle = await prisma.$queryRaw`
      SELECT title FROM lesson WHERE LOWER(title) = LOWER(${title})
    `;
    if (mathcTitle.length > 0) {
      return response(403, "Bad Request", "Lesson Title Already Exist", res);
    }
    const data = await prisma.lesson.create({
      data: {
        title,
        type,
        ...(sourceUrl && { sourceUrl }),
        ...(content && { content }),
        orderIndex: 1,
      },
    });
    return response(200, data, "Add Lesson Success", res);
  } catch (error) {
    return response(500, error.message, "Add Lesson Failed", res);
  }
}

export async function updateLesson(req, res) {
  const { id } = req.params;
  const { title, type, sourceUrl, content } = req.body;
  try {
    const matchTitle = await prisma.$queryRaw`
      SELECT title FROM lesson WHERE LOWER(title) = LOWER(${title}) AND id != ${Number(
      id
    )}
    `;
    if (matchTitle.length > 0)
      return response(
        403,
        "lesson Title Already Exist",
        "Add Course Failed",
        res
      );
    const data = await prisma.lesson.update({
      where: {
        id: Number(id),
      },
      data: {
        title,
        type,
        ...(sourceUrl && { sourceUrl }),
        ...(content && { content }),
      },
    });
    return response(200, data, "Update Lesson Success", res);
  } catch (error) {
    return response(500, error.message, "Update Lesson Failed", res);
  }
}

export async function getLessonById(req, res) {
  const { id } = req.params;
  try {
    const data = await prisma.lesson.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        LessonSection: {
          select: {
            title: true,
            id: true,
          },
        },
      },
    });
    return response(200, data, "Get Lesson By Id Success", res);
  } catch (error) {
    return response(500, error.message, "Get Lesson By Id Failed", res);
  }
}

export async function getContentWithGithub(req, res) {
  const { id } = req.params;

  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: Number(id) },
    });

    if (!lesson || !lesson.sourceUrl) {
      return response(
        404,
        "Lesson Not Found",
        "Get Content With Github Failed",
        res
      );
    }

    const fetchRes = await fetch(
      `https://raw.githubusercontent.com/Topax-dev/Lesson_levelUp/refs/heads/main/${lesson.sourceUrl}.md`
    );

    if (fetchRes.status == 404)
      return response(
        404,
        "File Not Found",
        "Get Content With Github Failed",
        res
      );

    const content = await fetchRes.text();

    const updatedLesson = await prisma.lesson.update({
      where: { id: Number(id) },
      data: { content, lastSyncedAt: new Date(), isEdited: true },
    });

    return response(200, updatedLesson, "Get Content With Github Success", res);
  } catch (error) {
    return response(500, error.message, "Get Content With Github Failed", res);
  }
}

export async function getLessonByTitle(req, res) {
  const { title, id } = req.params;
  try {
    const data =
      id != null
        ? await prisma.lesson.findFirst({
            where: {
              title,
            },
            include: {
              progress: {
                where: {
                  userId: Number(id),
                },
                select: {
                  status: true,
                },
              },
              LessonSection : {
                include : {
                  lessonCourse : true
                }
              }
            },
          })
        : await prisma.lesson.findFirst({
            where: {
              title,
            },
          });
    return response(200, data, "Get Lesson By Id Success", res);
  } catch (error) {
    return response(500, error.message, "Get Lesson By Id Failed", res);
  }
}

export async function getCourseLessonSectionWithTitleLesson(req, res) {
  const { title, pathId } = req.params;
  try {
    const data = await prisma.lesson.findFirst({
      where: {
        title,
      },
      include: {
        LessonSection: {
          include: {
            lessonCourse: {
              include: {
                course: {
                  include: {
                    pathCourses: {
                      where : {
                        pathId: Number(pathId),
                      },
                      take : 1,
                      orderBy : {id : 'asc'},
                      include: {
                        path: {
                          select: {
                            name: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            lesson: {
              orderBy: {
                orderIndex: "asc",
              },
            },
          },
        },
      },
    });

    const nextLesson = await prisma.lesson.findFirst({
      where: {
        lessonSectionId: data.lessonSectionId,
        orderIndex: { gt: data.orderIndex },
      },
      orderBy: {
        orderIndex: "asc",
      },
      select: {
        title: true,
      },
    });

    return response(
      200,
      [data, nextLesson],
      "Get Title Lesson With Id Lesson Section Success",
      res
    );
  } catch (error) {
    return response(
      500,
      error.message,
      "Get Title Lesson With Id Lesson Section Failed",
      res
    );
  }
}

//Lesson Secton

export async function addLessonSection(req, res) {
  const { titleLessonSection } = req.body;
  try {
    if (!titleLessonSection) return;
    const matchTitle = await prisma.$queryRaw`
      SELECT title FROM lessonsection WHERE LOWER(title) = LOWER(${titleLessonSection})
    `;
    if (matchTitle.length > 0)
      return response(
        403,
        "Title Already Exist",
        "Add Lesson Section Failed",
        res
      );
    const data = await prisma.lessonSection.create({
      data: {
        title: titleLessonSection,
      },
    });
    return response(200, data, "Add Lesson Section Success", res);
  } catch (error) {
    return response(500, error.message, "Add Lesson Section Failed", res);
  }
}

export async function getLessonSection(req, res) {
  try {
    const data = await prisma.lessonSection.findMany();
    return response(200, data, "Get lesson section failed", res);
  } catch (error) {
    return response(500, error.message, "Get Lesson Section Failed", res);
  }
}

export async function getLessonSectionById(req, res) {
  const { id } = req.params;
  try {
    const data = await prisma.lessonSection.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        lesson: true,
        lessonCourse: {
          include: {
            course: true,
          },
        },
      },
    });
    return response(200, data, "Get Lesson Section By Id Success", res);
  } catch (error) {
    return response(500, error.message, "Get Lesson Section By Id Failed", res);
  }
}

export async function updateLessonSection(req, res) {
  const { id } = req.params;
  const { title } = req.body;
  try {
    const data = await prisma.lessonSection.update({
      where: {
        id: Number(id),
      },
      data: {
        title,
      },
    });
    return response(200, data, "Update Lesson Section Success", res);
  } catch (error) {
    return response(500, error, "Update Lesson Section Failed", res);
  }
}

export async function DeleteLessonSection(req, res) {
  const { id } = req.params;
  try {
    const data = await prisma.lessonSection.delete({
      where: {
        id: Number(id),
      },
    });
    return response(200, data, "Delete lesson Section Success", res);
  } catch (error) {
    return response(500, error.message, "Delete Lesson Section Failed", res);
  }
}

// Lesson Course

export async function addLessonCourse(req, res) {
  const { courseId, lessonSectionId } = req.body;
  try {
    const lastIndex = await prisma.lessonCourse.findFirst({
      where: {
        courseId,
      },
      orderBy: {
        orderIndex: "desc",
      },
      select: {
        orderIndex: true,
      },
    });
    let startIndex = lastIndex ? lastIndex.orderIndex + 1 : 1;
    const data = await prisma.lessonCourse.create({
      data: {
        courseId,
        orderIndex: startIndex++,
        lessonSectionId,
      },
    });
    return response(200, data, "Add Lesson Course Success", res);
  } catch (error) {
    return response(500, error.message, "Add Lesson Course Failed", res);
  }
}

export async function updateLessonCourse(req, res) {
  const payload = req.body;

  try {
    for (const item of payload) {
      await prisma.lessonCourse.update({
        where: { id: Number(item.id) },
        data: {
          orderIndex: Number(item.orderIndex),
        },
      });
    }

    return response(200, null, "Update Path Course Success", res);
  } catch (error) {
    return response(500, error.message, "Update Path Course Failed", res);
  }
}

export async function deleteLessonCourse(req, res) {
  const { id } = req.params;
  try {
    const data = await prisma.lessonCourse.delete({
      where: {
        id: Number(id),
      },
    });
    return response(200, data, "Delete Lesson Course Success", res);
  } catch (error) {
    return response(500, error.message, "Delete Lesson Course Failed", res);
  }
}

// Action Admin

export async function getAllActionAdmin(req, res) {
  let { add, search, update, del } = req.query;

  add = add === "true";
  update = update === "true";
  del = del === "true";

  try {
    const actions = [];
    if (add) actions.push("Add");
    if (update) actions.push("Update");
    if (del) actions.push("Delete");

    const data = await prisma.actionAdmin.findMany({
      where: {
        ...(actions.length > 0 ? { action: { in: actions } } : {}),
        ...(search
          ? {
              admin: {
                username: {
                  contains: search,
                },
              },
            }
          : {}),
      },
      include: {
        admin: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    return response(200, data, "Get All Action Admin Success", res);
  } catch (error) {
    return response(500, error.message, "Get All Action Admin Failed", res);
  }
}

export async function addActionAdmin(req, res) {
  const { idAdmin, action, explanation } = req.body;
  try {
    if (!idAdmin)
      return response(493, "Who Is you Bruh", "Add Action Admin Failed", res);

    const data = await prisma.actionAdmin.create({
      data: {
        idAdmin: Number(idAdmin),
        action,
        explanation,
      },
    });
    return response(200, data, "Add Action Admin Success", res);
  } catch (error) {
    return response(500, error.message, "Add Action Admin Failed", res);
  }
}

export async function deleteActionAdmin(req, res) {
  const { id } = req.params;
  try {
    if (!id) return response(403, "Bruhh", "Delete Action Admin Failed", res);

    const data = await prisma.actionAdmin.delete({
      where: {
        id: Number(id),
      },
    });
    return response(200, data, "Delete Action Admin Success", res);
  } catch (error) {
    return response(500, error.message, "Delete Action Admin Failed", res);
  }
}

export async function getDetailActionAdmin(req, res) {
  const { id } = req.params;
  try {
    const data = await prisma.actionAdmin.findMany({
      where: {
        idAdmin: Number(id),
      },
    });
    return response(200, data, "Get Detail Action Admin Success", res);
  } catch (error) {
    return response(500, error.message, "Get Detail Action Admin Failed", res);
  }
}

// Dshboard Admin

export async function getAllDataDashboardAdmin(req, res) {
  try {
    const totalPath = await prisma.path.count();
    const totalCourse = await prisma.course.count();
    const totalLesson = await prisma.lesson.count();
    const totalUser = await prisma.user.count();
    const totalAdmin = await prisma.admin.count({
      where: {
        role: "admin",
      },
    });
    const data = {
      totalPath,
      totalCourse,
      totalLesson,
      totalUser,
      totalAdmin,
    };
    return response(200, data, "Get All Data Dashboard Admin Failed", res);
  } catch (error) {
    return response(
      500,
      error.message,
      "Get All Data Dashboard Admin Failed",
      res
    );
  }
}
