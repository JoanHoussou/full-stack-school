import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Class, Teacher } from "@prisma/client";
import Link from "next/link";

type ClassList = Class & { supervisor: Teacher };

const ClassListPage = async ({
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
      header: "Niveau",
      accessor: "grade",
      className: "hidden md:table-cell",
    },
    {
      header: "Professeur principal",
      accessor: "supervisor",
      className: "hidden md:table-cell",
    },
    {
      header: "Capacité",
      accessor: "capacity",
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
          { name: { contains: q } },
          { supervisor: { name: { contains: q } } },
          { supervisor: { surname: { contains: q } } },
        ],
      }
    : {};

  const classes = (await prisma.class.findMany({
    where,
    include: {
      supervisor: true,
    },
    take: ITEM_PER_PAGE,
    skip: (page - 1) * ITEM_PER_PAGE,
  })) as ClassList[];

  const count = await prisma.class.count({ where });

  const data = classes.map((classItem) => ({
    id: classItem.id,
    name: classItem.name,
    grade: `${classItem.gradeLevel}${classItem.gradeName}`,
    supervisor: classItem.supervisor 
      ? `${classItem.supervisor.name} ${classItem.supervisor.surname}`
      : "Non assigné",
    capacity: `${classItem.currentCapacity}/${classItem.maxCapacity}`,
    actions: (
      <div className="flex gap-2">
        <Link href={`/list/classes/${classItem.id}`}>
          <button className="py-1 px-2 rounded-md bg-green-500 text-white">
            Voir
          </button>
        </Link>
        <form action="">
          <input type="hidden" name="id" value={classItem.id} />
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
        <TableSearch placeholder="Rechercher une classe..." />
        <Link href="/list/classes/add">
          <button className="p-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors">
            Ajouter une classe
          </button>
        </Link>
      </div>
      <Table columns={columns} data={data} />
      <Pagination count={count} />
      <FormContainer />
    </div>
  );
};

export default ClassListPage;
