export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  category: string;
  readMinutes: number;
  keywords: string[];
  content: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "admission-workflow-automation",
    title: "How To Automate Admissions Without Losing Human Touch",
    description:
      "A practical admission workflow for school operators: enquiry capture, document collection, fee steps, and parent communication.",
    publishedAt: "2026-02-18",
    author: "SchoolAI Team",
    category: "Admissions",
    readMinutes: 6,
    keywords: [
      "school admission software",
      "admissions workflow",
      "school ERP admission",
    ],
    content: [
      "Admissions fail when schools depend on spreadsheets, WhatsApp threads, and disconnected follow-ups. A good process keeps every enquiry visible from first contact to paid admission.",
      "Start with a single enquiry intake form and auto-create a candidate profile. Track source, preferred grade, guardian contacts, and priority notes from the first call.",
      "Next, standardize document collection with status checkpoints. Every candidate should have a clear checklist with pending, received, and verified states.",
      "Interview scheduling and communication should be automated: reminders to staff, confirmations to parents, and follow-up nudges for incomplete applications.",
      "Finally, move accepted applicants into fee setup and class allocation with one action. This eliminates duplicate entry and reduces admission season bottlenecks.",
    ],
  },
  {
    slug: "improve-fee-collection-rate",
    title: "7 Ways Schools Improve Fee Collection Rate In One Term",
    description:
      "Collection rate improves with better reminders, installments, online payments, and clear overdue workflows.",
    publishedAt: "2026-02-25",
    author: "SchoolAI Team",
    category: "Finance",
    readMinutes: 7,
    keywords: [
      "school fee collection",
      "school payment reminders",
      "school finance management",
    ],
    content: [
      "Collection performance is less about strictness and more about predictable systems. Families pay faster when due dates, channels, and reminders are clear.",
      "First, define fee plans with installment options. Smaller scheduled payments reduce default risk compared to one large due date.",
      "Second, activate multi-channel reminders across SMS, email, and WhatsApp. Send reminders before due date, on due date, and after due date with escalation.",
      "Third, provide online payment and instant receipt generation. Removing friction at payment time directly improves completion rate.",
      "Fourth, monitor aging buckets weekly (0-7, 8-30, 31+ days). Assign accountability to finance staff and track follow-up outcomes.",
      "When schools combine these operational controls, fee collection becomes measurable and repeatable rather than reactive.",
    ],
  },
  {
    slug: "attendance-insights-for-learning-outcomes",
    title: "Using Attendance Insights To Improve Learning Outcomes",
    description:
      "Attendance should not be a compliance dashboard only. It can be used to trigger interventions and reduce academic risk.",
    publishedAt: "2026-03-01",
    author: "SchoolAI Team",
    category: "Academics",
    readMinutes: 5,
    keywords: [
      "school attendance analytics",
      "student performance dashboard",
      "school data insights",
    ],
    content: [
      "Most schools record attendance daily but do not act on the pattern. Insight comes from trend signals, not isolated absences.",
      "Create automated risk alerts for repeated absenteeism and late arrivals. Alert class teachers and parents early, before performance drops.",
      "Correlate attendance with exam and assignment metrics each month. This gives teachers objective evidence to prioritize student support.",
      "Use class-level heatmaps to identify timetable periods or days with unusually low attendance. These patterns often reveal operational issues.",
      "Attendance data becomes strategic when combined with action plans and review cycles. The goal is better outcomes, not just better records.",
    ],
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
