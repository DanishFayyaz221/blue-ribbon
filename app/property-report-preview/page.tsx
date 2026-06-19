import { AppraisalFlow } from "../_components/appraisal/AppraisalFlow";

export const metadata = {
  title: "Property Report Preview | Blue Ribbon Real Estate",
};

// Reached from /property-report after submitting the "Hey there!" form (NEXT).
// Shows the result step ("One last question!" + estimated property value).
export default function PropertyReportPreviewPage() {
  return <AppraisalFlow initialStep="result" />;
}
