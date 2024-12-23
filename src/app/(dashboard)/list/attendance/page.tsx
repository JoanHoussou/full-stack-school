import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import Link from "next/link";

type AttendanceList = {
  id: number;
  date: Date;
  present: boolean;
  student: {
    id: string;
    name: string;
    surname: string;
  };
  lesson: {
    subject: {
      name: string;
    };
    class: {
      name: string;
    };
    teacher: {
      name: string;
      surname: string;
    };
  };
};

const AttendanceListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const q = searchParams?.q || "";
  const page = Number(searchParams?.page) || 1;

  const columns = [
    {
      header: "Élève",
      accessor: "student",
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
      header: "Date",
      accessor: "date",
      className: "hidden lg:table-cell",
    },
    {
      header: "Statut",
      accessor: "status",
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
          { student: { name: { contains: q } } },
          { student: { surname: { contains: q } } },
          { lesson: { subject: { name: { contains: q } } } },
          { lesson: { class: { name: { contains: q } } } },
        ],
      }
    : {};

  const attendance = await prisma.attendance.findMany({
    where,
    include: {
      student: {
        select: {
          id: true,
          name: true,
          surname: true,
        },
      },
      lesson: {
        select: {
          subject: {
            select: {
              name: true,
            },
          },
          class: {
            select: {
              name: true,
            },
          },
          teacher: {
            select: {
              name: true,
              surname: true,
            },
          },
        },
      },
    },
    take: ITEM_PER_PAGE,
    skip: (page - 1) * ITEM_PER_PAGE,
  });

  const count = await prisma.attendance.count({ where });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const getStatusColor = (present: boolean | null | undefined) => {
    if (present === null || present === undefined) return "bg-gray-100 text-gray-800";
    return present
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const translateStatus = (present: boolean | null | undefined) => {
    if (present === null || present === undefined) return "Non défini";
    return present ? "Présent" : "Absent";
  };

  const data = attendance
    .filter((item) => item.student && item.lesson) // Filtrer les présences invalides
    .map((item) => ({
      id: item.id,
      student: `${item.student.name} ${item.student.surname}`,
      subject: item.lesson.subject.name,
      class: item.lesson.class.name,
      date: formatDate(item.date),
      status: (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            item.present
          )}`}
        >
          {translateStatus(item.present)}
        </span>
      ),
      actions: (
        <div className="flex gap-2">
          <Link href={`/list/attendance/${item.id}`}>
            <button className="py-1 px-2 rounded-md bg-green-500 text-white">
              Voir
            </button>
          </Link>
          <form action="">
            <input type="hidden" name="id" value={item.id} />
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
        <TableSearch placeholder="Rechercher une présence..." />
        <Link href="/list/attendance/add">
          <button className="p-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors">
            Ajouter une présence
          </button>
        </Link>
      </div>
      <Table columns={columns} data={data} />
      <Pagination count={count} />
      <FormContainer />
    </div>
  );
};

export default AttendanceListPage;
