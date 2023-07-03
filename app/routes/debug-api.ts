import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getAllTherapists } from "~/models/therapist.server";

export async function loader({ params }: LoaderArgs) {
	const therapists = await getAllTherapists();

	return json(therapists)
}
