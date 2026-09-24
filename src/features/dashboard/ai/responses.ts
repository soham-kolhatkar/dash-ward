export type AttachmentKind = 'revenue-dip' | 'forecast' | 'channels' | 'churn' | 'summary' | 'sessions'

export interface CannedReply {
  id: string
  match: RegExp
  steps: string[]
  text: string
  attachment?: AttachmentKind
  sources: string[]
  followups: string[]
}

export const REPLIES: CannedReply[] = [
  {
    id: 'revenue',
    match: /revenue|dip|drop|tuesday|decline|sales/i,
    steps: ['Querying 12.4M events…', 'Joining stripe.charges with sessions…', 'Running anomaly detection…'],
    text: `Revenue on **Tuesday, Sep 22** came in at **$6,120**, which is **31% below** the 4-week Tuesday baseline of $8,870. It’s the only day this month outside the 95% confidence band.

Three factors explain almost all of the gap:

- **Checkout errors on mobile Safari (−$1,640).** Release \`web@4.18.2\` shipped at 09:12 UTC and introduced a postcode validation bug. Step-2 abandonment on iOS jumped from 22% to 61%.
- **Delayed annual renewals (−$720).** 4 Scale renewals were invoiced a day late because of the Stripe webhook backlog. They were collected on Wednesday.
- **Lower paid-social volume (−$390).** The Meta campaign “Fall Launch” hit its daily cap at 14:00, which cut trial starts by 18%.

Wednesday recovered to **$9,410** after the hotfix. Net impact for the week is roughly **−$1,900**, and about $720 of that was only timing.`,
    attachment: 'revenue-dip',
    sources: ['stripe.charges', 'events.checkout_step', 'deploys.web', 'ads.meta_spend'],
    followups: ['Show affected Safari sessions', 'Set an alert for checkout errors', 'How much did the hotfix recover?'],
  },
  {
    id: 'forecast',
    match: /forecast|predict|q4|projection|next quarter|run.?rate/i,
    steps: ['Loading 24 months of MRR…', 'Fitting seasonal model (Prophet + GBM)…', 'Simulating 10,000 scenarios…'],
    text: `I project Q4 MRR to finish at **$286k** (80% interval **$271k – $301k**). That’s **+15.3%** over Q3 and about **12% ahead** of your $255k target.

What’s driving the forecast:

- **Expansion is carrying the quarter.** Growth-plan seat expansion is up 22% QoQ and accounts for 58% of the projected net new MRR.
- **New-logo growth stays flat** at about $14k a month. The Q4 enterprise pipeline has 3 deals over $5k MRR, weighted at 40%.
- **Churn is the biggest risk.** Each +0.5pt of monthly churn takes about $6.8k off the Q4 exit MRR.

The band widens after November because two of the enterprise deals have December close dates. If both land, you’d finish near the top of the range.`,
    attachment: 'forecast',
    sources: ['stripe.subscriptions', 'crm.opportunities', 'models.mrr_forecast_v3'],
    followups: ['What if churn rises to 2.5%?', 'Break the forecast down by plan', 'Which deals matter most?'],
  },
  {
    id: 'channels',
    match: /channel|ltv|cac|acquisition|marketing|attribution|source/i,
    steps: ['Attributing 48,210 visitors…', 'Computing 12-month LTV by cohort…', 'Comparing CAC across channels…'],
    text: `**Organic search** has the best unit economics. Its customers have a 12-month LTV of **$4,820** against a blended CAC of **$310**, which is **15.5× LTV:CAC**.

Here’s how the channels compare:

- **Organic search** has the highest LTV and the lowest CAC, and customers pay back in under 1 month. Content on \`/features/ai-insights\` drives 41% of it.
- **Referral** comes second at **9.8×**. These accounts are small at first but expand the fastest, with +34% seats in 6 months.
- **Paid social** is the weakest at **2.1×**, with a 9-month payback. Trials convert well, but 38% churn before month 3.

If you move 20% of the paid-social budget into referral incentives, the model expects **+$11k ARR** a quarter with no change in total spend.`,
    attachment: 'channels',
    sources: ['events.page_view', 'stripe.charges', 'ads.spend_daily', 'crm.contacts'],
    followups: ['Model a referral program', 'Why does paid social churn early?', 'Show LTV curves by cohort'],
  },
  {
    id: 'churn',
    match: /churn|risk|retention|cancel|at.?risk|health/i,
    steps: ['Scoring 86 accounts…', 'Reading product usage signals…', 'Ranking by MRR at risk…'],
    text: `**13 accounts** are at elevated churn risk, representing **$14.6k MRR**. Most of the exposure sits in five accounts:

- **Usage drop-off** is the strongest signal. Their weekly active seats fell by more than 40% in the last 21 days.
- **Payment friction.** 4 of the 13 have a failed charge that hasn’t been retried successfully.
- **No AI queries.** None of the at-risk accounts ran an AI query last month. Accounts that do retain 2.4× better.

I’d start with the top two accounts below. Together they’re 38% of the MRR at risk, and both have an admin who was active in the last week, so a CSM call is likely to land.`,
    attachment: 'churn',
    sources: ['accounts.health_scores', 'events.session_start', 'stripe.invoices'],
    followups: ['Draft outreach emails for these accounts', 'What predicts churn best?', 'Show churn by plan'],
  },
  {
    id: 'summary',
    match: /summar|ceo|board|week|report|digest|update/i,
    steps: ['Collecting weekly metrics…', 'Comparing to prior 4 weeks…', 'Writing executive summary…'],
    text: `**Week of Sep 21 (to date): a strong week with one self-inflicted wound.**

- **MRR reached $248.3k (+2.1% WoW)**, driven by 11 expansions and 2 new Scale logos (Halcyon and Parabola).
- **Activation improved to 57%** (+4pt) after the new onboarding checklist. It’s the best week since launch.
- **Tuesday’s checkout bug cost about $1.6k**. It was fixed within 26 hours, and a regression test has been added to CI.
- **Net revenue retention is 118%**, and logo churn held at 1.9%.

**Next week:** close the Northwind enterprise deal ($9.2k MRR), ship the referral program, and review paid-social spend. It’s our weakest channel at 2.1× LTV:CAC.`,
    attachment: 'summary',
    sources: ['metrics.weekly_rollup', 'stripe.subscriptions', 'deploys.web', 'crm.opportunities'],
    followups: ['Turn this into a slide', 'Email this to leadership', 'Compare with last month'],
  },
]

