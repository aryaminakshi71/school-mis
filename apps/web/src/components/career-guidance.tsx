import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  Briefcase,
  ChevronRight,
  GraduationCap,
  Lightbulb,
  Target,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

export interface CareerPath {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  averageSalary: string;
  growthOutlook: string;
  educationRequired: string[];
  relatedCareers: string[];
}

export interface StudentProfile {
  interests: string[];
  strengths: string[];
  academicScores: Record<string, number>;
  extracurriculars: string[];
  careerGoals: string[];
}

interface CareerGuidanceProps {
  studentProfile: StudentProfile;
  onExploreCareer: (careerId: string) => void;
  onTakeAssessment: () => void;
}

const CAREER_PATHS: CareerPath[] = [
  {
    id: "software-engineer",
    title: "Software Engineer",
    description:
      "Design, develop, and maintain software applications and systems. Work on cutting-edge technology solutions.",
    requiredSkills: [
      "Programming",
      "Problem Solving",
      "Algorithms",
      "System Design",
    ],
    averageSalary: "₹8-30 LPA",
    growthOutlook: "High demand in tech industry",
    educationRequired: ["B.Tech/B.E in CS/IT", "MCA", "BCA"],
    relatedCareers: ["Data Scientist", "DevOps Engineer", "Product Manager"],
  },
  {
    id: "doctor",
    title: "Medical Doctor",
    description:
      "Diagnose and treat illnesses, injuries, and other health conditions. Specialize in various medical fields.",
    requiredSkills: [
      "Medical Knowledge",
      "Patient Care",
      "Critical Thinking",
      "Communication",
    ],
    averageSalary: "₹10-50 LPA",
    growthOutlook: "Always in demand",
    educationRequired: ["MBBS", "MD/MS Specialization"],
    relatedCareers: ["Surgeon", "Specialist", "Medical Researcher"],
  },
  {
    id: "civil-services",
    title: "Civil Services Officer",
    description:
      "Serve the nation through administrative roles in government. Make policy decisions and implement development programs.",
    requiredSkills: [
      "Leadership",
      "Decision Making",
      "Public Policy",
      "Administration",
    ],
    averageSalary: "₹8-20 LPA + Benefits",
    growthOutlook: "Prestigious government career",
    educationRequired: ["Any Graduate Degree", "Clear UPSC Exam"],
    relatedCareers: ["State Services", "Foreign Services", "Police Services"],
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    description:
      "Analyze complex data sets to help organizations make better decisions. Work with AI and machine learning.",
    requiredSkills: [
      "Statistics",
      "Python/R",
      "Machine Learning",
      "Data Visualization",
    ],
    averageSalary: "₹10-40 LPA",
    growthOutlook: "Fastest growing field",
    educationRequired: ["B.Tech/B.E", "M.Tech/MS in Data Science"],
    relatedCareers: ["Data Analyst", "ML Engineer", "Business Analyst"],
  },
  {
    id: "entrepreneur",
    title: "Entrepreneur",
    description:
      "Start and grow your own business. Innovate and create value in the market.",
    requiredSkills: [
      "Leadership",
      "Risk Management",
      "Business Strategy",
      "Innovation",
    ],
    averageSalary: "Variable (Unlimited potential)",
    growthOutlook: "Build your own empire",
    educationRequired: ["Any Degree (optional)", "MBA helpful"],
    relatedCareers: ["Startup Founder", "Business Consultant", "Investor"],
  },
];

