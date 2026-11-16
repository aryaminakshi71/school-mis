import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  Download,
  Eye,
  FileText,
  Folder,
  Globe,
  GraduationCap,
  Heart,
  Image,
  Link2,
  MoreVertical,
  Plus,
  Search,
  Share2,
  Star,
  User,
  X,
  Youtube,
} from "lucide-react";
import { useState } from "react";

export type PortfolioSection =
  | "education"
  | "projects"
  | "experience"
  | "skills"
  | "certifications"
  | "achievements"
  | "reflections";
export type Visibility = "private" | "school-only" | "public";
export type MediaType = "image" | "video" | "document" | "link" | "audio";

export interface DigitalPortfolio {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  graduationYear: number;
  bio: string;
  profileImage?: string;
  theme: "minimal" | "creative" | "professional" | "academic";
  accentColor: string;
  visibility: Visibility;
  isPublished: boolean;
  customUrl?: string;
  viewCount: number;
  lastUpdated: Date;
  sections: PortfolioSectionData[];
  tags: string[];
  socialLinks?: SocialLink[];
}

export interface PortfolioSectionData {
  id: string;
  type: PortfolioSection;
  title: string;
  description?: string;
  order: number;
  isVisible: boolean;
  items: PortfolioItem[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  date: Date;
  media: MediaItem[];
  tags: string[];
  skills: string[];
  reflection?: string;
  teacherFeedback?: TeacherFeedback;
  isFeatured: boolean;
  viewCount: number;
  likes: number;
}

export interface MediaItem {
  id: string;
  type: MediaType;
  url: string;
  thumbnail?: string;
  title: string;
  description?: string;
  fileSize?: number;
  duration?: number;
}

export interface TeacherFeedback {
  teacherId: string;
  teacherName: string;
  feedback: string;
  rating: number;
  date: Date;
  isPublic: boolean;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface PortfolioTemplate {
  id: string;
  name: string;
  description: string;
  theme: "minimal" | "creative" | "professional" | "academic";
  previewImage: string;
  sections: PortfolioSection[];
}

interface DigitalPortfolioProps {
  userRole?: "student" | "teacher" | "admin" | "parent";
  userId?: string;
  onCreatePortfolio?: (
    portfolio: Omit<DigitalPortfolio, "id" | "viewCount" | "lastUpdated">,
  ) => Promise<string>;
  onUpdatePortfolio?: (
    portfolioId: string,
    updates: Partial<DigitalPortfolio>,
  ) => Promise<void>;
  onAddItem?: (
    portfolioId: string,
    sectionId: string,
    item: Omit<PortfolioItem, "id" | "viewCount" | "likes">,
  ) => Promise<string>;
  onAddFeedback?: (
    portfolioId: string,
    sectionId: string,
    itemId: string,
    feedback: Omit<TeacherFeedback, "date">,
  ) => Promise<void>;
  onSharePortfolio?: (
    portfolioId: string,
    visibility: Visibility,
  ) => Promise<void>;
}

export function DigitalPortfolioComponent({
  userRole = "student",
  userId = "S001",
  onCreatePortfolio,
  onUpdatePortfolio,
  onAddItem,
  onAddFeedback,
  onSharePortfolio,
}: DigitalPortfolioProps) {
  const [activeTab, setActiveTab] = useState<
    "my-portfolio" | "browse" | "templates"
  >("my-portfolio");
  const [selectedPortfolio, setSelectedPortfolio] =
    useState<DigitalPortfolio | null>(null);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [selectedSection, setSelectedSection] =
    useState<PortfolioSection | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [portfolio, setPortfolio] = useState<DigitalPortfolio>({
    id: "PORT001",
    studentId: userId,
    studentName: "Emma Johnson",
    grade: "11",
    graduationYear: 2026,
    bio: "Passionate learner exploring the intersection of science, art, and technology. Dedicated to environmental sustainability and creative problem-solving.",
    theme: "creative",
    accentColor: "#6366f1",
    visibility: "school-only",
    isPublished: true,
    customUrl: "emma-johnson-2026",
    viewCount: 342,
    lastUpdated: new Date(Date.now() - 86400000),
    sections: [
      {
        id: "SEC001",
        type: "education",
        title: "Academic Journey",
        description: "My educational path and key learning milestones",
        order: 1,
        isVisible: true,
        items: [
          {
            id: "ITEM001",
            title: "AP Biology Excellence",
            description:
              "Achieved top scores in AP Biology with a focus on genetics and ecology research projects.",
            date: new Date(Date.now() - 2592000000),
            media: [
              {
                id: "M1",
                type: "image",
                url: "/portfolio/bio-project.jpg",
                thumbnail: "/portfolio/bio-thumb.jpg",
                title: "Genetics Research Project",
              },
              {
                id: "M2",
                type: "document",
                url: "/portfolio/lab-report.pdf",
                title: "Lab Report: DNA Extraction",
                fileSize: 2048000,
              },
            ],
            tags: ["Biology", "AP", "Research"],
            skills: ["Scientific Method", "Data Analysis", "Lab Techniques"],
            reflection:
              "This project taught me the importance of attention to detail in scientific research. I discovered my passion for genetics and want to pursue it further.",
            teacherFeedback: {
              teacherId: "T001",
              teacherName: "Dr. Sarah Chen",
              feedback:
                "Emma demonstrated exceptional analytical skills and dedication to her research. Her attention to detail and creative approach to problem-solving sets her apart.",
              rating: 5,
              date: new Date(Date.now() - 2419200000),
              isPublic: true,
            },
            isFeatured: true,
            viewCount: 89,
            likes: 24,
          },
          {
            id: "ITEM002",
            title: "Creative Writing Award",
            description:
              "Received first place in the Regional Creative Writing Competition for my short story 'Echoes of Tomorrow'.",
            date: new Date(Date.now() - 5184000000),
            media: [
              {
                id: "M3",
                type: "document",
                url: "/portfolio/echoes-tomorrow.pdf",
                title: "Echoes of Tomorrow - Short Story",
                fileSize: 1024000,
              },
            ],
            tags: ["Creative Writing", "Literature", "Award"],
            skills: [
              "Creative Writing",
              "Storytelling",
              "Character Development",
            ],
            reflection:
              "Writing this story helped me explore themes of identity and future possibilities. I'm proud of how it resonated with readers.",
            isFeatured: true,
            viewCount: 156,
            likes: 42,
          },
        ],
      },
      {
        id: "SEC002",
        type: "projects",
        title: "Projects & Creations",
        description: "Hands-on projects that showcase my skills and interests",
        order: 2,
        isVisible: true,
        items: [
          {
            id: "ITEM003",
            title: "Sustainable Garden App",
            description:
              "Developed a mobile app to help urban gardeners track plant health, watering schedules, and sustainable practices.",
            date: new Date(Date.now() - 10368000000),
            media: [
              {
                id: "M4",
                type: "image",
                url: "/portfolio/app-screenshot.png",
                thumbnail: "/portfolio/app-thumb.jpg",
                title: "App Interface Design",
              },
              {
                id: "M5",
                type: "link",
                url: "https://github.com/emma/garden-app",
                title: "GitHub Repository",
              },
              {
                id: "M6",
                type: "video",
                url: "/portfolio/app-demo.mp4",
                thumbnail: "/portfolio/demo-thumb.jpg",
                title: "App Demo Video",
                duration: 180,
              },
            ],
            tags: ["Coding", "App Development", "Sustainability", "UX Design"],
            skills: [
              "React Native",
              "UI/UX Design",
              "API Integration",
              "Project Management",
            ],
            reflection:
              "This project combined my passion for technology and environmental sustainability. I learned valuable lessons about user research and iterative design.",
            teacherFeedback: {
              teacherId: "T002",
              teacherName: "Mr. James Wilson",
              feedback:
                "Outstanding project that demonstrates real-world application of coding skills. Emma's attention to user experience and sustainability issues is impressive.",
              rating: 5,
              date: new Date(Date.now() - 9504000000),
              isPublic: true,
            },
            isFeatured: true,
            viewCount: 234,
            likes: 67,
          },
        ],
      },
      {
        id: "SEC003",
        type: "skills",
        title: "Skills & Expertise",
        description: "Core competencies and abilities I've developed",
        order: 3,
        isVisible: true,
        items: [
          {
            id: "ITEM004",
            title: "Technical Skills",
            description:
              "Proficient in multiple programming languages and development tools. Experienced with web development, mobile apps, and data analysis.",
            date: new Date(),
            media: [],
            tags: ["Technical", "Programming", "Development"],
            skills: ["Python", "JavaScript", "React", "HTML/CSS", "SQL", "Git"],
            isFeatured: false,
            viewCount: 45,
            likes: 12,
          },
          {
            id: "ITEM005",
            title: "Creative Skills",
            description:
              "Strong foundation in visual arts, creative writing, and multimedia design. Experienced with Adobe Creative Suite and digital art tools.",
            date: new Date(),
            media: [
              {
                id: "M7",
                type: "image",
                url: "/portfolio/artwork.jpg",
                thumbnail: "/portfolio/art-thumb.jpg",
                title: "Digital Art Portfolio Sample",
              },
            ],
            tags: ["Creative", "Design", "Art"],
            skills: [
              "Adobe Photoshop",
              "Illustrator",
              "Digital Art",
              "Creative Writing",
            ],
            isFeatured: false,
            viewCount: 78,
            likes: 23,
          },
        ],
      },
      {
        id: "SEC004",
        type: "certifications",
        title: "Certifications",
        description: "Professional certifications and credentials",
        order: 4,
        isVisible: true,
        items: [
          {
            id: "ITEM006",
            title: "Python Programming Certification",
            description:
              "Completed comprehensive Python programming course with distinction. Covered advanced topics including data structures, algorithms, and web frameworks.",
            date: new Date(Date.now() - 7776000000),
            media: [
              {
                id: "M8",
                type: "image",
                url: "/portfolio/python-cert.jpg",
                thumbnail: "/portfolio/cert-thumb.jpg",
                title: "Python Certification",
              },
            ],
            tags: ["Certification", "Python", "Programming"],
            skills: ["Python", "Programming Fundamentals"],
            isFeatured: false,
            viewCount: 56,
            likes: 18,
          },
        ],
      },
    ],
    tags: ["STEM", "Creative Arts", "Sustainability", "Technology"],
    socialLinks: [
      { platform: "LinkedIn", url: "https://linkedin.com/in/emmajohnson" },
      { platform: "GitHub", url: "https://github.com/emmajohnson" },
    ],
  });

  const [templates] = useState<PortfolioTemplate[]>([
    {
      id: "TEMPL001",
      name: "Minimal",
      description: "Clean, simple design focused on content",
      theme: "minimal",
      previewImage: "/templates/minimal.jpg",
      sections: ["education", "projects", "skills"],
    },
    {
      id: "TEMPL002",
      name: "Creative",
      description: "Vibrant, artistic design for showcasing creative work",
      theme: "creative",
      previewImage: "/templates/creative.jpg",
      sections: ["projects", "education", "achievements", "skills"],
    },
    {
      id: "TEMPL003",
      name: "Professional",
      description: "Polished, corporate-ready design",
      theme: "professional",
      previewImage: "/templates/professional.jpg",
      sections: ["experience", "education", "certifications", "skills"],
    },
  ]);

  const [newItem, setNewItem] = useState<Partial<PortfolioItem>>({
    isFeatured: false,
    media: [],
    tags: [],
    skills: [],
  });

  const sectionIcons: Record<PortfolioSection, any> = {
    education: GraduationCap,
    projects: Briefcase,
    experience: Calendar,
    skills: Star,
    certifications: Award,
    achievements: Trophy,
    reflections: BookOpen,
  };

  const themeGradients: Record<string, string> = {
    minimal: "from-slate-100 to-slate-200",
    creative: "from-indigo-500 via-purple-500 to-pink-500",
    professional: "from-blue-600 to-blue-800",
    academic: "from-emerald-600 to-teal-700",
  };

  const handleAddItem = async () => {
    if (!selectedSection || !newItem.title || !newItem.description) return;

    const section = portfolio.sections.find((s) => s.type === selectedSection);
    if (!section) return;

    const item = {
      ...newItem,
      title: newItem.title!,
      description: newItem.description!,
      date: new Date(),
    } as Omit<PortfolioItem, "id" | "viewCount" | "likes">;

    const id = onAddItem
      ? await onAddItem(portfolio.id, section.id, item)
      : `ITEM${Date.now()}`;

    setPortfolio((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === section.id
          ? {
              ...s,
              items: [
                ...s.items,
                { ...item, id, viewCount: 0, likes: 0 } as PortfolioItem,
              ],
            }
          : s,
      ),
      lastUpdated: new Date(),
    }));

