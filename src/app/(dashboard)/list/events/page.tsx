import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import Link from "next/link";

type EventList = {
  id: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  class: {
    name: string;
  };
};

const EventListPage = async ({
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
      header: "Date de début",
      accessor: "startDate",
      className: "hidden lg:table-cell",
    },
    {
      header: "Date de fin",
      accessor: "endDate",
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

  const events = await prisma.event.findMany({
    where,
    include: {
      class: {
        select: {
          name: true,
        },
      },
    },
    take: ITEM_PER_PAGE,
    skip: (page - 1) * ITEM_PER_PAGE,
  });

  const count = await prisma.event.count({ where });

  const formatDate = (date: Date | string | null) => {
    if (!date) return "Non définie";
    
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(dateObj);
    } catch (error) {
      console.error("Erreur de formatage de la date:", error);
      return "Date invalide";
    }
  };

  const data = events
    .filter((event) => event.class) // Filtrer les événements sans classe
    .map((event) => ({
      id: event.id,
      title: event.title || "Sans titre",
      description: event.description || "Aucune description",
      class: event.class.name,
      startDate: formatDate(event.startDate),
      endDate: formatDate(event.endDate),
      actions: (
        <div className="flex gap-2">
          <Link href={`/list/events/${event.id}`}>
            <button className="py-1 px-2 rounded-md bg-green-500 text-white">
              Voir
            </button>
          </Link>
          <form action="">
            <input type="hidden" name="id" value={event.id} />
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
        <TableSearch placeholder="Rechercher un événement..." />
        <Link href="/list/events/add">
          <button className="p-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors">
            Ajouter un événement
          </button>
        </Link>
      </div>
      <Table columns={columns} data={data} />
      <Pagination count={count} />
      <FormContainer />
    </div>
  );
};

export default EventListPage;
