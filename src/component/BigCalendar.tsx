'use client'

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useCallback, useState } from "react";

const localizer = momentLocalizer(moment);

const BigCalendar = ({
  data,
}: {
  data: { title: string; start: Date; end: Date }[];
}) => {
  const [view, setView] = useState<View>(Views.WEEK);

  const handleOnChangeView = useCallback((selectedView: View) => {
    setView(selectedView);
  }, [setView]);
  const minDate = data[0]?.start ?? new Date(2025, 1, 0, 8, 0, 0);
  const maxDate = data[data.length - 1]?.end ?? new Date(2025, 1, 0, 15, 30, 0);

  return (
    <Calendar
      localizer={localizer}
      events={data}
      startAccessor="start"
      endAccessor="end"
      views={["week", "day"]}
      view={view}
      style={{ height: "98%" }}
      onView={handleOnChangeView}
      min={minDate || new Date(2025, 1, 0, 8, 0, 0)}
      max={maxDate || new Date(2025, 1, 0, 15, 30, 0)}
    />
  );
};

export default BigCalendar;
