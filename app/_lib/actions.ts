"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";
import { Tables } from "./database.types";

export async function signInAction() {
  await signIn("google", {
    redirectTo: "/account",
  });
}

export async function signOutAction() {
  await signOut({
    redirectTo: "/",
  });
}

export async function updateGuest(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("You have to be logged in!");

  // Extract values safely
  const nationalID = formData.get("nationalID");
  const nationalityFlag = formData.get("nationality");

  // Ensure values are strings and not null
  if (typeof nationalID !== "string" || typeof nationalityFlag !== "string") {
    throw new Error("Invalid form data received.");
  }

  // Validate national ID format
  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID)) {
    throw new Error("Please provide a valid national ID!");
  }

  // Ensure nationalityFlag is properly formatted
  if (!nationalityFlag.includes("%")) {
    throw new Error("Invalid nationality format.");
  }

  const [nationality, countryFlag] = nationalityFlag.split("%");

  const updateData = {
    nationality,
    nationalID,
    countryFlag,
  };

  const { error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

  if (error) {
    console.error(error);
    throw new Error("Guest could not be updated");
  }

  revalidatePath("/account/profile");
}

export async function deleteReservation(bookingId: number) {
  const session = await auth();
  if (!session) throw new Error("You have to be logged in!");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId)
    .eq("guestId", session.user.guestId);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }

  revalidatePath("/account/reservations");
}

export async function updateReservation(updateFields: FormData) {
  const session = await auth();
  if (!session) throw new Error("You have to be logged in!");

  const numGuests = updateFields.get("numGuests");
  const observations = updateFields.get("observations");
  const bookingId = updateFields.get("bookingId");

  console.log(numGuests, observations, bookingId);

  if (!numGuests || !bookingId) {
    throw new Error("Invalid form data received.");
  }

  const updateData = {
    numGuests: Number(numGuests),
    observations: observations?.toString(),
  };

  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", Number(bookingId))
    .eq("guestId", session.user.guestId)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }

  revalidatePath("/account/reservations");
  revalidatePath("/account/reservations/edit/[bookingId]");
  redirect("/account/reservations");
}

export async function createReservation(
  bookingData: {
    startDate: Date | undefined;
    endDate: Date | undefined;
    cabinPrice: number;
    cabinId: number;
    numNights: number;
  },
  formData: FormData
) {
  const session = await auth();
  if (!session) throw new Error("You have to be logged in!");

  if (!bookingData.startDate || !bookingData.endDate) {
    throw new Error("Please make sure to set the booking dates.");
  }
  const numGuests = formData.get("numGuests");

  if (!numGuests) {
    throw new Error("Number of guests is required.");
  }

  const newBookingData = {
    ...bookingData,
    // Convert dates to ISO strings
    startDate: bookingData.startDate.toISOString(),
    endDate: bookingData.endDate.toISOString(),
    guestId: session.user.guestId,
    numGuests: Number(numGuests),
    observations: formData.get("observations")?.toString().slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };

  const { error } = await supabase.from("bookings").insert(newBookingData);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }
  revalidatePath(`/cabins/${bookingData.cabinId}`);
  redirect("/cabins/thankyou");
}
