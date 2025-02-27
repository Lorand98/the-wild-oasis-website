"use client";

import React from "react";
import { updateGuest } from "../_lib/actions";
import { Tables } from "../_lib/database.types";
import SubmitButton from "./SubmitButton";
import Image from "next/image";

function UpdateProfileForm({
  children,
  guest,
}: {
  children: React.ReactNode;
  guest: Tables<"guests">;
}) {
  const { fullName, email, nationalID, countryFlag } = guest;

  return (
    <form
      className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col"
      action={updateGuest}
    >
      <div className="space-y-2">
        <label>Full name</label>
        <input
          disabled
          defaultValue={fullName || ""}
          name="fullName"
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <label>Email address</label>
        <input
          disabled
          defaultValue={email || ""}
          name="email"
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          {countryFlag && (
            <Image
              src={countryFlag}
              alt="Country flag"
              className="h-5 rounded-sm"
              width={20}
              height={20}
            />
          )}
        </div>

        {children}
      </div>

      <div className="space-y-2">
        <label htmlFor="nationalID">National ID number</label>
        <input
          name="nationalID"
          defaultValue={nationalID || ""}
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
        />
      </div>

      <div className="flex justify-end items-center gap-6">
        <SubmitButton pendingLabel="Updating profile...">
          Update profile
        </SubmitButton>
      </div>
    </form>
  );
}

export default UpdateProfileForm;
