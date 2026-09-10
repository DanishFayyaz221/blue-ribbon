/**
 * Market Insights articles.
 *
 * The four blogs supplied by the agency (September 2026), verbatim. Photos are
 * stock images already in the project standing in until each article has its
 * own artwork; the lead line is a sentence lifted from the article itself,
 * and the tags are topic labels that can be edited freely.
 */
export type InsightArticle = {
  slug: string;
  title: string;
  /** Short form for the breadcrumb, e.g. "Spring 2026 Update". */
  shortTitle: string;
  /** Reading time in minutes, shown as "N min read". Derived from the body. */
  readMinutes: number;
  /** Card image on the listing page. */
  image: string;
  /** Wide banner at the top of the article page. */
  heroImage: string;
  /** Portrait/square image beside the body copy on the article page. */
  sideImage: string;
  /** Lead line above the body copy. */
  subtitle: string;
  /** Paragraphs separated by blank lines; rendered with pre-line whitespace. */
  body: string;
  tags: string[];
};

/** Average adult reading speed, words per minute. */
const WORDS_PER_MINUTE = 200;

function paragraphs(...parts: string[]): string {
  return parts.join("\n\n");
}

function readMinutes(body: string): number {
  return Math.max(1, Math.round(body.split(/\s+/).length / WORDS_PER_MINUTE));
}

type Draft = Omit<InsightArticle, "readMinutes">;