export function CareerGuidance({
  studentProfile,
  onExploreCareer,
  onTakeAssessment,
}: CareerGuidanceProps) {
  const [selectedCareer, setSelectedCareer] = useState<CareerPath | null>(null);
  const [activeTab, setActiveTab] = useState<
    "recommended" | "all" | "assessment"
  >("recommended");

  // AI-based career matching (simplified for demo)
  const getRecommendedCareers = () => {
    const scores = CAREER_PATHS.map((career) => {
      let score = 0;

      // Match with student interests
      career.requiredSkills.forEach((skill) => {
        if (
          studentProfile.interests.some((i) =>
            skill.toLowerCase().includes(i.toLowerCase()),
          )
        ) {
          score += 2;
        }
      });

      // Match with academic scores
      if (
        studentProfile.academicScores.mathematics > 85 &&
        ["software-engineer", "data-scientist"].includes(career.id)
      ) {
        score += 3;
      }
      if (
        studentProfile.academicScores.science > 85 &&
        ["doctor", "data-scientist"].includes(career.id)
      ) {
        score += 3;
      }

      // Match with goals
      if (
        studentProfile.careerGoals.some(
          (goal) =>
            career.title.toLowerCase().includes(goal.toLowerCase()) ||
            career.description.toLowerCase().includes(goal.toLowerCase()),
        )
      ) {
        score += 5;
      }

      return { career, score };
    });

    return scores
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((s) => s.career);
  };

  const recommendedCareers = getRecommendedCareers();

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="border-gray-200 border-b p-6 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
            <GraduationCap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-xl dark:text-gray-100">
              AI Career Guidance
            </h2>
            <p className="text-gray-500 text-sm dark:text-gray-400">
              Personalized career recommendations based on your profile
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          {["recommended", "all", "assessment"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`rounded-lg px-4 py-2 font-medium text-sm capitalize transition-colors ${
                activeTab === tab
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {tab === "assessment" ? "Take Assessment" : tab}
            </button>
          ))}
        </div>

        {activeTab === "recommended" && (
          <div className="space-y-4">
            <div className="mb-6 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 p-4 dark:from-purple-900/20 dark:to-blue-900/20">
              <div className="flex items-start gap-3">
                <Lightbulb className="mt-1 h-6 w-6 text-purple-600 dark:text-purple-400" />
                <div>
                  <h3 className="mb-1 font-semibold text-purple-900 dark:text-purple-300">
                    AI-Powered Recommendations
                  </h3>
                  <p className="text-purple-700 text-sm dark:text-purple-400">
                    Based on your academic scores, interests, and goals, we've
                    identified these career paths as best matches for you.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {recommendedCareers.map((career, index) => (
                <motion.div
                  key={career.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedCareer(career)}
                  className="cursor-pointer rounded-xl border-2 border-transparent bg-gray-50 p-4 transition-colors hover:border-primary/20 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700/50"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium text-primary text-xs">
                      {index === 0 ? "Best Match" : `${90 - index * 10}% Match`}
                    </span>
                  </div>
                  <h4 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                    {career.title}
                  </h4>
                  <p className="line-clamp-2 text-gray-600 text-sm dark:text-gray-400">
                    {career.description}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-primary text-sm">
                    <span>Explore</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "all" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {CAREER_PATHS.map((career) => (
                <motion.div
                  key={career.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setSelectedCareer(career)}
                  className="cursor-pointer rounded-xl bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700/50"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {career.title}
                      </h4>
                      <p className="mt-1 text-gray-500 text-sm">
                        {career.averageSalary}
                      </p>
                    </div>
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="mt-2 text-gray-600 text-sm dark:text-gray-400">
                    {career.growthOutlook}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "assessment" && (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
              <Target className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="mb-2 font-semibold text-gray-900 text-lg dark:text-gray-100">
              Career Assessment Test
            </h3>
            <p className="mx-auto mb-6 max-w-md text-gray-600 dark:text-gray-400">
              Take our comprehensive AI-powered assessment to discover your
              ideal career path based on your personality, skills, and
              interests.
            </p>
            <button
              onClick={onTakeAssessment}
              className="rounded-xl bg-primary px-6 py-3 text-white transition-colors hover:bg-primary/90"
            >
              Start Assessment
            </button>
          </div>
        )}
      </div>

      {/* Career Detail Modal */}
      {selectedCareer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="max-h-[90vh] w-full max-w-2xl overflow-hidden overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
          >
            <div className="border-gray-200 border-b p-6 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 text-xl dark:text-gray-100">
                  {selectedCareer.title}
                </h3>
                <button
                  onClick={() => setSelectedCareer(null)}
                  className="rounded-lg p-2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="space-y-6 p-6">
              <p className="text-gray-700 dark:text-gray-300">
                {selectedCareer.description}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-green-50 p-4 dark:bg-green-900/20">
                  <p className="mb-1 text-green-600 text-sm dark:text-green-400">
                    Average Salary
                  </p>
                  <p className="font-bold text-green-900 text-lg dark:text-green-300">
                    {selectedCareer.averageSalary}
                  </p>
                </div>
                <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
                  <p className="mb-1 text-blue-600 text-sm dark:text-blue-400">
                    Growth Outlook
                  </p>
                  <p className="font-bold text-blue-900 text-lg dark:text-blue-300">
                    {selectedCareer.growthOutlook}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="mb-3 flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
                  <BookOpen className="h-5 w-5" />
                  Required Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCareer.requiredSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-3 flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
                  <Award className="h-5 w-5" />
                  Education Required
                </h4>
                <ul className="space-y-2">
                  {selectedCareer.educationRequired.map((edu, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-gray-700 text-sm dark:text-gray-300"
                    >
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      {edu}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="mb-3 font-semibold text-gray-900 dark:text-gray-100">
                  Related Careers
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCareer.relatedCareers.map((career, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-primary/10 px-3 py-1 text-primary text-sm"
                    >
                      {career}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  onExploreCareer(selectedCareer.id);
                  setSelectedCareer(null);
                }}
                className="w-full rounded-xl bg-primary py-3 text-white hover:bg-primary/90"
              >
                Explore This Career Path
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default CareerGuidance;
