import EventCalendar from "./EventCalendar";
import EventList from "./EventList";

const EventCalendarContainer = async ({
  searchParams,
}: {
  searchParams: { [keys: string]: string | undefined };
}) => {
  const { date } = searchParams;
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Calendrier des événements</h2>
      <EventCalendar />
      <div className="mt-6">
        <h3 className="text-base font-medium text-gray-900 mb-4">Événements du jour</h3>
        <div className="flex flex-col gap-4">
          <EventList dateParam={date} />
        </div>
      </div>
    </div>
  );
};

export default EventCalendarContainer;