export const DEFAULT_REPLY: CannedReply = {
  id: 'default',
  match: /.*/,
  steps: ['Understanding your question…', 'Querying 12.4M events…', 'Checking for anomalies…'],
  text: `I looked across the last 30 days of product and billing data. Here’s the short version:

- **Engagement is trending up.** Sessions grew **+18%** month over month, and the busiest hours are 14:00–17:00 UTC.
- **Nothing unusual stands out** except one outlier on Sep 22, which lines up with the checkout incident.
- **Your strongest leading indicator** is the share of workspaces that run an AI query in week one. It’s currently **43%**.

If you tell me which metric, segment or time range you care about, I can go deeper. For example, try “retention for Growth-plan teams in EMEA”.`,
  attachment: 'sessions',
  sources: ['events.session_start', 'events.page_view'],
  followups: ['Why did revenue dip last Tuesday?', 'Which accounts might churn?', 'Summarize this week for my CEO'],
}

export const pickReply = (prompt: string) => REPLIES.find((r) => r.match.test(prompt)) ?? DEFAULT_REPLY

export const SUGGESTIONS = [
  { prompt: 'Why did revenue dip last Tuesday?', tag: 'Anomaly detection', icon: 'dip' },
  { prompt: 'Forecast MRR for Q4', tag: 'Forecasting', icon: 'forecast' },
  { prompt: 'Which channel has the best LTV?', tag: 'Attribution', icon: 'channels' },
  { prompt: 'Summarize this week for my CEO', tag: 'Reporting', icon: 'summary' },
] as const
