import { AppraisalFlow } from "../_components/appraisal/AppraisalFlow";
import { getAppraisalListings } from "../_components/appraisal/listings";
import { DprReport } from "../_components/reports/DprReport";

export const metadata = {
  title: "Rental Digital Appraisal | Blue Ribbon Real Estate",
};

// Same complete property-estimate page. The "Rental" report shows as selected
// here because AppraisalFlow derives the selection from the URL path. Reached
// when the visitor picks "I'm interested in a Rental report" (shallow URL
// change) or loads this URL directly. Searching from here goes to /rental-report.
export default async function RentalReportDigitalAppraisalPage() {
  const { samples, latest } = await getAppraisalListings();

  return (
    <>
      <AppraisalFlow samples={samples} latest={latest} />
      <DprReport />
    </>
  );
}
