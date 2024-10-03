import medicationService from "@/services/medication.service";
import {
  createActionHeaders,
  ActionError,
  ActionsJson,
  ACTIONS_CORS_HEADERS,
  BLOCKCHAIN_IDS,
} from "@solana/actions";

// create the standard headers for this route (including CORS)
const headers = createActionHeaders({
  headers: ACTIONS_CORS_HEADERS,
  chainId: BLOCKCHAIN_IDS.devnet,
  actionVersion: "2.1.3",
});

export async function GET() {
  try {
    const medications = await medicationService.getMedications();

    if (!medications.success) {
      throw new Error("Server error fetching medications");
    }

    const medicationRules = medications.data.map((medication) => ({
      apiPath: `/medication/blink/${medication.slug}`,
      pathPattern: `/medication/${medication.slug}`,
    }));

    const payload: ActionsJson = {
      rules: [
        {
          apiPath: "/api/actions/donate",
          pathPattern: "/",
        },
        ...medicationRules,
      ],
    };

    return Response.json(payload, {
      headers,
    });
  } catch (err) {
    console.log(err);
    let actionError: ActionError = { message: "An unknown error occurred" };
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
