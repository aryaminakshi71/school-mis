import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  Calendar,
  DollarSign,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Plus,
  Search,
  Users,
} from "lucide-react";
import { useState } from "react";

export interface Alumni {
  id: string;
  name: string;
  graduationYear: number;
  class: string;
  currentRole: string;
  company: string;
  location: string;
  email: string;
  phone?: string;
  linkedIn?: string;
  achievements: string[];
  contributions: Contribution[];
  isMentor: boolean;
  expertise: string[];
  profilePicture?: string;
}

export interface Contribution {
  id: string;
  type:
    | "donation"
    | "scholarship"
    | "infrastructure"
    | "equipment"
    | "mentorship";
  amount?: number;
  description: string;
  date: Date;
  isAnonymous: boolean;
}

export interface AlumniEvent {
  id: string;
  title: string;
  date: Date;
  venue: string;
  description: string;
  attendees: string[];
  type: "reunion" | "networking" | "webinar" | "fundraising";
}

export interface JobPosting {
  id: string;
  company: string;
  role: string;
  location: string;
  type: "full-time" | "internship" | "contract";
  description: string;
  requirements: string[];
  postedBy: string;
  postedDate: Date;
  isActive: boolean;
}

interface AlumniNetworkProps {
  onAddAlumni: (alumni: Omit<Alumni, "id" | "contributions">) => Promise<void>;
  onRecordContribution: (
    alumniId: string,
    contribution: Omit<Contribution, "id">,
  ) => Promise<void>;
  onCreateEvent: (
    event: Omit<AlumniEvent, "id" | "attendees">,
  ) => Promise<void>;
  onPostJob: (job: Omit<JobPosting, "id" | "postedDate">) => Promise<void>;
}

