import { AppraisalFlow } from "../_components/appraisal/AppraisalFlow";
import { getAppraisalListings } from "../_components/appraisal/listings";
import { DprReport } from "../_components/reports/DprReport";

export const metadata = {
  title: "Rental Report Preview | Blue Ribbon Real Estate",
};

// Reached from /rental-report after submitting the "Hey there!" form (NEXT).
// Shows the result step ("One last question!" + estimated property value).
export default async function RentalReportPreviewPage() {
  const { samples, latest } = await getAppraisalListings();

  return (
    <>
      <AppraisalFlow initialStep="result" samples={samples} latest={latest} />
      <DprReport />
    </>
  );
}
