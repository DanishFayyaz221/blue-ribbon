import { AppraisalFlow } from "../_components/appraisal/AppraisalFlow";
import { getAppraisalListings } from "../_components/appraisal/listings";
import { DprReport } from "../_components/reports/DprReport";

export const metadata = {
  title: "Rental Report | Blue Ribbon Real Estate",
};

// Reached by searching from the rental appraisal page. Shows the details/stats
// step (Vaucluse Stats + "Hey there!" form). NEXT goes to /rental-report-preview.
export default async function RentalReportPage() {
  const { samples, latest } = await getAppraisalListings();

  return (
    <>
      <AppraisalFlow initialStep="details" previewHref="/rental-report-preview" samples={samples} latest={latest} />
      <DprReport />
    </>
  );
}
