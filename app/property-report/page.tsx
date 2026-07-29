import { AppraisalFlow } from "../_components/appraisal/AppraisalFlow";
import { getAppraisalListings } from "../_components/appraisal/listings";
import { DprReport } from "../_components/reports/DprReport";

export const metadata = {
  title: "Property Report | Blue Ribbon Real Estate",
};

// Reached by searching from the property (sales) appraisal page. Shows the
// details/stats step (Vaucluse Stats + "Hey there!" form). NEXT goes to
// /property-report-preview.
export default async function PropertyReportPage() {
  const { samples, latest } = await getAppraisalListings();

  return (
    <>
      <AppraisalFlow initialStep="details" previewHref="/property-report-preview" samples={samples} latest={latest} />
      <DprReport />
    </>
  );
}
