import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";

import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Class, Prisma, Student } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type StudentList = Student & { class: Class };

const StudentListPage = async ({
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
      header: "ID Étudiant",
      accessor: "studentId",
      className: "hidden md:table-cell",
    },
    {
      header: "Niveau",
      accessor: "grade",
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

  const students = (await prisma.student.findMany({
    where,
    include: {
      class: true,
    },
    take: ITEM_PER_PAGE,
    skip: (page - 1) * ITEM_PER_PAGE,
  })) as StudentList[];

  const count = await prisma.student.count({ where });

  const data = students.map((student) => ({
    id: student.id,
    info: (
      <div className="flex gap-4 items-center">
        <Image
          src={student.img || "/noAvatar.png"}
          alt={`Photo de ${student.name}`}
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="font-medium">{`${student.name} ${student.surname}`}</span>
          <span className="text-sm text-gray-400">{student.email}</span>
        </div>
      </div>
    ),
    studentId: student.id,
    grade: student.class?.name,
    phone: student.phone,
    address: student.address,
    actions: (
      <div className="flex gap-2">
        <Link href={`/students/${student.id}`}>
          <button className="py-1 px-2 rounded-md bg-green-500 text-white">
            Voir
          </button>
        </Link>
        <form action="">
          <input type="hidden" name="id" value={student.id} />
          <button className="py-1 px-2 rounded-md bg-red-500 text-white">
            Supprimer
          </button>
        </form>
      </div>
    ),
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <TableSearch placeholder="Rechercher un étudiant..." />
        <Link href="/students/add">
          <button className="p-2 bg-purple-500 text-white rounded-md">
            Ajouter un étudiant
          </button>
        </Link>
      </div>
      <Table columns={columns} data={data} />
      <Pagination count={count} />
      <FormContainer />
    </div>
  );
};

export default StudentListPage;
