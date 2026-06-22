import { AppraisalFlow } from "../_components/appraisal/AppraisalFlow";
import { DprReport } from "../_components/reports/DprReport";

export const metadata = {
  title: "Rental Report | Blue Ribbon Real Estate",
};

// Reached by searching from the rental appraisal page. Shows the details/stats
// step (Vaucluse Stats + "Hey there!" form). NEXT goes to /rental-report-preview.
export default function RentalReportPage() {
  return (
    <>
      <AppraisalFlow initialStep="details" previewHref="/rental-report-preview" />
      <DprReport />
    </>
  );
}
