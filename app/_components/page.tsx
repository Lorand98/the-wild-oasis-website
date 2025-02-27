import TextExpander from "@/app/_components/TextExpander";
import { getCabin, getCabins } from "@/app/_lib/data-service";
import { EyeSlashIcon, MapPinIcon, UsersIcon } from "@heroicons/react/24/solid";

import Image from "next/image";

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
  if (!cabin) {
    throw new Error("Cabin not found");
  }
  const { name, maxCapacity, image, description } = cabin;

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <div className="grid grid-cols-[3fr_4fr] gap-20 border border-primary-800 py-3 px-10 mb-24">
        <div className="relative scale-[1.15] -translate-x-3">
          <Image
            src={image || ""}
            fill
            className="object-cover"
            alt={`Cabin ${name}`}
          />
        </div>

        <div>
          <h3 className="text-accent-100 font-black text-7xl mb-5 translate-x-[-254px] bg-primary-950 p-6 pb-1 w-[150%]">
            Cabin {name}
          </h3>

          <p className="text-lg text-primary-300 mb-10">
            <TextExpander>{description}</TextExpander>
          </p>

          <ul className="flex flex-col gap-4 mb-7">
            <li className="flex gap-3 items-center">
              <UsersIcon className="h-5 w-5 text-primary-600" />
              <span className="text-lg">
                For up to <span className="font-bold">{maxCapacity}</span>{" "}
                guests
              </span>
            </li>
            <li className="flex gap-3 items-center">
              <MapPinIcon className="h-5 w-5 text-primary-600" />
              <span className="text-lg">
                Located in the heart of the{" "}
                <span className="font-bold">Dolomites</span> (Italy)
              </span>
            </li>
            <li className="flex gap-3 items-center">
              <EyeSlashIcon className="h-5 w-5 text-primary-600" />
              <span className="text-lg">
                Privacy <span className="font-bold">100%</span> guaranteed
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div>
        <h2 className="text-5xl font-semibold text-center">
          Reserve {name} today. Pay on arrival.
        </h2>

        <div></div>
      </div>
    </div>
  );
}
