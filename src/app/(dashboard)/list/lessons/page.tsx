import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Class, Lesson, Subject, Teacher } from "@prisma/client";
import Link from "next/link";

type LessonList = Lesson & { subject: Subject } & { class: Class } & {
  teacher: Teacher;
};

const LessonListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const q = searchParams?.q || "";
  const page = Number(searchParams?.page) || 1;

  const columns = [
    {
      header: "Matière",
      accessor: "subject",
    },
    {
      header: "Classe",
      accessor: "class",
      className: "hidden md:table-cell",
    },
    {
      header: "Enseignant",
      accessor: "teacher",
      className: "hidden md:table-cell",
    },
    {
      header: "Horaire",
      accessor: "schedule",
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
          { subject: { name: { contains: q } } },
          { class: { name: { contains: q } } },
          { teacher: { name: { contains: q } } },
          { teacher: { surname: { contains: q } } },
        ],
      }
    : {};

  const lessons = (await prisma.lesson.findMany({
    where,
    include: {
      subject: true,
      class: true,
      teacher: true,
    },
    take: ITEM_PER_PAGE,
    skip: (page - 1) * ITEM_PER_PAGE,
  })) as LessonList[];

  const count = await prisma.lesson.count({ where });

  const formatTime = (time: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(time);
  };

  const formatDay = (day: number) => {
    const days = [
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
      "Dimanche",
    ];
    return days[day - 1];
  };

  const data = lessons.map((lesson) => ({
    id: lesson.id,
    subject: lesson.subject.name,
    class: lesson.class.name,
    teacher: `${lesson.teacher.name} ${lesson.teacher.surname}`,
    schedule: `${formatDay(lesson.dayOfWeek)} ${formatTime(lesson.startTime)} - ${formatTime(lesson.endTime)}`,
    actions: (
      <div className="flex gap-2">
        <Link href={`/list/lessons/${lesson.id}`}>
          <button className="py-1 px-2 rounded-md bg-green-500 text-white">
            Voir
          </button>
        </Link>
        <form action="">
          <input type="hidden" name="id" value={lesson.id} />
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
        <TableSearch placeholder="Rechercher une leçon..." />
        <Link href="/list/lessons/add">
          <button className="p-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors">
            Ajouter une leçon
          </button>
        </Link>
      </div>
      <Table columns={columns} data={data} />
      <Pagination count={count} />
      <FormContainer />
    </div>
  );
};

export default LessonListPage;
