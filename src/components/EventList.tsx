import prisma from "@/lib/prisma";

const EventList = async ({ dateParam }: { dateParam: string | undefined }) => {
  // Utiliser la date actuelle comme valeur par défaut
  const now = new Date();
  let targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (dateParam) {
    try {
      // Essayer de parser la date de différentes manières
      const parsedDate = new Date(dateParam);
      if (!isNaN(parsedDate.getTime())) {
        targetDate = new Date(
          parsedDate.getFullYear(),
          parsedDate.getMonth(),
          parsedDate.getDate()
        );
      }
    } catch (error) {
      console.error("Erreur de parsing de la date:", error);
    }
  }

  // Créer les dates de début et de fin du jour
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  try {
    const data = await prisma.event.findMany({
      where: {
        startTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: {
        startTime: 'asc'
      },
    });

    if (data.length === 0) {
      return (
        <div className="text-center text-gray-500 py-4">
          Aucun événement pour cette date
        </div>
      );
    }

    return data.map((event) => (
      <div
        className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple"
        key={event.id}
      >
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-gray-600">{event.title}</h1>
          <span className="text-gray-400 text-sm">
            {new Intl.DateTimeFormat("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            }).format(event.startTime)}
          </span>
        </div>
        <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
      </div>
    ));
  } catch (error) {
    console.error("Erreur lors de la récupération des événements:", error);
    return (
      <div className="text-center text-red-500 py-4">
        Une erreur est survenue lors du chargement des événements
      </div>
    );
  }
};

export default EventList;