    setShowAddItemModal(false);
    setSelectedSection(null);
    setNewItem({ isFeatured: false, media: [], tags: [], skills: [] });
  };

  const totalItems = portfolio.sections.reduce(
    (sum, s) => sum + s.items.length,
    0,
  );
  const featuredItems = portfolio.sections.flatMap((s) =>
    s.items.filter((i) => i.isFeatured),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-3 font-bold text-3xl text-slate-900">
            <BookOpen className="h-8 w-8 text-indigo-600" />
            Digital Portfolio (e-Portfolio)
          </h2>
          <p className="mt-1 text-slate-600">
            Showcase your learning journey and achievements
          </p>
        </div>
        {userRole === "student" && (
          <div className="flex gap-3">
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-slate-700 transition-colors hover:bg-slate-50"
            >
              <Eye className="h-4 w-4" />
              {isPreviewMode ? "Edit Mode" : "Preview"}
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700"
            >
              <Plus className="h-5 w-5" />
              Add Content
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: "Total Items",
            value: totalItems,
            color: "bg-indigo-500",
            icon: Folder,
          },
          {
            label: "Featured",
            value: featuredItems.length,
            color: "bg-amber-500",
            icon: Star,
          },
          {
            label: "Views",
            value: portfolio.viewCount,
            color: "bg-green-500",
            icon: Eye,
          },
          {
            label: "Total Likes",
            value: portfolio.sections.reduce(
              (sum, s) => sum + s.items.reduce((iSum, i) => iSum + i.likes, 0),
              0,
            ),
            color: "bg-pink-500",
            icon: Heart,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-2 flex items-center gap-2">
              <stat.icon
                className={`h-4 w-4 ${stat.color.replace("bg-", "text-")}`}
              />
              <span className="text-slate-600 text-sm">{stat.label}</span>
            </div>
            <p className="font-bold text-2xl text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 border-slate-200 border-b">
        {[
          { id: "my-portfolio", label: "My Portfolio", icon: BookOpen },
          { id: "browse", label: "Browse Others", icon: Search },
          { id: "templates", label: "Templates", icon: Folder },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`relative flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? "border-indigo-600 border-b-2 text-indigo-600"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "my-portfolio" && (
        <div className="space-y-8">
          <div
            className={`rounded-2xl bg-gradient-to-br p-8 ${themeGradients[portfolio.theme]} text-white`}
          >
            <div className="flex items-start gap-6">
              <div className="h-24 w-24 rounded-full bg-white p-1 shadow-lg">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-200">
                  <User className="h-12 w-12 text-slate-400" />
                </div>
              </div>
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-3">
                  <h3 className="font-bold text-3xl">
                    {portfolio.studentName}
                  </h3>
                  {portfolio.isPublished && (
                    <span className="rounded-full bg-white/20 px-3 py-1 text-sm">
                      Published
                    </span>
                  )}
                </div>
                <p className="mb-3 text-white/80">
                  Grade {portfolio.grade} • Class of {portfolio.graduationYear}
                </p>
                <p className="max-w-2xl text-white/90">{portfolio.bio}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {portfolio.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/20 px-3 py-1 text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="rounded-full bg-white/20 p-2 transition-colors hover:bg-white/30">
                  <Share2 className="h-5 w-5" />
                </button>
                <button className="rounded-full bg-white/20 p-2 transition-colors hover:bg-white/30">
                  <Globe className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {portfolio.sections
            .filter((s) => s.isVisible)
            .sort((a, b) => a.order - b.order)
            .map((section) => {
              const Icon = sectionIcons[section.type] || Folder;
              return (
                <div
                  key={section.id}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
                >
                  <div className="border-slate-200 border-b p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-indigo-100 p-2">
                          <Icon className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-xl">
                            {section.title}
                          </h3>
                          {section.description && (
                            <p className="text-slate-600 text-sm">
                              {section.description}
                            </p>
                          )}
                        </div>
                      </div>
                      {!isPreviewMode && (
                        <button
                          onClick={() => {
                            setSelectedSection(section.type);
                            setShowAddItemModal(true);
                          }}
                          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white transition-colors hover:bg-indigo-700"
                        >
                          <Plus className="h-4 w-4" />
                          Add Item
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="divide-y divide-slate-200">
                    {section.items.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className="cursor-pointer p-6 transition-colors hover:bg-slate-50"
                      >
                        <div className="flex items-start gap-4">
                          {item.media.length > 0 && (
                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-slate-200">
                              {item.media[0].type === "image" ? (
                                <div className="flex h-full w-full items-center justify-center">
                                  <Image className="h-8 w-8 text-slate-400" />
                                </div>
                              ) : item.media[0].type === "video" ? (
                                <div className="flex h-full w-full items-center justify-center">
                                  <Youtube className="h-8 w-8 text-red-500" />
                                </div>
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <FileText className="h-8 w-8 text-slate-400" />
                                </div>
                              )}
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="mb-1 flex items-center gap-2">
                                  <h4 className="font-semibold text-lg text-slate-900">
                                    {item.title}
                                  </h4>
                                  {item.isFeatured && (
                                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-700 text-xs">
                                      Featured
                                    </span>
                                  )}
                                </div>
                                <p className="line-clamp-2 text-slate-600 text-sm">
                                  {item.description}
                                </p>
                                <div className="mt-2 flex items-center gap-3 text-slate-500 text-sm">
                                  <span>{item.date.toLocaleDateString()}</span>
                                  <span className="flex items-center gap-1">
                                    <Eye className="h-3 w-3" /> {item.viewCount}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Heart className="h-3 w-3" /> {item.likes}
                                  </span>
                                  <span>{item.media.length} media</span>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {item.tags.map((tag) => (
                                    <span
                                      key={tag}
                                      className="rounded bg-slate-100 px-2 py-0.5 text-slate-600 text-xs"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {item.teacherFeedback && (
                                  <div className="flex items-center gap-1 text-amber-500">
                                    <Star className="h-4 w-4 fill-amber-500" />
                                    <span className="font-medium text-sm">
                                      {item.teacherFeedback.rating}
                                    </span>
                                  </div>
                                )}
                                {!isPreviewMode && (
                                  <button className="p-2 text-slate-400 transition-colors hover:text-slate-600">
                                    <MoreVertical className="h-5 w-5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {section.items.length === 0 && (
                      <div className="p-12 text-center">
                        <Folder className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                        <p className="text-slate-500">
                          No items yet. Add your first{" "}
                          {section.title.toLowerCase()} entry!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {activeTab === "templates" && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md transition-shadow hover:shadow-lg"
            >
              <div
                className={`h-48 bg-gradient-to-br ${themeGradients[template.theme]}`}
              />
              <div className="p-6">
                <h3 className="mb-2 font-bold text-slate-900 text-xl">
                  {template.name}
                </h3>
                <p className="mb-4 text-slate-600">{template.description}</p>
                <div className="mb-4">
                  <p className="mb-2 text-slate-500 text-sm">
                    Includes sections:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {template.sections.map((section) => (
                      <span
                        key={section}
                        className="rounded bg-slate-100 px-2 py-0.5 text-slate-600 text-xs capitalize"
                      >
                        {section.replace("-", " ")}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700">
                  Use Template
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {selectedItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedItem(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="border-slate-200 border-b p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-3">
                    <h3 className="font-bold text-2xl text-slate-900">
                      {selectedItem.title}
                    </h3>
                    {selectedItem.isFeatured && (
                      <span className="rounded-full bg-amber-100 px-2 py-1 text-amber-700 text-xs">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600">
                    {selectedItem.date.toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="rounded-full p-2 transition-colors hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="space-y-6 p-6">
              <p className="text-slate-700">{selectedItem.description}</p>

              {selectedItem.media.length > 0 && (
                <div>
                  <h4 className="mb-3 font-semibold text-slate-900">Media</h4>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {selectedItem.media.map((media) => (
                      <div
                        key={media.id}
                        className="rounded-lg bg-slate-50 p-4"
                      >
                        {media.type === "image" && (
                          <Image className="mb-2 h-8 w-8 text-indigo-500" />
                        )}
                        {media.type === "video" && (
                          <Youtube className="mb-2 h-8 w-8 text-red-500" />
                        )}
                        {media.type === "document" && (
                          <FileText className="mb-2 h-8 w-8 text-blue-500" />
                        )}
                        {media.type === "link" && (
                          <Link2 className="mb-2 h-8 w-8 text-green-500" />
                        )}
                        <p className="font-medium text-slate-900 text-sm">
                          {media.title}
                        </p>
                        {media.fileSize && (
                          <p className="text-slate-500 text-xs">
                            {(media.fileSize / 1024 / 1024).toFixed(1)} MB
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {selectedItem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-indigo-100 px-3 py-1 text-indigo-700 text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {selectedItem.skills.length > 0 && (
                <div>
                  <h4 className="mb-3 font-semibold text-slate-900">
                    Skills Demonstrated
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedItem.reflection && (
                <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
                  <h4 className="mb-2 font-semibold text-indigo-900">
                    My Reflection
                  </h4>
                  <p className="text-indigo-800">{selectedItem.reflection}</p>
                </div>
              )}

              {selectedItem.teacherFeedback && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                    <span className="font-semibold text-amber-900">
                      Teacher Feedback ({selectedItem.teacherFeedback.rating}/5)
                    </span>
                  </div>
                  <p className="mb-2 text-amber-800">
                    {selectedItem.teacherFeedback.feedback}
                  </p>
                  <p className="text-amber-600 text-sm">
                    — {selectedItem.teacherFeedback.teacherName},{" "}
                    {selectedItem.teacherFeedback.date.toLocaleDateString()}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between border-slate-200 border-t pt-4">
                <div className="flex items-center gap-4 text-slate-500 text-sm">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" /> {selectedItem.viewCount} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-4 w-4" /> {selectedItem.likes} likes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-slate-700 transition-colors hover:bg-slate-50">
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                  <button className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-slate-700 transition-colors hover:bg-slate-50">
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showAddItemModal && selectedSection && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowAddItemModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="border-slate-200 border-b bg-indigo-50 p-6">
              <h3 className="font-bold text-indigo-900 text-xl">
                Add Portfolio Item
              </h3>
              <p className="text-indigo-700 capitalize">
                {selectedSection} Section
              </p>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <label className="mb-1 block font-medium text-slate-700 text-sm">
                  Title *
                </label>
                <input
                  type="text"
                  value={newItem.title || ""}
                  onChange={(e) =>
                    setNewItem({ ...newItem, title: e.target.value })
                  }
                  placeholder="Enter a title..."
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-slate-700 text-sm">
                  Description *
                </label>
                <textarea
                  value={newItem.description || ""}
                  onChange={(e) =>
                    setNewItem({ ...newItem, description: e.target.value })
                  }
                  placeholder="Describe this entry..."
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-slate-700 text-sm">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={newItem.tags?.join(", ") || ""}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      tags: e.target.value.split(",").map((t) => t.trim()),
                    })
                  }
                  placeholder="e.g., STEM, Creative, Award"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-slate-700 text-sm">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={newItem.skills?.join(", ") || ""}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      skills: e.target.value.split(",").map((s) => s.trim()),
                    })
                  }
                  placeholder="e.g., Leadership, Coding, Writing"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-slate-700 text-sm">
                  Reflection
                </label>
                <textarea
                  value={newItem.reflection || ""}
                  onChange={(e) =>
                    setNewItem({ ...newItem, reflection: e.target.value })
                  }
                  placeholder="What did you learn? How did you grow?"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                />
              </div>

              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={newItem.isFeatured}
                  onChange={(e) =>
                    setNewItem({ ...newItem, isFeatured: e.target.checked })
                  }
                  className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-slate-700">Feature this item</span>
              </label>
            </div>
            <div className="flex gap-3 border-slate-200 border-t p-6">
              <button
                onClick={handleAddItem}
                disabled={!newItem.title || !newItem.description}
                className="flex-1 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
              >
                Add to Portfolio
              </button>
              <button
                onClick={() => setShowAddItemModal(false)}
                className="rounded-lg border border-slate-300 px-6 py-3 text-slate-700 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

function Trophy(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
