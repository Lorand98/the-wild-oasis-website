import Cabin from "@/app/_components/Cabin";
import Reservation from "@/app/_components/Reservation";
import Spinner from "@/app/_components/Spinner";

import { getCabin, getCabins } from "@/app/_lib/data-service";

import { Suspense } from "react";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

type CabinParams = {
  cabinId: string;
};

export async function generateMetadata({ params }: { params: CabinParams }) {
  const { name } = (await getCabin(Number(params.cabinId))) || {};
  return {
    title: `Cabin ${name || ""}`,
  };
}

export async function generateStaticParams() {
  const cabins = await getCabins();
  return cabins.map(({ id }) => ({ cabinId: String(id) }));
}

export default async function Page({
  params,
}: {
  params: { cabinId: string };
}) {
  const cabin = await getCabin(Number(params.cabinId));

  // ])
  if (!cabin) {
    throw new Error("Cabin not found");
  }

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Cabin cabin={cabin} />

      <div>
        <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
          Reserve {cabin.id} today. Pay on arrival.
        </h2>

        <Suspense fallback={<Spinner />}>
          <Reservation cabin={cabin} />
        </Suspense>
      </div>
    </div>
  );
}
