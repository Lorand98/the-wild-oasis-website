import UpdateReservationForm from "@/app/_components/UpdateReservationForm";
import { auth } from "@/app/_lib/auth";
import { getBooking, getCabin } from "@/app/_lib/data-service";

export default async function Page({
  params,
}: {
  params: { bookingId: number };
}) {
  const session = await auth();

  if (!session) {
    throw new Error("Not Authorized! Log in again");
  }

  const { bookingId } = params;

  const booking = await getBooking(bookingId);

  if (!booking) throw new Error("Booking not found");

  const cabin = await getCabin(booking.cabinId);

  const { maxCapacity } = cabin;

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Edit Reservation #{bookingId}
      </h2>

      <UpdateReservationForm
        booking={booking}
        bookingId={bookingId}
        maxCapacity={maxCapacity}
      />
    </div>
  );
}
