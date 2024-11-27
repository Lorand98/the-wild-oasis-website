import CabinCard from "./CabinCard";

import { getCabins } from "@/app/_lib/data-service";

type CabinListProps = {
  filter: string;
};

async function CabinList({ filter }: CabinListProps) {
  const cabins = await getCabins();

  if (!cabins.length) return null;

  let displayedCabins;

  if (filter === "all") {
    displayedCabins = cabins;
  } else if (filter === "small") {
    displayedCabins = cabins.filter(
      (cabin) => cabin.maxCapacity && cabin.maxCapacity <= 3
    );
  } else if (filter === "medium") {
    displayedCabins = cabins.filter(
      (cabin) =>
        cabin.maxCapacity && cabin.maxCapacity >= 4 && cabin.maxCapacity <= 7
    );
  } else if (filter === "large") {
    displayedCabins = cabins.filter(
      (cabin) => cabin.maxCapacity && cabin.maxCapacity >= 8
    );
  }

  if (!displayedCabins || displayedCabins.length === 0) {
    return null;
  }

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
      {displayedCabins.map((cabin) => (
        <CabinCard cabin={cabin} key={cabin.id} />
      ))}
    </div>
  );
}

export default CabinList;
