import { AppraisalFlow } from "../_components/appraisal/AppraisalFlow";
import { DprReport } from "../_components/reports/DprReport";

export const metadata = {
  title: "Rental Report Preview | Blue Ribbon Real Estate",
};

// Reached from /rental-report after submitting the "Hey there!" form (NEXT).
// Shows the result step ("One last question!" + estimated property value).
export default function RentalReportPreviewPage() {
  return (
    <>
      <AppraisalFlow initialStep="result" />
      <DprReport />
    </>
  );
}
