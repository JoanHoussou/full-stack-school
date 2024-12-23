import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Subject, Teacher } from "@prisma/client";
import Link from "next/link";

type SubjectList = Subject & { teachers: Teacher[] };

const SubjectListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const q = searchParams?.q || "";
  const page = Number(searchParams?.page) || 1;

  const columns = [
    {
      header: "Nom",
      accessor: "name",
    },
    {
      header: "Description",
      accessor: "description",
      className: "hidden md:table-cell",
    },
    {
      header: "Enseignants",
      accessor: "teachers",
      className: "hidden md:table-cell",
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
          { name: { contains: q } },
          { description: { contains: q } },
        ],
      }
    : {};

  const subjects = (await prisma.subject.findMany({
    where,
    include: {
      teachers: true,
    },
    take: ITEM_PER_PAGE,
    skip: (page - 1) * ITEM_PER_PAGE,
  })) as SubjectList[];

  const count = await prisma.subject.count({ where });

  const data = subjects.map((subject) => ({
    id: subject.id,
    name: subject.name,
    description: subject.description || "Aucune description",
    teachers: subject.teachers.map((t) => `${t.name} ${t.surname}`).join(", ") || "Aucun enseignant",
    actions: (
      <div className="flex gap-2">
        <Link href={`/list/subjects/${subject.id}`}>
          <button className="py-1 px-2 rounded-md bg-green-500 text-white">
            Voir
          </button>
        </Link>
        <form action="">
          <input type="hidden" name="id" value={subject.id} />
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
        <TableSearch placeholder="Rechercher une matière..." />
        <Link href="/list/subjects/add">
          <button className="p-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors">
            Ajouter une matière
          </button>
        </Link>
      </div>
      <Table columns={columns} data={data} />
      <Pagination count={count} />
      <FormContainer />
    </div>
  );
};

export default SubjectListPage;
