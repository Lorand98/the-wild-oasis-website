"use client";

import { useOptimistic } from "react";
import { BookingsWithCabin } from "../_lib/data-service";
import ReservationCard from "./ReservationCard";
import { deleteReservation } from "../_lib/actions";

export default function ReservationList({
  bookings,
}: {
  bookings: BookingsWithCabin;
}) {
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (prevBookings: BookingsWithCabin, bookingId: number) => {
      return prevBookings.filter((booking) => booking.id !== bookingId);
    }
  );

  const handleDelete = async (bookingId: number) => {
    optimisticDelete(bookingId);
    await deleteReservation(bookingId);
  };

  return (
    <ul className="space-y-6">
      {optimisticBookings.map((booking) => (
        <ReservationCard
          booking={booking}
          key={booking.id}
          onDelete={handleDelete}
        />
      ))}
    </ul>
  );
}
