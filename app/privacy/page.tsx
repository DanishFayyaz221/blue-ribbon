import { LegalDocument, type LegalSection } from "../_components/legal/LegalDocument";

export const metadata = {
  title: "Privacy Policy | Blue Ribbon Real Estate",
  description:
    "How Blue Ribbon Real Estate collects, uses, shares and protects your personal information, and how to access or correct it.",
};

const SECTIONS: LegalSection[] = [
  {
    heading: "Our commitment to your privacy",
    paragraphs: [
      "Blue Ribbon Real Estate of Suite 11/76-80 Station Street, Wentworthville NSW 2145 (“Blue Ribbon”, “we”, “us” or “our”) is committed to protecting your personal information. We handle it in accordance with the Privacy Act 1988 (Cth) and the Australian Privacy Principles, and with the laws that apply to real estate agents in New South Wales.",
      "This policy explains what personal information we collect, how we collect and use it, who we share it with, how we keep it secure, and how you can access or correct it or raise a concern. It applies to our website, to our sales, leasing and property management services, and to the appraisals and reports we provide.",
    ],
  },
  {
    heading: "What we collect",
    paragraphs: [
      "The personal information we collect depends on how you deal with us. It may include:",
    ],
    bullets: [
      "your name, postal and email address, phone number and other contact details;",
      "details of a property you own, are selling, leasing, renting or interested in, and what you tell us about it;",
      "the content of your enquiries, appraisal requests and other communications with us;",
      "if you apply for a rental property: identification documents, employment and income details, rental history, references and other information needed to assess your application;",
      "if you sell or lease a property with us: ownership, financial and settlement details needed to act for you;",
      "payment details where you pay us or we hold money on your behalf; and",
      "information about how you use our website, such as your IP address, device and browser type, the pages you visit and the time of your visit.",
    ],
    after: [
      "We collect sensitive information, such as health information, only where you provide it to us for a specific purpose, for example a request for an accessible property, and only with your consent.",
    ],
  },
  {
    heading: "How we collect it",
    paragraphs: [
      "We collect personal information directly from you when you fill in a form on our website, call or email us, attend an open home or inspection, sign an agreement with us or otherwise deal with our team.",
      "We may also collect it from third parties where that is reasonable and lawful, including property portals that pass your enquiry to us, referees and employers you nominate, your previous agents or landlords, tenancy databases, conveyancers and solicitors acting in a transaction, and publicly available sources such as property records.",
      "Our website uses cookies and analytics tools that collect information automatically. See the cookies section below.",
    ],
  },
  {
    heading: "How we use it",
    paragraphs: ["We use personal information to:"],
    bullets: [
      "respond to your enquiries and provide the services you ask for, including appraisals and property reports;",
      "market and sell or lease properties, and manage properties on behalf of their owners;",
      "assess rental applications and manage tenancies, including rent, repairs, inspections and bond;",
      "communicate with you about properties, inspections, offers and the progress of a transaction;",
      "send you updates about the market, new listings and our services, where you have not opted out;",
      "operate, secure and improve our website and services;",
      "keep the records we are required to keep, including trust account records; and",
      "comply with our legal obligations and enforce our rights.",
    ],
  },
  {
    heading: "Who we share it with",
    paragraphs: [
      "We share personal information only where it is needed to provide our services or where the law requires or permits it. Depending on how you deal with us, that may include:",
    ],
    bullets: [
      "property owners, landlords, buyers and tenants, to the extent needed to progress an enquiry, sale, lease or tenancy;",
      "tradespeople, strata managers, valuers, photographers, conveyancers, solicitors and other professionals involved in a property or transaction;",
      "referees, previous agents and landlords, and tenancy databases, where permitted by tenancy law;",
      "our service providers, such as the providers of our property management and customer relationship software, email, website hosting, payment and analytics services, who may only use the information to provide their service to us;",
      "property portals and marketing platforms, where a listing is advertised there;",
      "government agencies, courts, tribunals and regulators, including NSW Fair Trading, where required by law; and",
      "our professional advisers and insurers.",
    ],
    after: ["We do not sell personal information."],
  },
  {
    heading: "Overseas disclosure",
    paragraphs: [
      "Some of our service providers store or process information on servers located outside Australia, including cloud-based software, email and hosting providers. Where that happens we take reasonable steps to ensure the provider handles your information in a way that is consistent with the Australian Privacy Principles.",
    ],
  },
  {
    heading: "Marketing",
    paragraphs: [
      "We may send you information about the local market, new listings, appraisals and our services by email, SMS or phone. You can opt out at any time by using the unsubscribe link in an email, replying STOP to an SMS or contacting us using the details below. We will still contact you where we need to about a property or transaction you are involved in.",
    ],
  },
  {
    heading: "Cookies and analytics",
    paragraphs: [
      "Our website uses cookies and similar technologies to remember your preferences, understand how the site is used and improve it. Analytics tools collect information such as pages visited, time on site and the device and browser used. This information is generally aggregated and does not identify you personally. You can control or disable cookies through your browser settings, although some parts of the website may not work as intended without them.",
    ],
  },
  {
    heading: "Security and retention",
    paragraphs: [
      "We take reasonable steps to protect personal information from misuse, interference, loss and unauthorised access, modification or disclosure. Those steps include access controls, secure software and staff training. No method of transmission over the internet is completely secure, so we cannot guarantee the security of information you send to us online.",
      "We keep personal information for as long as we need it to provide our services and to meet our legal and record-keeping obligations, which for real estate transactions can extend for several years after the transaction ends. When it is no longer needed, we take reasonable steps to destroy it or de-identify it.",
    ],
  },
  {
    heading: "Access and correction",
    paragraphs: [
      "You may ask us for access to the personal information we hold about you, and ask us to correct it if it is inaccurate, out of date, incomplete or misleading. Please contact us using the details below. We may need to verify your identity before we respond. We will respond within a reasonable time and, in the rare cases where we cannot give access, we will tell you why.",
    ],
  },
  {
    heading: "Complaints",
    paragraphs: [
      "If you are concerned about how we have handled your personal information, please contact us first so we can look into it. We will acknowledge your complaint, investigate it and respond to you within a reasonable time. If you are not satisfied with our response, you can contact the Office of the Australian Information Commissioner at oaic.gov.au or on 1300 363 992.",
    ],
  },
  {
    heading: "Changes to this policy",
    paragraphs: [
      "We may update this policy from time to time to reflect changes to our practices or the law. The current version, with the date it took effect, will always be published on this page.",
    ],
  },
  {
    heading: "Contact us",
    paragraphs: [
      "For any question about this policy or your personal information, please contact us.",
      "Blue Ribbon Real Estate\nSuite 11/76-80 Station Street, Wentworthville NSW 2145\nsales@blueribbonre.com.au\n1300 579 093",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalDocument
      label="Legal"
      title="Privacy Policy"
      intro="Buying, selling or renting a home means trusting us with personal details. This policy explains what we collect, why we collect it, who we share it with and how you can access, correct or ask about the information we hold."
      updated="15 September 2026"
      sections={SECTIONS}
    />
  );
}
