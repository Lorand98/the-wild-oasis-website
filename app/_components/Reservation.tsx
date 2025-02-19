import { getBookedDatesByCabinId, getSettings } from "@/app/_lib/data-service";
import { Tables } from "@/app/_lib/database.types";
import { auth } from "../_lib/auth";
import DateSelector from "./DateSelector";
import LoginMessage from "./LoginMessage";
import ReservationForm from "./ReservationForm";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

async function Reservation({ cabin }: { cabin: Tables<"cabins"> }) {
  const [settings, bookedDates] = await Promise.all([
    getSettings(),
    getBookedDatesByCabinId(Number(cabin.id)),
  ]);
  const session = await auth();

  return (
    <div className="grid grid-cols-2 border border-primary-800 min-h-[400px]">
      <DateSelector
        settings={settings}
        bookedDates={bookedDates}
        cabin={cabin}
      />
      {session?.user?.name && session.user?.image ? (
        <ReservationForm cabin={cabin} user={{name: session.user.name, image: session.user.image}} />
      ) : (
        <LoginMessage />
      )}
    </div>
  );
}

export default Reservation;
