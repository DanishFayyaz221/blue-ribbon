import { AppraisalFlow } from "../_components/appraisal/AppraisalFlow";
import { getAppraisalListings } from "../_components/appraisal/listings";
import { DprReport } from "../_components/reports/DprReport";

export const metadata = {
  title: "Digital Property Appraisal | Blue Ribbon Real Estate",
};

// The complete property-estimate page. Selecting "Rental" + Search navigates
// to /rental-report.
export default async function PropertyReportDigitalAppraisalPage() {
  const { samples, latest } = await getAppraisalListings();

  return (
    <>
      <AppraisalFlow samples={samples} latest={latest} />
      <DprReport />
    </>
  );
}
