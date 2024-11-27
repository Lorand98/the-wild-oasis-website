import CabinList from "@/app/_components/CabinList";
import Spinner from "@/app/_components/Spinner";
import Filter from "@/app/_components/Filter";
import { Suspense } from "react";
import ReservationReminder from "../_components/ReservationReminder";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// export const revalidate = 3600;

export const metadata = {
  title: "Cabins",
};

type CabinsPageProps = {
  searchParams: {
    capacity?: string;
  };
};

//searchParams cannot be known at build time => the page can no longer be statically generated, so the revalidate at the top does not have effect => searchParams switches the pages to dynamic rendering
export default function Page({ searchParams }: CabinsPageProps) {
  const filter = searchParams?.capacity ?? "all";
  return (
    <div>
      <h1 className="text-4xl mb-5 text-accent-400 font-medium">
        Our Luxury Cabins
      </h1>
      <p className="text-primary-200 text-lg mb-10">
        Cozy yet luxurious cabins, located right in the heart of the Italian
        Dolomites. Imagine waking up to beautiful mountain views, spending your
        days exploring the dark forests around, or just relaxing in your private
        hot tub under the stars. Enjoy nature&apos;s beauty in your own little
        home away from home. The perfect spot for a peaceful, calm vacation.
        Welcome to paradise.
      </p>
      <div className="flex justify-end mb-8">
        <Filter />
      </div>
      {/* the filter will be unique => the fallback will be shown again when the filter changes */}
      <Suspense fallback={<Spinner />} key={filter}>
        <CabinList filter={filter} />
        <ReservationReminder />
      </Suspense>
    </div>
  );
}
