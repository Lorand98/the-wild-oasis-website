import { getBookedDatesByCabinId, getCabin } from "@/app/_lib/data-service";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { cabinId: string };
  }
) {
  const { cabinId } = params;

  try {
    const [cabin, bookedDates] = await Promise.all([
      getCabin(Number(cabinId)),
      getBookedDatesByCabinId(Number(cabinId)),
    ]);

    return Response.json({ cabin, bookedDates });
  } catch {
    return Response.json({ message: "Cabin not found" });
  }
}

// export async function POST() {}
