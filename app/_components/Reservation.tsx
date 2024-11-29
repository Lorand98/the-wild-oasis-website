import { getBookedDatesByCabinId, getSettings } from "@/app/_lib/data-service";
import { Tables } from "@/app/_lib/database.types";
import DateSelector from "./DateSelector";
import ReservationForm from "./ReservationForm";
import { ReservationProvider } from "./ReservationContext";
import { auth } from "../_lib/auth";
import LoginMessage from "./LoginMessage";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

async function Reservation({ cabin }: { cabin: Tables<"cabins"> }) {
  const [settings, bookedDates] = await Promise.all([
    getSettings(),
    getBookedDatesByCabinId(Number(cabin.id)),
  ]);
  const session = await auth();

  return (
    <div className="grid grid-cols-2 border border-primary-800 min-h-[400px]">
      <DateSelector settings={settings} bookDates={bookedDates} cabin={cabin} />
      {session?.user ? <ReservationForm cabin={cabin} user={session.user} /> : <LoginMessage />}
    </div>
  );
}

export default Reservation;
