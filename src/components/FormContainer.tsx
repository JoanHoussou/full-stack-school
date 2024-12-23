import prisma from "@/lib/prisma";
import FormModal from "./FormModal";

export type FormContainerProps = {
  table?:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement";
  type?: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps = {}) => {
  let relatedData = {};

  if (type !== "delete" && table) {
    switch (table) {
      case "subject":
        const subjectTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { teachers: subjectTeachers };
        break;
      case "class":
        const classGrades = await prisma.grade.findMany({
          select: { id: true, level: true },
        });
        const classTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { teachers: classTeachers, grades: classGrades };
        break;
      case "teacher":
        const teacherSubjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        });
        relatedData = { subjects: teacherSubjects };
        break;
      case "student":
        const studentGrades = await prisma.grade.findMany({
          select: { id: true, level: true },
        });
        const studentClasses = await prisma.class.findMany({
          select: { id: true, name: true },
        });
        const studentParents = await prisma.parent.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = {
          grades: studentGrades,
          classes: studentClasses,
          parents: studentParents,
        };
        break;
      case "lesson":
        const lessonSubjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        });
        const lessonTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        const lessonClasses = await prisma.class.findMany({
          select: { id: true, name: true },
        });
        relatedData = {
          subjects: lessonSubjects,
          teachers: lessonTeachers,
          classes: lessonClasses,
        };
        break;
      case "exam":
        const examLessons = await prisma.lesson.findMany({
          select: { id: true, subject: { select: { name: true } } },
          where: { teacherId: data?.teacherId },
        });
        relatedData = { lessons: examLessons };
        break;
      default:
        break;
    }
  }

  return (
    <div className="">
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
    </div>
  );
};

export default FormContainer;
