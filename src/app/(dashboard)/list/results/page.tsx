import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import Link from "next/link";

type ResultList = {
  id: number;
  score: number;
  student: {
    id: string;
    name: string;
    surname: string;
  };
  exam: {
    title: string;
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
};

const ResultListPage = async ({
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
      header: "Examen",
      accessor: "exam",
      className: "hidden md:table-cell",
    },
    {
      header: "Matière",
      accessor: "subject",
      className: "hidden md:table-cell",
    },
    {
      header: "Classe",
      accessor: "class",
      className: "hidden lg:table-cell",
    },
    {
      header: "Note",
      accessor: "score",
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
          { exam: { title: { contains: q } } },
          { exam: { lesson: { subject: { name: { contains: q } } } } },
          { exam: { lesson: { class: { name: { contains: q } } } } },
        ],
      }
    : {};

  const results = await prisma.result.findMany({
    where,
    include: {
      student: {
        select: {
          id: true,
          name: true,
          surname: true,
        },
      },
      exam: {
        select: {
          title: true,
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
      },
    },
    take: ITEM_PER_PAGE,
    skip: (page - 1) * ITEM_PER_PAGE,
  });

  const count = await prisma.result.count({ where });

  const data = results
    .filter((result) => result.exam && result.student) // Filtrer les résultats invalides
    .map((result) => ({
      id: result.id,
      student: `${result.student.name} ${result.student.surname}`,
      exam: result.exam.title,
      subject: result.exam.lesson.subject.name,
      class: result.exam.lesson.class.name,
      score: `${result.score}/20`,
      actions: (
        <div className="flex gap-2">
          <Link href={`/list/results/${result.id}`}>
            <button className="py-1 px-2 rounded-md bg-green-500 text-white">
              Voir
            </button>
          </Link>
          <form action="">
            <input type="hidden" name="id" value={result.id} />
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
        <TableSearch placeholder="Rechercher un résultat..." />
        <Link href="/list/results/add">
          <button className="p-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors">
            Ajouter un résultat
          </button>
        </Link>
      </div>
      <Table columns={columns} data={data} />
      <Pagination count={count} />
      <FormContainer />
    </div>
  );
};

export default ResultListPage;
