"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const EventCalendar = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Initialiser avec la date de l'URL ou la date actuelle
  const initDate = (() => {
    const dateParam = searchParams.get('date');
    if (dateParam) {
      const parsed = new Date(dateParam);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    return new Date();
  })();

  const [value, onChange] = useState<Value>(initDate);

  useEffect(() => {
    if (value instanceof Date) {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, '0');
      const day = String(value.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      router.push(`?date=${formattedDate}`);
    }
  }, [value, router]);

  return (
    <div className="calendar-container">
      <Calendar 
        onChange={onChange} 
        value={value}
        locale="fr-FR"
        className="rounded-lg border-none shadow-sm"
      />
      <style jsx global>{`
        .calendar-container .react-calendar {
          border: none;
          font-family: inherit;
          width: 100%;
        }
        .react-calendar__tile--active {
          background: #6366f1 !important;
          color: white;
        }
        .react-calendar__tile--now {
          background: #e0e7ff;
        }
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background: #818cf8;
          color: white;
        }
        .react-calendar__tile--hasActive {
          background: #6366f1 !important;
        }
        .react-calendar__navigation button:enabled:hover,
        .react-calendar__navigation button:enabled:focus {
          background-color: #e0e7ff;
        }
        .react-calendar__month-view__weekdays {
          text-transform: uppercase;
          font-weight: bold;
          font-size: 0.8em;
        }
      `}</style>
    </div>
  );
};

export default EventCalendar;
