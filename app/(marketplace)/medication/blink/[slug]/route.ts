import { validatedQueryParams } from "@/lib/solana-utils";
import medicationService from "@/services/medication.service";
import { solanaService } from "@/services/solana.service";
import {
  ActionGetResponse,
  createActionHeaders,
  ActionError,
} from "@solana/actions";

// create the standard headers for this route (including CORS)
const headers = createActionHeaders();

export async function GET(
  req: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const slug = params.slug; // 'a', 'b', or 'c'
    console.log(slug);
    // console.log(params.slug);
    const { data, success } = await medicationService.getMedicationBySlug(slug);

    if (!success) {
      throw new Error("Server error fetching medication");
    }

    console.log(data.price);

    const amountSOL = (
      await solanaService.convertUSDToSOL(Number(data.price))
    ).toFixed(4);

    const requestUrl = new URL(req.url);
    const { toPubkey } = validatedQueryParams(requestUrl);

    const baseHref = new URL(
      `/api/actions/pay?to=${toPubkey.toBase58()}`,
      requestUrl.origin,
    ).toString();

    const payload: ActionGetResponse = {
      type: "action",
      title: data.name,
      icon: data.imageUrl,
      description: data.description ?? data.name,
      label: "Transfer", // this value will be ignored since `links.actions` exists
      links: {
        actions: [
          {
            label: "Pay " + amountSOL.toString() + " SOL", // button text
            href: `${baseHref}&amount=${amountSOL.toString()}`,
            type: "transaction",
          },
        ],
      },
    };

    return Response.json(payload, {
      headers,
    });
  } catch (err) {
    console.log(err);
    const actionError: ActionError = { message: "An unknown error occurred" };
    if (typeof err == "string") actionError.message = err;
    return Response.json(actionError, {
      status: 400,
      headers,
    });
  }
}

// DO NOT FORGET TO INCLUDE THE `OPTIONS` HTTP METHOD
// THIS WILL ENSURE CORS WORKS FOR BLINKS
export const OPTIONS = async () => Response.json(null, { headers });
