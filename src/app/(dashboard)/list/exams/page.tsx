import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Class, Exam, Subject, Teacher } from "@prisma/client";
import Link from "next/link";

type ExamList = Exam & {
  lesson: {
    subject: Subject;
    class: Class;
    teacher: Teacher;
  };
};

const ExamListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const q = searchParams?.q || "";
  const page = Number(searchParams?.page) || 1;

  const columns = [
    {
      header: "Titre",
      accessor: "title",
    },
    {
      header: "Matière",
      accessor: "subject",
      className: "hidden md:table-cell",
    },
    {
      header: "Classe",
      accessor: "class",
      className: "hidden md:table-cell",
    },
    {
      header: "Enseignant",
      accessor: "teacher",
      className: "hidden lg:table-cell",
    },
    {
      header: "Date",
      accessor: "date",
      className: "hidden lg:table-cell",
    },
    {
      header: "Actions",
      accessor: "actions",
      className: "w-24",
    },
  ];

  const where = q
    ? {
        OR: [
          { title: { contains: q } },
          { lesson: { subject: { name: { contains: q } } } },
          { lesson: { class: { name: { contains: q } } } },
          { lesson: { teacher: { name: { contains: q } } } },
          { lesson: { teacher: { surname: { contains: q } } } },
        ],
      }
    : {};

  const exams = (await prisma.exam.findMany({
    where,
    include: {
      lesson: {
        include: {
          subject: true,
          class: true,
          teacher: true,
        },
      },
    },
    take: ITEM_PER_PAGE,
    skip: (page - 1) * ITEM_PER_PAGE,
  })) as ExamList[];

  const count = await prisma.exam.count({ where });

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const data = exams.map((exam) => ({
    id: exam.id,
    title: exam.title,
    subject: exam.lesson.subject.name,
    class: exam.lesson.class.name,
    teacher: `${exam.lesson.teacher.name} ${exam.lesson.teacher.surname}`,
    date: `${formatDateTime(exam.startTime)} - ${new Intl.DateTimeFormat("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(exam.endTime)}`,
    actions: (
      <div className="flex gap-2">
        <Link href={`/list/exams/${exam.id}`}>
          <button className="py-1 px-2 rounded-md bg-green-500 text-white">
            Voir
          </button>
        </Link>
        <form action="">
          <input type="hidden" name="id" value={exam.id} />
          <button className="py-1 px-2 rounded-md bg-red-500 text-white">
            Supprimer
          </button>
        </form>
      </div>
    ),
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <TableSearch placeholder="Rechercher un examen..." />
        <Link href="/list/exams/add">
          <button className="p-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors">
            Ajouter un examen
          </button>
        </Link>
      </div>
      <Table columns={columns} data={data} />
      <Pagination count={count} />
      <FormContainer />
    </div>
  );
};

export default ExamListPage;
