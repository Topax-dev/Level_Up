import { NotifType } from "./tAll";

export interface INotifSlice {
  id: number;
  message: string;
  type: NotifType;
  show: boolean;
}

export interface IUserSlice {
  id: number;
  avatar: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  purpose: string;
  selectedPath: number | null;
}

export interface IProgresSlice {
  id: number;
  status: string;
  completedAt: string;
  userId: number;
  lessonId: number;
}

export interface ICourse2 {
  id: number;
  imageCourse: string;
  title: string;
  description: string;
}

export interface ILoadingSlice {
  show: boolean;
}

export interface IPath {
  id: number;
  name: string;
  description: string;
  isPublished: boolean;
  imagePath: string;
  _count: { pathCourses: number };
}

export interface ITitleParams {
  params: {
    title: string;
  };
}

export interface ICourse {
  id: number;
  pathId: number;
  courseId: number;
  orderIndex: number;
  course: {
    id: number;
    title: string;
    description: string;
    imageCourse: string;
    projectCount: number;
    readingCount: number;
    completedLesson: number;
    totalLessons: number;
  };
}

export interface ICourseOnly {
  id: number;
  title: string;
  description: string;
  imageCourse: string;
  totalProjectCount: number;
  totalReadingCount: number;
}

export interface IFormCourse {
  asset: string | null | File;
  title: string;
  description: string;
  preview: string;
}

export interface IAdminSlice {
  id: number;
  avatar: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICourseLesson {
  id: number;
  description: string;
  imageCourse: string;
  title: string;
}

export interface ILessonLessonSection {
  id: number;
  courseId: number;
  lessonId: number;
  lessonSectionId: number;
  orderIndex: number;
  LessonSection: {
    id: number;
    title: string;
    lesson: {
      id: number;
      title: string;
      content: string;
      type: string;
      progress: {
        status: string;
      }[];
    }[];
  };
}

export interface ILesson {
  id: number;
  title: string;
  content: string;
  sourceUrl: string;
  type: string;
}

export interface ILessonProgress {
  id: number;
  title: string;
  content: string;
  sourceUrl: string;
  progress: {
    status: string;
  }[];
  type: string;
}

export interface IDetailCourse {
  id: number;
  title: string;
  imageCourse: string;
  description: string;
  pathCourses: {
    path: {
      id: number;
      name: string;
    };
  }[];
  LessonCourse: {
    LessonSection: {
      lesson: {
        title: string;
        type: string;
        id: number;
      }[];
    };
  }[];
}

export interface IDetailPath {
  id: number;
  description: string;
  imagePath: string;
  isPublished: boolean;
  name: string;
  pathCourses: {
    course: {
      id: number;
      title: string;
    };
  }[];
}

export interface IDetailLeson {
  id: number;
  content: string;
  type: string;
  title: string;
  sourceUrl: string;
  LessonSection: {
    title: string;
    id: number
  };
}

export interface IAdminDashboard {
  totalLesson: number;
  totalPath: number;
  totalCourse: number;
  totalUser: number;
  totalAdmin: number;
}

export interface IActionAdmin {
  id: number;
  idAdmin: number;
  action: string;
  explanation: string;
}

export interface IAllActionAdmin extends IActionAdmin {
  admin : {
    username : string
  }
}


export interface ISection {
  id : number
  title : string
}


export interface IDetailSection extends ISection {
  lesson : {
    id : number
    title : string
    type : string
  }[]
  lessonCourse : {
    course : {
      id : number
      title : string
    }
  }[]
}