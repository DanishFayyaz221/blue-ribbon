import { LegalDocument, type LegalSection } from "../_components/legal/LegalDocument";

export const metadata = {
  title: "Terms & Conditions | Blue Ribbon Real Estate",
  description:
    "The terms that apply when you use the Blue Ribbon Real Estate website, its property listings, appraisals and enquiry forms.",
};

const SECTIONS: LegalSection[] = [
  {
    heading: "About these terms",
    paragraphs: [
      "This website is operated by Blue Ribbon Real Estate of Suite 11/76-80 Station Street, Wentworthville NSW 2145 (“Blue Ribbon”, “we”, “us” or “our”). These terms apply to your use of the website and to the listings, reports, forms and other services made available through it.",
      "By using the website you agree to these terms and to our Privacy Policy. If you do not agree, please do not use the website. Where you engage us to sell, lease or manage a property, a separate agency agreement or management agreement applies to that engagement and prevails over these terms to the extent of any inconsistency.",
    ],
  },
  {
    heading: "Using the website",
    paragraphs: [
      "You may use the website for your own personal, non-commercial purposes, such as browsing properties, requesting an appraisal or getting in touch with our team. When using the website you agree that you will not:",
    ],
    bullets: [
      "use it for any purpose that is unlawful or that breaches these terms;",
      "copy, scrape, harvest or extract listings or other content using automated tools, or republish our content elsewhere without our written consent;",
      "interfere with the security or operation of the website, or attempt to gain access to areas of it that are not intended for public use;",
      "submit information that is false, misleading or that you are not entitled to share; or",
      "use the website to send unsolicited communications to our staff, clients or other users.",
    ],
    after: [
      "We may suspend or restrict access to the website, or to particular features of it, where we reasonably believe these terms have been breached.",
    ],
  },
  {
    heading: "Property listings and information",
    paragraphs: [
      "Listings on the website are drawn from our property management system and are published in good faith. Details such as price guides, availability, inclusions, land and floor areas, photographs and floor plans are provided by vendors, landlords and third parties, may be indicative only and can change without notice.",
      "Nothing on the website is an offer to sell or lease a property, and no contract arises from your use of the website. You should inspect any property you are interested in, make your own enquiries and obtain your own legal, financial and building advice before making a decision. Information on the website is general in nature and is not financial, legal or investment advice.",
    ],
  },
  {
    heading: "Appraisals and reports",
    paragraphs: [
      "Our digital property and rental reports, and any appraisal we provide, are estimates prepared for general guidance. They are based on the information you supply, recent local market activity and our experience of the area. They are not valuations for the purposes of any law and must not be relied on as one, including for lending, taxation, insurance, legal or family law matters. A formal valuation should be obtained from a registered valuer where one is required.",
    ],
  },
  {
    heading: "Information you send us",
    paragraphs: [
      "When you submit an enquiry, request an appraisal, apply for a property or otherwise send us information, you confirm that it is accurate and that you are entitled to provide it. You agree that we may contact you about your enquiry by phone, email or SMS. Personal information you provide is handled in accordance with our Privacy Policy.",
    ],
  },
  {
    heading: "Intellectual property",
    paragraphs: [
      "The website and its content, including text, photographs, video, floor plans, logos, graphics, page designs and software, are owned by or licensed to Blue Ribbon and are protected by copyright and other intellectual property laws. You may view, print or download content for your personal use only. Any other use, including reproducing, modifying, distributing or commercially exploiting our content, requires our prior written consent.",
      "The Blue Ribbon name and logo are our trade marks and may not be used without our permission.",
    ],
  },
  {
    heading: "Third-party links and services",
    paragraphs: [
      "The website contains links to and content from third parties, such as property portals, mapping services and social media platforms. These are provided for convenience. We do not control those services, are not responsible for their content or practices, and do not endorse them. Your use of a third-party service is governed by its own terms and privacy policy.",
    ],
  },
  {
    heading: "Availability and changes",
    paragraphs: [
      "We aim to keep the website available and up to date, but we do not guarantee that it will be uninterrupted, error free or free of viruses or other harmful components. We may change, suspend or remove any part of the website at any time without notice.",
    ],
  },
  {
    heading: "Liability",
    paragraphs: [
      "Nothing in these terms excludes, restricts or modifies any consumer guarantee, right or remedy you have under the Australian Consumer Law or any other law that cannot be excluded.",
      "Subject to that, and to the maximum extent permitted by law, Blue Ribbon and its directors, employees and agents are not liable for any loss, damage, cost or expense, including indirect or consequential loss, arising from your use of or inability to use the website, or from your reliance on any information on it. Where liability cannot be excluded, it is limited, at our option, to resupplying the relevant service or paying the cost of having it resupplied.",
    ],
  },
  {
    heading: "Privacy",
    paragraphs: [
      "We take your privacy seriously. Our Privacy Policy explains what personal information we collect, how we use and share it, and how you can access or correct it. It forms part of these terms.",
    ],
  },
  {
    heading: "Governing law",
    paragraphs: [
      "These terms are governed by the laws of New South Wales, Australia. You agree to submit to the non-exclusive jurisdiction of the courts of New South Wales and any courts that may hear appeals from them.",
    ],
  },
  {
    heading: "Changes to these terms",
    paragraphs: [
      "We may update these terms from time to time. The current version, with the date it took effect, will always be published on this page. Your continued use of the website after a change is published means you accept the updated terms.",
    ],
  },
  {
    heading: "Contact us",
    paragraphs: [
      "If you have any questions about these terms, please contact us.",
      "Blue Ribbon Real Estate\nSuite 11/76-80 Station Street, Wentworthville NSW 2145\nsales@blueribbonre.com.au\n1300 579 093",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalDocument
      label="Legal"
      title="Terms & Conditions"
      intro="These terms set out how you may use the Blue Ribbon Real Estate website and the listings, reports and forms on it. They are written in plain language so you know where you stand with us, and they sit alongside our Privacy Policy."
      updated="15 September 2026"
      sections={SECTIONS}
    />
  );
}
