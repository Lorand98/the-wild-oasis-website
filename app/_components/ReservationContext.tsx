"use client";

import { createContext, useContext, useState } from "react";
import { DateRange } from "react-day-picker";

export type ReservationContext = {
  range: DateRange;
  selectRange: (range: DateRange | undefined) => void;
  resetRange: () => void;
};

const initialRangeState: DateRange = {
  from: undefined,
  to: undefined,
};

const defaultContext = {
  range: initialRangeState,
  selectRange: () => {},
  resetRange: () => {},
};

const ReservationContext = createContext<ReservationContext>(defaultContext);

function ReservationProvider({ children }: { children: React.ReactNode }) {
  const [range, setRange] = useState<DateRange>(initialRangeState);

  const resetRange = () => setRange(initialRangeState);

  const selectRange = (range: DateRange | undefined) => {
    if (range === undefined) {
      setRange(initialRangeState);
      return;
    }
    setRange(range);
  };

  return (
    <ReservationContext.Provider value={{ range, selectRange, resetRange }}>
      {children}
    </ReservationContext.Provider>
  );
}

function useReservation() {
  const context = useContext(ReservationContext);
  if (context === undefined) {
    throw new Error("useReservation must be used within a ReservationProvider");
  }
  return context;
}

export { ReservationProvider, useReservation };