export function AlumniNetwork({
  onAddAlumni,
  onRecordContribution,
  onCreateEvent,
  onPostJob,
}: AlumniNetworkProps) {
  const [activeTab, setActiveTab] = useState<
    "directory" | "events" | "jobs" | "donations"
  >("directory");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterYear, setFilterYear] = useState<number | "all">("all");
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null);

  const [alumni, setAlumni] = useState<Alumni[]>([
    {
      id: "1",
      name: "Rahul Sharma",
      graduationYear: 2015,
      class: "12-A",
      currentRole: "Senior Software Engineer",
      company: "Google",
      location: "Mountain View, CA",
      email: "rahul@example.com",
      phone: "+1-555-0101",
      linkedIn: "linkedin.com/in/rahulsharma",
      achievements: ["Google Impact Award 2023", "Patent: ML Algorithm"],
      contributions: [
        {
          id: "c1",
          type: "scholarship",
          amount: 50000,
          description: "Rahul Sharma Scholarship Fund",
          date: new Date("2023-06-15"),
          isAnonymous: false,
        },
      ],
      isMentor: true,
      expertise: ["Computer Science", "AI/ML", "Career Guidance"],
    },
    {
      id: "2",
      name: "Priya Patel",
      graduationYear: 2016,
      class: "12-B",
      currentRole: "Product Manager",
      company: "Microsoft",
      location: "Seattle, WA",
      email: "priya@example.com",
      achievements: ["Forbes 30 Under 30"],
      contributions: [],
      isMentor: true,
      expertise: ["Product Management", "Tech Leadership"],
    },
    {
      id: "3",
      name: "Ananya Gupta",
      graduationYear: 2018,
      class: "12-A",
      currentRole: "Doctor",
      company: "AIIMS Delhi",
      location: "New Delhi, India",
      email: "ananya@example.com",
      achievements: ["Gold Medalist - MBBS"],
      contributions: [
        {
          id: "c2",
          type: "infrastructure",
          description: "Funded Science Lab Equipment",
          date: new Date("2022-12-10"),
          isAnonymous: true,
        },
      ],
      isMentor: false,
      expertise: ["Medicine", "Healthcare"],
    },
  ]);

  const [events, setEvents] = useState<AlumniEvent[]>([
    {
      id: "1",
      title: "Class of 2015 - 10 Year Reunion",
      date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      venue: "School Campus",
      description:
        "Celebrating 10 years of graduation. Dinner and networking event.",
      attendees: ["1", "2"],
      type: "reunion",
    },
    {
      id: "2",
      title: "Career Guidance Webinar",
      date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      venue: "Online (Zoom)",
      description: "Alumni sharing insights on tech careers and placements.",
      attendees: [],
      type: "webinar",
    },
  ]);

  const [jobs, setJobs] = useState<JobPosting[]>([
    {
      id: "1",
      company: "Google",
      role: "Software Engineer - New Grad",
      location: "Bangalore, India",
      type: "full-time",
      description:
        "Entry-level software engineering position for recent graduates.",
      requirements: [
        "B.Tech/BE in CS",
        "Strong programming skills",
        "Problem-solving ability",
      ],
      postedBy: "Rahul Sharma",
      postedDate: new Date(),
      isActive: true,
    },
    {
      id: "2",
      company: "Microsoft",
      role: "Product Management Intern",
      location: "Hyderabad, India",
      type: "internship",
      description: "Summer internship for MBA students.",
      requirements: [
        "MBA student",
        "Analytical skills",
        "Communication skills",
      ],
      postedBy: "Priya Patel",
      postedDate: new Date(),
      isActive: true,
    },
  ]);

  const filteredAlumni = alumni.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.currentRole.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesYear = filterYear === "all" || a.graduationYear === filterYear;
    return matchesSearch && matchesYear;
  });

  const totalDonations = alumni.reduce(
    (sum, a) =>
      sum +
      a.contributions
        .filter((c) => c.amount)
        .reduce((cSum, c) => cSum + (c.amount || 0), 0),
    0,
  );

  const uniqueYears = [...new Set(alumni.map((a) => a.graduationYear))].sort(
    (a, b) => b - a,
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="border-gray-200 border-b p-6 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
              <GraduationCap className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-xl dark:text-gray-100">
                Alumni Network
              </h2>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                Connect with former students
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {["directory", "events", "jobs", "donations"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`rounded-lg px-4 py-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        {activeTab === "directory" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative min-w-[200px] flex-1">
                <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-gray-400" />
                <input
                  type="text"
                  placeholder="Search alumni..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchQuery(e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:ring-2 focus:ring-primary dark:border-gray-700"
                />
              </div>
              <select
                value={filterYear}
                onChange={(e) =>
                  setFilterYear(
                    e.target.value === "all" ? "all" : Number(e.target.value),
                  )
                }
                className="rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-700"
              >
                <option value="all">All Years</option>
                {uniqueYears.map((year) => (
                  <option key={year} value={year}>
                    Class of {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filteredAlumni.map((person) => (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setSelectedAlumni(person)}
                  className="cursor-pointer rounded-xl bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700/50"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                      <span className="font-bold text-indigo-600 text-xl">
                        {person.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {person.name}
                        </h3>
                        {person.isMentor && (
                          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-blue-700 text-xs dark:bg-blue-900/30 dark:text-blue-300">
                            Mentor
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm dark:text-gray-400">
                        {person.currentRole} at {person.company}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Class of {person.graduationYear} • {person.location}
                      </p>

                      {person.contributions.length > 0 && (
                        <div className="mt-2 flex items-center gap-1 text-emerald-600 text-sm">
                          <DollarSign className="h-4 w-4" />
                          {person.contributions.length} contribution
                          {person.contributions.length > 1 ? "s" : ""}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "events" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Upcoming Events
              </h3>
              <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white">
                <Plus className="h-4 w-4" />
                Create Event
              </button>
            </div>

            <div className="space-y-3">
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {event.title}
                      </h4>
                      <p className="mt-1 text-gray-600 text-sm dark:text-gray-400">
                        {event.description}
                      </p>
                      <div className="mt-2 flex items-center gap-4 text-gray-600 text-sm dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {event.date.toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {event.venue}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {event.attendees.length} attending
                        </span>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs capitalize ${
                        event.type === "reunion"
                          ? "bg-blue-100 text-blue-700"
                          : event.type === "fundraising"
                            ? "bg-green-100 text-green-700"
                            : event.type === "webinar"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {event.type}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "jobs" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Job Opportunities
              </h3>
              <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white">
                <Plus className="h-4 w-4" />
                Post Job
              </button>
            </div>

            <div className="space-y-3">
              {jobs
                .filter((j) => j.isActive)
                .map((job) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                          {job.role}
                        </h4>
                        <p className="text-gray-600 text-sm dark:text-gray-400">
                          {job.company} • {job.location}
                        </p>
                        <p className="mt-2 text-gray-500 text-sm">
                          {job.description}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {job.requirements.map((req, idx) => (
                            <span
                              key={idx}
                              className="rounded bg-white px-2 py-1 text-xs dark:bg-gray-700"
                            >
                              {req}
                            </span>
                          ))}
                        </div>
                        <p className="mt-2 text-gray-400 text-xs">
                          Posted by {job.postedBy} on{" "}
                          {job.postedDate.toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          job.type === "full-time"
                            ? "bg-blue-100 text-blue-700"
                            : job.type === "internship"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {job.type}
                      </span>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        )}

        {activeTab === "donations" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-900/20">
                <p className="text-emerald-600 text-sm dark:text-emerald-400">
                  Total Contributions
                </p>
                <p className="font-bold text-2xl text-emerald-900 dark:text-emerald-300">
                  ₹{totalDonations.toLocaleString()}
                </p>
              </div>
              <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
                <p className="text-blue-600 text-sm dark:text-blue-400">
                  Active Donors
                </p>
                <p className="font-bold text-2xl text-blue-900 dark:text-blue-300">
                  {alumni.filter((a) => a.contributions.length > 0).length}
                </p>
              </div>
              <div className="rounded-xl bg-purple-50 p-4 dark:bg-purple-900/20">
                <p className="text-purple-600 text-sm dark:text-purple-400">
                  Mentors Available
                </p>
                <p className="font-bold text-2xl text-purple-900 dark:text-purple-300">
                  {alumni.filter((a) => a.isMentor).length}
                </p>
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">
                Recent Contributions
              </h3>
              <div className="space-y-3">
                {alumni
                  .flatMap((a) =>
                    a.contributions.map((c) => ({
                      ...c,
                      alumniName: a.name,
                      isAnonymous: c.isAnonymous,
                    })),
                  )
                  .sort((a, b) => b.date.getTime() - a.date.getTime())
                  .slice(0, 5)
                  .map((contribution, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl bg-gray-50 p-4 dark:bg-gray-800"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {contribution.isAnonymous
                            ? "Anonymous Donor"
                            : contribution.alumniName}
                        </p>
                        <p className="text-gray-600 text-sm dark:text-gray-400">
                          {contribution.description}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {contribution.date.toLocaleDateString()}
                        </p>
                      </div>
                      {contribution.amount && (
                        <span className="font-bold text-emerald-600">
                          ₹{contribution.amount.toLocaleString()}
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Alumni Detail Modal */}
      <AnimatePresence>
        {selectedAlumni && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="max-h-[90vh] w-full max-w-2xl overflow-hidden overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
            >
              <div className="border-gray-200 border-b p-6 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                      <span className="font-bold text-2xl text-indigo-600">
                        {selectedAlumni.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-xl dark:text-gray-100">
                        {selectedAlumni.name}
                      </h3>
                      <p className="text-gray-500">
                        Class of {selectedAlumni.graduationYear} •{" "}
                        {selectedAlumni.class}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedAlumni(null)}
                    className="rounded-lg p-2 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="space-y-6 p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                    <p className="mb-1 text-gray-500 text-xs">Current Role</p>
                    <p className="font-semibold">
                      {selectedAlumni.currentRole}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {selectedAlumni.company}
                    </p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                    <p className="mb-1 text-gray-500 text-xs">Location</p>
                    <p className="font-semibold">{selectedAlumni.location}</p>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                    Contact
                  </h4>
                  <div className="space-y-2">
                    <a
                      href={`mailto:${selectedAlumni.email}`}
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <Mail className="h-4 w-4" />
                      {selectedAlumni.email}
                    </a>
                    {selectedAlumni.linkedIn && (
                      <a
                        href={`https://${selectedAlumni.linkedIn}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary hover:underline"
                      >
                        <Linkedin className="h-4 w-4" />
                        LinkedIn Profile
                      </a>
                    )}
                  </div>
                </div>

                {selectedAlumni.achievements.length > 0 && (
                  <div>
                    <h4 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                      Achievements
                    </h4>
                    <ul className="space-y-1">
                      {selectedAlumni.achievements.map((achievement, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2 text-sm"
                        >
                          <span>🏆</span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedAlumni.isMentor && (
                  <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
                    <h4 className="mb-2 flex items-center gap-2 font-semibold text-blue-900 dark:text-blue-300">
                      <Briefcase className="h-4 w-4" />
                      Available for Mentorship
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedAlumni.expertise.map((exp, idx) => (
                        <span
                          key={idx}
                          className="rounded bg-white px-2 py-1 text-sm dark:bg-gray-800"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AlumniNetwork;
