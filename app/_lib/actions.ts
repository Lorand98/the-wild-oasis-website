"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBookings } from "./data-service";

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
