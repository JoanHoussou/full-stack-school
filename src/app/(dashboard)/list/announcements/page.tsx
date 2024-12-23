import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import Link from "next/link";

type AnnouncementList = {
  id: number;
  title: string;
  description: string;
  date: Date;
  class: {
    name: string;
  } | null;
};

const AnnouncementListPage = async ({
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
      header: "Description",
      accessor: "description",
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
          { class: { name: { contains: q } } },
        ],
      }
    : {};

  const announcements = await prisma.announcement.findMany({
    where,
    include: {
      class: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
    take: ITEM_PER_PAGE,
    skip: (page - 1) * ITEM_PER_PAGE,
  });

  const count = await prisma.announcement.count({ where });

  const formatDate = (date: Date | string | null) => {
    if (!date) return "Non définie";
    
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(dateObj);
    } catch (error) {
      console.error("Erreur de formatage de la date:", error);
      return "Date invalide";
    }
  };

  const data = announcements.map((announcement) => ({
    id: announcement.id,
    title: announcement.title || "Sans titre",
    description: announcement.description || "Aucun contenu",
    class: announcement.class?.name || "Toutes les classes",
    date: formatDate(announcement.date),
    actions: (
      <div className="flex gap-2">
        <Link href={`/list/announcements/${announcement.id}`}>
          <button className="py-1 px-2 rounded-md bg-green-500 text-white">
            Voir
          </button>
        </Link>
        <form action="">
          <input type="hidden" name="id" value={announcement.id} />
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
        <TableSearch placeholder="Rechercher une annonce..." />
        <Link href="/list/announcements/add">
          <button className="p-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors">
            Ajouter une annonce
          </button>
        </Link>
      </div>
      <Table columns={columns} data={data} />
      <Pagination count={count} />
      <FormContainer />
    </div>
  );
};

export default AnnouncementListPage;