const drafts: Draft[] = [
  {
    slug: "wentworthville-property-market-spring-2026-update",
    title: "Wentworthville Property Market Spring 2026 Update",
    shortTitle: "Spring 2026 Update",
    image: "/images/latest-properties.png",
    heroImage: "/images/home.png",
    sideImage: "/images/get-in.png",
    subtitle:
      "Forget the median for a moment. What matters to anyone buying or selling in Wentworthville this spring is what a buyer will actually pay on Saturday.",
    body: paragraphs(
      "If you've been watching Wentworthville prices this year, you've probably noticed the numbers don't all agree. The 12-month median for a house in 2145 still sits around $1.5 million and units are closer to $600,000, but those figures are looking in the rear-view mirror. Since autumn, most East Coast markets have fallen somewhere between 10% and 15%, and our part of Western Sydney has felt it too. So forget the median for a moment. What matters to anyone buying or selling in Wentworthville this spring is what a buyer will actually pay on Saturday.",
      "A few things hit at once. Cost of living pressure hasn't eased, the Reserve Bank has kept the cash rate at 4.35%, and most of the big banks don't expect a change until at least mid-2027. Then the May Federal Budget changed negative gearing and capital gains tax for anyone buying an established home as an investment. Investor loan applications dropped hard after Budget night, and in a suburb where many units have traditionally gone to investors, that shows up quickly at open homes.",
      "But Wentworthville isn't a suburb that falls apart when confidence dips. Houses here are tightly held, with owners typically staying well over a decade, so there's never a flood of stock. The station sits right in the middle of the suburb, Parramatta is a few minutes away, and the Westmead Health and Education Precinct next door employs thousands of people who need somewhere close to live. A lot of blocks are also big enough for a duplex, which brings builders and investors into the buyer pool alongside families. When supply is tight and demand comes from several directions, prices have a floor under them.",
      "Houses and units are behaving like two different markets right now. Houses have held up better, with well-presented homes still selling in around four to six weeks. Units have taken more of the hit because investors were the main buyers and many have stepped back. That's frustrating for unit owners who need a quick sale, but it's genuinely good news for first home buyers, who are walking into opens with a fraction of the competition they faced a year ago. Many Wentworthville units also sit under the price where NSW first home buyers pay no stamp duty, which makes the maths even better.",
      "Sellers should know that recent data shows Wentworthville vendors discounting around 9% from their first asking price. Most of that happens when a home is priced off a sale from last summer rather than what's sold in the past three months. Price it right from day one and you usually avoid weeks of quiet inspections followed by a price drop that makes buyers wonder what's wrong.",
      "So what are we telling people? If you're buying, this is the first time in years you've had real room to negotiate in 2145. Get your pre-approval sorted, inspect widely and don't hold out for the perfect bottom, because nobody rings a bell when it arrives. If you're selling and buying back into Wentworthville, a softer price on your sale is largely matched by a softer price on your purchase, so your position may not have changed much at all. If you're selling to leave the area or cash out, have a proper conversation first, because sometimes the right advice is to wait a season.",
      "History says corrections like this one tend to find their floor and recover, and plenty of forecasters expect prices to steady into 2027. Nobody can promise the timing. What we can do at Blue Ribbon Real Estate is tell you what homes on your street are selling for this month, not last year. Drop into our office at Suite 11/76-80 Station Street, Wentworthville, or give us a call for a free appraisal.",
    ),
    tags: [
      "Wentworthville",
      "Market Update",
      "Spring 2026",
      "Houses",
      "Units",
      "Interest Rates",
      "Federal Budget",
      "Sellers",
      "Buyers",
      "First Home Buyers",
    ],
  },
  {
    slug: "why-wentworthville-duplex-sites-now-matter",
    title: "Why Wentworthville Duplex Sites Now Matter",
    shortTitle: "Duplex Sites",
    image: "/images/avenue.png",
    heroImage: "/images/dynamic.png",
    sideImage: "/images/property-hero.png",
    subtitle:
      "The Budget changes created a clear winner, and it happens to be the kind of land our suburb has plenty of.",
    body: paragraphs(
      "On 12 May, the Federal Budget made the biggest change to property investment tax in a generation, and most of the coverage has focused on what investors lost. There's a less obvious side to the story that matters a lot in Wentworthville. The changes created a clear winner, and it happens to be the kind of land our suburb has plenty of.",
      "Here's what changed. From 1 July 2027, anyone who bought an established residential property after 7:30pm on Budget night won't be able to use rental losses to reduce the tax on their wage. Those losses get quarantined and carried forward against future rental income or property gains instead. The 50% capital gains discount is also being replaced by indexation, with a 30% minimum tax on gains. If you already owned an investment property on Budget night, or had exchanged contracts, you keep the old rules until you sell.",
      "The exception is genuine new housing. New builds that add to supply keep full negative gearing and can still access the existing capital gains discount. The fine print matters here. Knocking down one house and building another single house generally doesn't count, because it doesn't add a home. Knocking down one house and building two, like a duplex, is exactly the kind of project the policy is designed to reward.",
      "Now take a walk around the streets off Station Street and Dunmore Street. You'll see post-war brick and fibro homes sitting on generous blocks, many in the 550 to 700 square metre range. Since July 2025, the NSW Government's low-rise housing reforms have allowed dual occupancies in R2 low density zones across Greater Sydney, subject to minimum lot sizes and design standards. Put the state planning changes and the federal tax changes side by side and a tired three-bedroom house on a decent block starts to look very different. To the right buyer, it's the raw material for a new-build investment that still carries the old tax benefits.",
      "If you own one of these blocks, you may now have two groups of buyers instead of one. Families want the house as it stands. Builders and investors want the land and what they can put on it. Your marketing should speak to both, and your price should reflect what the land is worth to the strongest of them. Before you list, get the basics together: lot size, frontage, zoning, easements, significant trees, slope and any flood information from Cumberland Council's planning maps. A short feasibility from a town planner can turn \"duplex potential\" from a line in an ad into something a buyer will actually pay for.",
      "If you're an investor, the maths has flipped. Buying an established Wentworthville unit and negatively gearing it made sense to a lot of people in April. For purchases made after Budget night, it's a much weaker proposition. A new duplex, or one half of one, could be a stronger option, particularly in a suburb with a train station, a major hospital precinct next door and steady rental demand. Just don't let tax be the whole reason for buying. The property still has to stack up on location, rent and long-term growth.",
      "Some of the detail still isn't settled, including exactly how long a property counts as new and how later owners are treated. Blue Ribbon Real Estate isn't a tax adviser, and you should speak to your accountant before making decisions based on these changes. What we can tell you is what your block might be worth to a builder compared with a family, and that gap can be surprising. If you're sitting on land in Wentworthville and wondering what the Budget means for you, come and see us at Suite 11/76-80 Station Street.",
    ),
    tags: [
      "Federal Budget",
      "Negative Gearing",
      "Capital Gains Tax",
      "Duplex",
      "Dual Occupancy",
      "R2 Zoning",
      "Investors",
      "Land Value",
      "Sellers",
      "Wentworthville",
    ],
  },
  {
    slug: "first-home-buyer-guide-wentworthville-2026",
    title: "First Home Buyer Guide: Wentworthville 2026",
    shortTitle: "First Home Buyer Guide",
    image: "/images/find-an-office.png",
    heroImage: "/images/home.png",
    sideImage: "/images/latest-properties.png",
    subtitle: "If you've been saving and waiting for your chance, this is it.",
    body: paragraphs(
      "For most of the last decade, first home buyers in Western Sydney have been turning up to open homes and getting outbid by investors with bigger deposits. That's changed this year. Investors have stepped back since the May Budget, prices are lower than they were six months ago, and the crowds at Wentworthville unit inspections have thinned out noticeably. If you've been saving and waiting for your chance, this is it.",
      "The biggest help on the table is the federal 5% Deposit Scheme, which used to be called the First Home Guarantee. It lets eligible first home buyers purchase with a 5% deposit, while the government guarantees part of the loan so you don't have to pay Lenders Mortgage Insurance. Since October 2025, the income caps and the limit on places have both been scrapped and the property price caps have gone up, so far more people qualify than before.",
      "Then there's stamp duty, which used to wipe out a deposit before you'd even started. Under the NSW First Home Buyers Assistance Scheme, eligible buyers pay no transfer duty on a home up to $800,000 and a reduced amount on homes up to $1 million. Because a lot of Wentworthville units trade around the $600,000 mark, many of them fall comfortably inside the full exemption. Check the current thresholds on the Revenue NSW website before you sign anything, because they do get reviewed.",
      "Let's put some real numbers on it. On a $600,000 unit, a 5% deposit is $30,000. If you're eligible, stamp duty is nil and there's no mortgage insurance. On top of the deposit, you'll want money set aside for conveyancing, a building and pest inspection, a strata report, any loan fees and the cost of moving. A few thousand dollars usually covers it. For a lot of couples, and even some single buyers on a steady income, that's a far more reachable target than they assumed.",
      "Buying a unit in Wentworthville does come with homework. The suburb has everything from 1980s walk-ups on quiet streets to newer buildings close to the station, and they're not all equal. Read the strata report properly rather than skimming it. Look at how much is in the capital works fund, whether any special levies are coming, what defects have been reported and what the owners have been arguing about in recent meeting minutes. Check the parking, the storage, which way the balcony faces and how long the walk to the train really is. A cheaper unit with a big levy around the corner isn't a bargain.",
      "Houses are harder. With the median sitting around $1.5 million, a freestanding home in Wentworthville is a stretch for most first buyers unless there are two good incomes involved. That's why so many people start with a unit, townhouse or villa in 2145, build some equity and upgrade later. There's nothing wrong with the stepping-stone approach. It's how most of the families living in Wentworthville houses got there.",
      "The one piece of advice we'd give every first home buyer is not to borrow to the absolute limit. Rates are on hold for now, but several banks expect them to rise again from mid-2027. Work out what you could still comfortably afford if your repayments went up, and stay inside that number. A good agent will tell you when a property is outside your comfortable range, even if it means you don't buy it through them.",
      "If you're starting to look in Wentworthville, get your pre-approval sorted first so you know exactly where you stand. Then come and have a chat with the team at Blue Ribbon Real Estate on Station Street. We'll tell you what's selling, what's sitting and which units are about to come up before they reach the portals.",
    ),
    tags: [
      "First Home Buyers",
      "5% Deposit Scheme",
      "Stamp Duty",
      "Units",
      "Strata",
      "Pre-approval",
      "Budgeting",
      "Wentworthville",
    ],
  },
  {
    slug: "living-in-wentworthville-an-honest-guide",
    title: "Living in Wentworthville: An Honest Guide",
    shortTitle: "Living in Wentworthville",
    image: "/images/property-hero.png",
    heroImage: "/images/dynamic.png",
    sideImage: "/images/find-an-office.png",
    subtitle:
      "It's one of those suburbs people move to for practical reasons and end up staying in for years.",
    body: paragraphs(
      "Ask someone from outside Western Sydney about Wentworthville and they might draw a blank. Ask anyone who's lived here and you'll hear about the dosa on Station Street, the quick run into Parramatta and how easy it is to get almost anywhere. It's one of those suburbs people move to for practical reasons and end up staying in for years.",
      "Wentworthville sits in Sydney's west inside Cumberland City Council, just a few minutes from the Parramatta CBD. The railway line runs through the middle of the suburb, and the shopping strip along Station Street and Dunmore Street is its heart. South Wentworthville, Pendle Hill, Westmead and Greystanes wrap around it, and most of them share the 2145 postcode.",
      "Getting around is the big drawcard. Wentworthville station is on the T1 Western Line, so Parramatta is a short hop and the city is an easy daily commute. If you drive, the Great Western Highway and the M4 are right there. Next door at Westmead, the Parramatta Light Rail is already running and a Sydney Metro West station is planned, which will make the area even better connected over the coming years.",
      "Then there's the food. Station Street has become one of Sydney's best strips for South Indian and Sri Lankan cooking, and people drive in from all over for it. Crispy dosa for breakfast, a proper biryani for dinner, and sweet shops that are dangerous to walk past on the way home. Add the everyday things you need within a short walk, like grocers, pharmacies, cafes and medical centres, and it's the kind of suburb where you can leave the car at home most days.",
      "Weekends are simple and local. The Wentworthville Memorial Swim Centre is a summer institution for families. Friend Park sits close to the centre of town, and there are sporting fields and green space scattered through the surrounding streets. Parramatta Park and the river foreshore are only a short drive away when you want something bigger.",
      "For families, Wentworthville Public School and Pendle Hill High School serve many of the local streets, with more public, Catholic and independent options within easy reach. Catchments follow street boundaries rather than suburb names, so always check the exact address on the NSW School Finder before you commit to a property.",
      "The community is young and diverse. The median age is in the mid-thirties, and you'll find families who've been here for generations living alongside young professionals and health workers from the Westmead Health and Education Precinct next door. A big share of residents rent, which keeps the rental market busy and gives the suburb a steady flow of new faces.",
      "The housing is just as mixed. There are post-war brick and fibro houses on generous blocks, townhouses and villas tucked into quieter streets, 1980s walk-up units and newer apartment buildings close to the station. That range is a big part of the appeal, because it means you can buy your first unit here, upgrade to a house later and still be doing your shopping on the same street.",
      "It's not perfect, and we'd rather you hear the downsides from us than find them after settlement. The Great Western Highway gets heavy at peak hour. Parking near the station can be tight during the day. Some of the older unit blocks need work, and the long-planned renewal of the town centre is still a work in progress. None of these are reasons to rule the suburb out, but you should know about them before you inspect.",
      "Our office is right in the middle of it all at Suite 11/76-80 Station Street. If you're thinking about moving to 2145, drop in and have a chat with the Blue Ribbon Real Estate team, and we'll tell you what it's really like to live here.",
    ),
    tags: [
      "Living in Wentworthville",
      "Transport",
      "Food",
      "Schools",
      "Parks",
      "Community",
      "Housing",
      "Suburb Guide",
    ],
  },
];

export const INSIGHT_ARTICLES: InsightArticle[] = drafts.map((d) => ({
  ...d,
  readMinutes: readMinutes(d.body),
}));

export function articleHref(slug: string): string {
  return `/market-insights/${slug}`;
}

export function getArticle(slug: string): InsightArticle | undefined {
  return INSIGHT_ARTICLES.find((a) => a.slug === slug);
}
