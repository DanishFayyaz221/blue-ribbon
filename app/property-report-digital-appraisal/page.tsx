import { AppraisalFlow } from "../_components/appraisal/AppraisalFlow";

export const metadata = {
  title: "Digital Property Appraisal | Blue Ribbon Real Estate",
};

// The complete property-estimate page. Selecting "Rental" + Search navigates
// to /rental-report.
export default function PropertyReportDigitalAppraisalPage() {
  return <AppraisalFlow />;
}
