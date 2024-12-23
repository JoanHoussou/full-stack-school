import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Parent, Student } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type ParentList = Parent & { students: Student[] };

const ParentListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const q = searchParams?.q || "";
  const page = Number(searchParams?.page) || 1;

  const columns = [
    {
      header: "Info",
      accessor: "info",
    },
    {
      header: "ID",
      accessor: "parentId",
      className: "hidden md:table-cell",
    },
    {
      header: "Enfants",
      accessor: "students",
      className: "hidden md:table-cell",
    },
    {
      header: "Téléphone",
      accessor: "phone",
      className: "hidden lg:table-cell",
    },
    {
      header: "Adresse",
      accessor: "address",
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
          { surname: { contains: q } },
          { email: { contains: q } },
          { phone: { contains: q } },
          { address: { contains: q } },
        ],
      }
    : {};

  const parents = (await prisma.parent.findMany({
    where,
    include: {
      students: true,
    },
    take: ITEM_PER_PAGE,
    skip: (page - 1) * ITEM_PER_PAGE,
  })) as ParentList[];

  const count = await prisma.parent.count({ where });

  const data = parents.map((parent) => ({
    id: parent.id,
    info: (
      <div className="flex gap-4 items-center">
        <Image
          src={parent.img || "/noAvatar.png"}
          alt={`Photo de ${parent.name}`}
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="font-medium">{`${parent.name} ${parent.surname}`}</span>
          <span className="text-sm text-gray-400">{parent.email}</span>
        </div>
      </div>
    ),
    parentId: parent.id,
    students: parent.students.map((s) => `${s.name} ${s.surname}`).join(", "),
    phone: parent.phone || "Non renseigné",
    address: parent.address || "Non renseigné",
    actions: (
      <div className="flex gap-2">
        <Link href={`/list/parents/${parent.id}`}>
          <button className="py-1 px-2 rounded-md bg-green-500 text-white">
            Voir
          </button>
        </Link>
        <form action="">
          <input type="hidden" name="id" value={parent.id} />
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
        <TableSearch placeholder="Rechercher un parent..." />
        <Link href="/list/parents/add">
          <button className="p-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors">
            Ajouter un parent
          </button>
        </Link>
      </div>
      <Table columns={columns} data={data} />
      <Pagination count={count} />
      <FormContainer />
    </div>
  );
};

export default ParentListPage;
