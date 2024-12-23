import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Assignment, Class, Subject, Teacher } from "@prisma/client";
import Link from "next/link";

type AssignmentList = Assignment & {
  lesson: {
    subject: Subject;
    class: Class;
    teacher: Teacher;
  };
};

const AssignmentListPage = async ({
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
      header: "Date limite",
      accessor: "dueDate",
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
          { description: { contains: q } },
          { lesson: { subject: { name: { contains: q } } } },
          { lesson: { class: { name: { contains: q } } } },
          { lesson: { teacher: { name: { contains: q } } } },
          { lesson: { teacher: { surname: { contains: q } } } },
        ],
      }
    : {};

  const assignments = (await prisma.assignment.findMany({
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
  })) as AssignmentList[];

  const count = await prisma.assignment.count({ where });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const data = assignments.map((assignment) => ({
    id: assignment.id,
    title: assignment.title,
    subject: assignment.lesson.subject.name,
    class: assignment.lesson.class.name,
    teacher: `${assignment.lesson.teacher.name} ${assignment.lesson.teacher.surname}`,
    dueDate: formatDate(assignment.dueDate),
    actions: (
      <div className="flex gap-2">
        <Link href={`/list/assignments/${assignment.id}`}>
          <button className="py-1 px-2 rounded-md bg-green-500 text-white">
            Voir
          </button>
        </Link>
        <form action="">
          <input type="hidden" name="id" value={assignment.id} />
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
        <TableSearch placeholder="Rechercher un devoir..." />
        <Link href="/list/assignments/add">
          <button className="p-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors">
            Ajouter un devoir
          </button>
        </Link>
      </div>
      <Table columns={columns} data={data} />
      <Pagination count={count} />
      <FormContainer />
    </div>
  );
};

export default AssignmentListPage;
