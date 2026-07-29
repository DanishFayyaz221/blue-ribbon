import { AppraisalFlow } from "../_components/appraisal/AppraisalFlow";
import { getAppraisalListings } from "../_components/appraisal/listings";
import { DprReport } from "../_components/reports/DprReport";

export const metadata = {
  title: "Property Report Preview | Blue Ribbon Real Estate",
};

// Reached from /property-report after submitting the "Hey there!" form (NEXT).
// Shows the result step ("One last question!" + estimated property value).
export default async function PropertyReportPreviewPage() {
  const { samples, latest } = await getAppraisalListings();

  return (
    <>
      <AppraisalFlow initialStep="result" samples={samples} latest={latest} />
      <DprReport />
    </>
  );
}
