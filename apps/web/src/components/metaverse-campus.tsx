import { AnimatePresence, motion } from "framer-motion";
import {
  Box,
  Calendar,
  Crown,
  Eye,
  Gamepad2,
  Glasses,
  Globe,
  Headphones,
  Hexagon,
  Layers,
  type LucideIcon,
  MapPin,
  MessageSquare,
  Mic,
  Monitor,
  Palette,
  Radio,
  Send,
  Share2,
  Shirt,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Trophy,
  Users,
  Video,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type Platform = "web" | "vr" | "ar" | "mobile";
export type AvatarType = "human" | "robot" | "creature" | "custom";
export type ZoneType =
  | "classroom"
  | "social"
  | "event"
  | "marketplace"
  | "outdoor";
export type AssetCategory =
  | "wearable"
  | "accessory"
  | "emote"
  | "furniture"
  | "building";
export type EventStatus = "upcoming" | "live" | "ended";

export interface Avatar {
  id: string;
  name: string;
  type: AvatarType;
  level: number;
  xp: number;
  maxXp: number;
  customization: AvatarCustomization;
  inventory: Asset[];
  friends: string[];
  achievements: Achievement[];
}

export interface AvatarCustomization {
  skin: string;
  hair: string;
  eyes: string;
  outfit: string;
  accessories: string[];
  emotes: string[];
}

export interface Asset {
  id: string;
  name: string;
  description: string;
  category: AssetCategory;
  price: number;
  currency: "coins" | "gems" | "nft";
  rarity: "common" | "rare" | "epic" | "legendary";
  thumbnail: string;
  equipped: boolean;
  isNFT?: boolean;
  blockchain?: string;
}

export interface Zone {
  id: string;
  name: string;
  type: ZoneType;
  description: string;
  capacity: number;
  currentUsers: number;
  thumbnail: string;
  tags: string[];
  coordinates: { x: number; y: number; z: number };
}

export interface Event {
  id: string;
  title: string;
  description: string;
  type: "class" | "social" | "competition" | "performance";
  status: EventStatus;
  startTime: Date;
  endTime: Date;
  zoneId: string;
  host: string;
  participants: number;
  maxParticipants: number;
  thumbnail: string;
  rewards: string[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline" | "in-world";
  currentZone?: string;
  level: number;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  message: string;
  timestamp: Date;
  type: "text" | "emote" | "system";
}

interface MetaverseCampusProps {
  userId?: string;
  userName?: string;
  initialPlatform?: Platform;
  onJoinZone?: (zoneId: string) => Promise<void>;
  onJoinEvent?: (eventId: string) => Promise<void>;
  onPurchaseAsset?: (assetId: string) => Promise<void>;
  onCustomizeAvatar?: (
    customization: Partial<AvatarCustomization>,
  ) => Promise<void>;
  onSendMessage?: (message: string) => Promise<void>;
}

const rarityColors = {
  common: "from-slate-400 to-slate-500",
  rare: "from-blue-400 to-blue-600",
  epic: "from-purple-400 to-purple-600",
  legendary: "from-amber-400 to-amber-600",
};

const rarityGlow = {
  common: "shadow-slate-500/20",
  rare: "shadow-blue-500/30",
  epic: "shadow-purple-500/40",
  legendary: "shadow-amber-500/50",
};

export function MetaverseCampus({
  userId = "U001",
  userName = "Student Explorer",
  initialPlatform = "web",
  onJoinZone,
  onJoinEvent,
  onPurchaseAsset,
  onCustomizeAvatar,
  onSendMessage,
}: MetaverseCampusProps) {
  const [activeTab, setActiveTab] = useState<
    "world" | "avatar" | "events" | "marketplace" | "social"
  >("world");
  const [selectedPlatform, setSelectedPlatform] =
    useState<Platform>(initialPlatform);
  const [isVRMode, setIsVRMode] = useState(false);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [showVoiceChat, setShowVoiceChat] = useState(false);
  const [miniMapExpanded, setMiniMapExpanded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [avatar, setAvatar] = useState<Avatar>({
    id: "A001",
    name: userName,
    type: "human",
    level: 12,
    xp: 3450,
    maxXp: 5000,
    customization: {
      skin: "#FFDBAC",
      hair: "#4A3728",
      eyes: "#4A90D9",
      outfit: "casual",
      accessories: ["glasses"],
      emotes: ["wave", "dance", "cheer"],
    },
    inventory: [],
    friends: [],
    achievements: [],
  });

  const [zones] = useState<Zone[]>([
    {
      id: "Z001",
      name: "Quantum Lecture Hall",
      type: "classroom",
      description:
        "Advanced learning space with holographic displays and interactive 3D models",
      capacity: 50,
      currentUsers: 23,
      thumbnail: "lecture-hall",
      tags: ["learning", "lecture", "academic"],
      coordinates: { x: 0, y: 0, z: 0 },
    },
    {
      id: "Z002",
      name: "Nebula Study Lounge",
      type: "social",
      description:
        "Relaxing space for group study with floating furniture and ambient lighting",
      capacity: 30,
      currentUsers: 18,
      thumbnail: "study-lounge",
      tags: ["study", "collaboration", "quiet"],
      coordinates: { x: 100, y: 0, z: 50 },
    },
    {
      id: "Z003",
      name: "Stellar Amphitheater",
      type: "event",
      description:
        "Grand venue for performances, presentations, and virtual gatherings",
      capacity: 200,
      currentUsers: 89,
      thumbnail: "amphitheater",
      tags: ["events", "performances", "gatherings"],
      coordinates: { x: -150, y: 0, z: 100 },
    },
    {
      id: "Z004",
      name: "Crystal Marketplace",
      type: "marketplace",
      description:
        "Trade virtual assets, NFTs, and custom creations with other students",
      capacity: 100,
      currentUsers: 67,
      thumbnail: "marketplace",
      tags: ["trading", "shopping", "nft"],
      coordinates: { x: 200, y: 0, z: -100 },
    },
    {
      id: "Z005",
      name: "Zen Garden Commons",
      type: "outdoor",
      description:
        "Peaceful outdoor area with virtual nature and meditation spaces",
      capacity: 40,
      currentUsers: 12,
      thumbnail: "garden",
      tags: ["relaxation", "nature", "meditation"],
      coordinates: { x: -100, y: 0, z: -150 },
    },
    {
      id: "Z006",
      name: "Innovation Lab",
      type: "classroom",
      description:
        "Hands-on lab for experiments, prototyping, and creative projects",
      capacity: 25,
      currentUsers: 15,
      thumbnail: "lab",
      tags: ["lab", "experiments", "creation"],
      coordinates: { x: 50, y: 0, z: 200 },
    },
  ]);

  const [events] = useState<Event[]>([
    {
      id: "E001",
      title: "AI Workshop: Future of Learning",
      description: "Interactive workshop on AI integration in education",
      type: "class",
      status: "live",
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000),
      zoneId: "Z001",
      host: "Prof. Neural",
      participants: 45,
      maxParticipants: 50,
      thumbnail: "ai-workshop",
      rewards: ["AI Badge", "50 XP", "Tech Token"],
    },
    {
      id: "E002",
      title: "Virtual Concert: Synthwave Nights",
      description: "Live performance by student band in the metaverse",
      type: "performance",
      status: "upcoming",
      startTime: new Date(Date.now() + 7200000),
      endTime: new Date(Date.now() + 10800000),
      zoneId: "Z003",
      host: "Student Band",
      participants: 0,
      maxParticipants: 200,
      thumbnail: "concert",
      rewards: ["Music Lover Badge", "100 XP"],
    },
    {
      id: "E003",
      title: "NFT Art Exhibition",
      description: "Showcase of student-created digital art and collectibles",
      type: "social",
      status: "upcoming",
      startTime: new Date(Date.now() + 86400000),
      endTime: new Date(Date.now() + 172800000),
      zoneId: "Z004",
      host: "Art Club",
      participants: 23,
      maxParticipants: 100,
      thumbnail: "nft-exhibition",
      rewards: ["Art Collector Badge", "NFT Drop"],
    },
    {
      id: "E004",
      title: "Metaverse Gaming Tournament",
      description: "Competitive gaming event with prizes and leaderboard",
      type: "competition",
      status: "live",
      startTime: new Date(),
      endTime: new Date(Date.now() + 7200000),
      zoneId: "Z005",
      host: "Gaming Guild",
      participants: 32,
      maxParticipants: 64,
      thumbnail: "tournament",
      rewards: ["Champion Trophy", "500 Gems", "Legendary Skin"],
    },
  ]);

  const [assets] = useState<Asset[]>([
    {
      id: "AS001",
      name: "Holo-Glasses",
      description: "Futuristic eyewear with AR overlay capabilities",
      category: "accessory",
      price: 150,
      currency: "coins",
      rarity: "rare",
      thumbnail: "glasses",
      equipped: false,
    },
    {
      id: "AS002",
      name: "Nebula Hoodie",
      description: "Hoodie with animated galaxy pattern",
      category: "wearable",
      price: 300,
      currency: "coins",
      rarity: "epic",
      thumbnail: "hoodie",
      equipped: false,
    },
    {
      id: "AS003",
      name: "Cyber Wings",
      description: "Mechanical wings with neon glow effects",
      category: "accessory",
      price: 0.05,
      currency: "nft",
      rarity: "legendary",
      thumbnail: "wings",
      equipped: false,
      isNFT: true,
      blockchain: "Ethereum",
    },
    {
      id: "AS004",
      name: "Victory Dance",
      description: "Exclusive celebration emote",
      category: "emote",
      price: 500,
      currency: "gems",
      rarity: "epic",
      thumbnail: "dance",
      equipped: false,
    },
    {
      id: "AS005",
      name: "Holographic Desk",
      description: "Floating workspace furniture",
      category: "furniture",
      price: 200,
      currency: "coins",
      rarity: "rare",
      thumbnail: "desk",
      equipped: false,
    },
  ]);

  const [friends] = useState<Friend[]>([
    {
      id: "F001",
      name: "Alex Chen",
      avatar: "human-male",
      status: "in-world",
      currentZone: "Quantum Lecture Hall",
      level: 15,
    },
    {
      id: "F002",
      name: "Sarah Kim",
      avatar: "human-female",
      status: "online",
      level: 12,
    },
    {
      id: "F003",
      name: "Jordan Smith",
      avatar: "robot",
      status: "in-world",
      currentZone: "Crystal Marketplace",
      level: 20,
    },
    {
      id: "F004",
      name: "Maya Patel",
      avatar: "creature",
      status: "offline",
      level: 8,
    },
    {
      id: "F005",
      name: "Chris Lee",
      avatar: "human-male",
      status: "in-world",
      currentZone: "Nebula Study Lounge",
      level: 14,
    },
  ]);

  const [achievements] = useState<Achievement[]>([
    {
      id: "ACH001",
      name: "First Steps",
      description: "Enter the metaverse for the first time",
      icon: "footprints",
      unlocked: true,
      unlockedAt: new Date(),
    },
    {
      id: "ACH002",
      name: "Social Butterfly",
      description: "Make 10 friends in the metaverse",
      icon: "users",
      unlocked: true,
      unlockedAt: new Date(),
    },
    {
      id: "ACH003",
      name: "Explorer",
      description: "Visit all zones in the campus",
      icon: "globe",
      unlocked: false,
    },
    {
      id: "ACH004",
      name: "Event Enthusiast",
      description: "Attend 5 virtual events",
      icon: "calendar",
      unlocked: true,
      unlockedAt: new Date(),
    },
    {
      id: "ACH005",
      name: "Collector",
      description: "Acquire your first NFT asset",
      icon: "hexagon",
      unlocked: false,
    },
    {
      id: "ACH006",
      name: "Scholar",
      description: "Complete 20 hours of virtual classes",
      icon: "trophy",
      unlocked: false,
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (chatMessages.length < 20) {
        const randomMessages = [
          { userName: "Alex Chen", message: "Anyone want to study together?" },
          { userName: "Sarah Kim", message: "The AI workshop is amazing! 🚀" },
          { userName: "Jordan Smith", message: "Check out my new NFT wings!" },
          { userName: "System", message: "New event starting in 5 minutes!" },
        ];
        const randomMsg =
          randomMessages[Math.floor(Math.random() * randomMessages.length)];
        setChatMessages((prev) => [
          ...prev.slice(-9),
          {
            id: Date.now().toString(),
            userId: "RANDOM",
            userName: randomMsg.userName,
            avatar: "default",
            message: randomMsg.message,
            timestamp: new Date(),
            type: "text",
          },
        ]);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [chatMessages.length]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Array<{
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      color: string;
    }> = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1000,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        vz: -Math.random() * 2 - 0.5,
        color: ["#8b5cf6", "#06b6d4", "#f59e0b", "#ec4899"][
          Math.floor(Math.random() * 4)
        ],
      });
    }

    const animate = () => {
      ctx.fillStyle = "rgba(15, 23, 42, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        if (p.z < 1) {
          p.z = 1000;
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
        }

        const scale = 1000 / p.z;
        const x2d = (p.x - canvas.width / 2) * scale + canvas.width / 2;
        const y2d = (p.y - canvas.height / 2) * scale + canvas.height / 2;
        const size = scale * 2;

        ctx.beginPath();
        ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        zones.forEach((zone) => {
          const zoneX = zone.coordinates.x * 0.5 + canvas.width / 2;
          const zoneY = zone.coordinates.z * 0.3 + canvas.height / 2;
          const dist = Math.sqrt((x2d - zoneX) ** 2 + (y2d - zoneY) ** 2);
          if (dist < 50 * scale) {
            ctx.beginPath();
            ctx.moveTo(x2d, y2d);
            ctx.lineTo(zoneX, zoneY);
            ctx.strokeStyle = `${p.color}20`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      zones.forEach((zone) => {
        const x = zone.coordinates.x * 0.5 + canvas.width / 2;
        const y = zone.coordinates.z * 0.3 + canvas.height / 2;

        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fillStyle =
          zone.type === "classroom"
            ? "#8b5cf6"
            : zone.type === "social"
              ? "#06b6d4"
              : zone.type === "event"
                ? "#f59e0b"
                : zone.type === "marketplace"
                  ? "#ec4899"
                  : "#10b981";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.strokeStyle =
          zone.type === "classroom"
            ? "#8b5cf640"
            : zone.type === "social"
              ? "#06b6d440"
              : zone.type === "event"
                ? "#f59e0b40"
                : zone.type === "marketplace"
                  ? "#ec489940"
                  : "#10b98140";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(zone.name, x, y + 20);
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [zones]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: userId,
      userName: userName,
      avatar: "default",
      message: chatInput,
      timestamp: new Date(),
      type: "text",
    };
    setChatMessages((prev) => [...prev, newMessage]);
    setChatInput("");
    onSendMessage?.(chatInput);
  };

  const joinZone = async (zone: Zone) => {
    await onJoinZone?.(zone.id);
    setSelectedZone(zone);
  };

  const joinEvent = async (event: Event) => {
    await onJoinEvent?.(event.id);
    setSelectedEvent(event);
  };

  const purchaseAsset = async (asset: Asset) => {
    await onPurchaseAsset?.(asset.id);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-950/50 via-slate-950 to-cyan-950/50" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-500/10 via-transparent to-transparent" />

      <div className="relative z-10 flex h-screen flex-col">
        <header className="flex items-center justify-between border-slate-800/50 border-b bg-slate-900/80 px-6 py-4 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Hexagon
                className="h-10 w-10 text-violet-500"
                strokeWidth={1.5}
              />
              <Sparkles className="-top-1 -right-1 absolute h-4 w-4 text-amber-400" />
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text font-bold text-transparent text-xl">
                Metaverse Campus
              </h1>
              <p className="text-slate-400 text-xs">
                v3.0 • {zones.reduce((acc, z) => acc + z.currentUsers, 0)} Users
                Online
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-lg border border-slate-700/50 bg-slate-800/50 p-1">
              {(
                [
                  { id: "web", icon: Monitor, label: "Web" },
                  { id: "vr", icon: Headphones, label: "VR" },
                  { id: "ar", icon: Glasses, label: "AR" },
                  { id: "mobile", icon: Smartphone, label: "Mobile" },
                ] as { id: Platform; icon: LucideIcon; label: string }[]
              ).map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium text-sm transition-all ${
                    selectedPlatform === platform.id
                      ? "border border-violet-500/30 bg-violet-500/20 text-violet-300"
                      : "text-slate-400 hover:bg-slate-700/30 hover:text-slate-200"
                  }`}
                  title={`Switch to ${platform.label}`}
                >
                  <platform.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{platform.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsVRMode(!isVRMode)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all ${
                isVRMode
                  ? "border border-cyan-500/30 bg-cyan-500/20 text-cyan-300"
                  : "border border-slate-700/50 bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
              }`}
            >
              <Gamepad2 className="h-4 w-4" />
              <span className="hidden sm:inline">
                {isVRMode ? "VR On" : "VR Off"}
              </span>
            </button>

            <div className="flex items-center gap-3 border-slate-700/50 border-l pl-4">
              <div className="hidden text-right sm:block">
                <p className="font-medium text-sm text-white">{avatar.name}</p>
                <p className="text-violet-400 text-xs">Level {avatar.level}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 p-0.5">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-800">
                  <Users className="h-5 w-5 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <nav className="flex w-20 flex-col items-center gap-2 border-slate-800/50 border-r bg-slate-900/50 py-6 backdrop-blur-xl">
            {[
              { id: "world", icon: Globe, label: "World" },
              { id: "avatar", icon: UserIcon, label: "Avatar" },
              { id: "events", icon: Calendar, label: "Events" },
              { id: "marketplace", icon: ShoppingBag, label: "Market" },
              { id: "social", icon: MessageSquare, label: "Social" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex h-14 w-14 flex-col items-center justify-center gap-1 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? "border border-violet-500/30 bg-violet-500/20 text-violet-300 shadow-lg shadow-violet-500/10"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span className="font-medium text-[10px]">{tab.label}</span>
              </button>
            ))}
          </nav>

          <main className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {activeTab === "world" && (
                <motion.div
                  key="world"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="relative h-96 overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/50">
                    <canvas
                      ref={canvasRef}
                      className="absolute inset-0 h-full w-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                    <div className="absolute right-4 bottom-4 left-4">
                      <div className="mb-2 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-violet-400" />
                        <span className="text-slate-300 text-sm">
                          Campus Map
                        </span>
                      </div>
                      <p className="font-bold text-2xl text-white">
                        Explore the Metaverse
                      </p>
                      <p className="text-slate-400 text-sm">
                        Navigate through virtual classrooms, social zones, and
                        event spaces
                      </p>
                    </div>
                    <button
                      onClick={() => setMiniMapExpanded(!miniMapExpanded)}
                      className="absolute top-4 right-4 rounded-lg bg-slate-800/80 p-2 text-slate-400 backdrop-blur transition-colors hover:text-white"
                    >
                      <Layers className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {zones.map((zone, idx) => (
                      <motion.div
                        key={zone.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => joinZone(zone)}
                        className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-800/50 bg-slate-900/50 backdrop-blur-sm transition-all hover:border-violet-500/30"
                      >
                        <div
                          className={`h-32 bg-gradient-to-br ${
                            zone.type === "classroom"
                              ? "from-violet-600/20 to-violet-900/20"
                              : zone.type === "social"
                                ? "from-cyan-600/20 to-cyan-900/20"
                                : zone.type === "event"
                                  ? "from-amber-600/20 to-amber-900/20"
                                  : zone.type === "marketplace"
                                    ? "from-pink-600/20 to-pink-900/20"
                                    : "from-emerald-600/20 to-emerald-900/20"
                          } relative flex items-center justify-center`}
                        >
                          <Box
                            className={`h-16 w-16 ${
                              zone.type === "classroom"
                                ? "text-violet-400"
                                : zone.type === "social"
                                  ? "text-cyan-400"
                                  : zone.type === "event"
                                    ? "text-amber-400"
                                    : zone.type === "marketplace"
                                      ? "text-pink-400"
                                      : "text-emerald-400"
                            } opacity-50 transition-all group-hover:scale-110 group-hover:opacity-75`}
                          />
                          <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-slate-900/80 px-2 py-1 text-xs backdrop-blur">
                            <Users className="h-3 w-3 text-slate-400" />
                            <span className="text-slate-300">
                              {zone.currentUsers}/{zone.capacity}
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="mb-2 flex items-start justify-between">
                            <h3 className="font-semibold text-white transition-colors group-hover:text-violet-300">
                              {zone.name}
                            </h3>
                            <span
                              className={`rounded-full px-2 py-0.5 font-medium text-[10px] ${
                                zone.type === "classroom"
                                  ? "bg-violet-500/20 text-violet-300"
                                  : zone.type === "social"
                                    ? "bg-cyan-500/20 text-cyan-300"
                                    : zone.type === "event"
                                      ? "bg-amber-500/20 text-amber-300"
                                      : zone.type === "marketplace"
                                        ? "bg-pink-500/20 text-pink-300"
                                        : "bg-emerald-500/20 text-emerald-300"
                              }`}
                            >
                              {zone.type}
                            </span>
                          </div>
                          <p className="mb-3 line-clamp-2 text-slate-400 text-sm">
                            {zone.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {zone.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "avatar" && (
                <motion.div
                  key="avatar"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-4 lg:col-span-1">
                      <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-6 backdrop-blur-sm">
                        <div className="relative mx-auto mb-4 h-48 w-48">
                          <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20" />
                          <div className="relative flex h-full w-full items-center justify-center rounded-full border-4 border-slate-700/50 bg-gradient-to-br from-slate-700 to-slate-800">
                            <Users className="h-24 w-24 text-slate-500" />
                          </div>
                          <div className="-bottom-2 -right-2 absolute flex h-12 w-12 items-center justify-center rounded-full border-4 border-slate-900 bg-gradient-to-br from-amber-400 to-orange-500">
                            <Crown className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <h3 className="mb-1 text-center font-bold text-white text-xl">
                          {avatar.name}
                        </h3>
                        <p className="mb-4 text-center text-slate-400 text-sm">
                          Level {avatar.level} Explorer
                        </p>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">XP Progress</span>
                            <span className="text-violet-400">
                              {avatar.xp}/{avatar.maxXp}
                            </span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${(avatar.xp / avatar.maxXp) * 100}%`,
                              }}
                              className="h-full bg-gradient-to-r from-violet-500 to-cyan-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-6 backdrop-blur-sm">
                        <h4 className="mb-4 flex items-center gap-2 font-semibold text-white">
                          <Trophy className="h-5 w-5 text-amber-400" />
                          Achievements
                        </h4>
                        <div className="space-y-2">
                          {achievements.map((achievement) => (
                            <div
                              key={achievement.id}
                              className={`flex items-center gap-3 rounded-lg p-3 ${
                                achievement.unlocked
                                  ? "bg-slate-800/50"
                                  : "bg-slate-800/30 opacity-50"
                              }`}
                            >
                              <div
                                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                                  achievement.unlocked
                                    ? "bg-amber-500/20"
                                    : "bg-slate-700"
                                }`}
                              >
                                <Sparkles
                                  className={`h-5 w-5 ${achievement.unlocked ? "text-amber-400" : "text-slate-500"}`}
                                />
                              </div>
                              <div className="flex-1">
                                <p
                                  className={`font-medium text-sm ${achievement.unlocked ? "text-white" : "text-slate-500"}`}
                                >
                                  {achievement.name}
                                </p>
                                <p className="text-slate-500 text-xs">
                                  {achievement.description}
                                </p>
                              </div>
                              {achievement.unlocked && (
                                <span className="text-amber-400 text-xs">
                                  ✓
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 lg:col-span-2">
                      <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-6 backdrop-blur-sm">
                        <h4 className="mb-4 flex items-center gap-2 font-semibold text-white">
                          <Palette className="h-5 w-5 text-violet-400" />
                          Customization
                        </h4>

                        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                          {[
                            {
                              label: "Skin Tone",
                              value: avatar.customization.skin,
                              icon: UserIcon,
                            },
                            {
                              label: "Hair Color",
                              value: avatar.customization.hair,
                              icon: UserIcon,
                            },
                            {
                              label: "Eye Color",
                              value: avatar.customization.eyes,
                              icon: Eye,
                            },
                            {
                              label: "Outfit",
                              value: avatar.customization.outfit,
                              icon: Shirt,
                            },
                          ].map((item) => (
                            <div
                              key={item.label}
                              className="rounded-xl bg-slate-800/50 p-4"
                            >
                              <div className="mb-2 flex items-center gap-2">
                                <item.icon className="h-4 w-4 text-slate-400" />
                                <span className="text-slate-400 text-xs">
                                  {item.label}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div
                                  className="h-8 w-8 rounded-lg border-2 border-slate-600"
                                  style={{
                                    backgroundColor: item.value.startsWith("#")
                                      ? item.value
                                      : undefined,
                                  }}
                                />
                                <span className="text-sm text-white capitalize">
                                  {item.value}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <h5 className="mb-3 font-medium text-slate-300 text-sm">
                          Accessories
                        </h5>
                        <div className="mb-6 flex flex-wrap gap-2">
                          {[
                            "Glasses",
                            "Hat",
                            "Backpack",
                            "Watch",
                            "Necklace",
                          ].map((acc) => (
                            <button
                              key={acc}
                              className={`rounded-lg px-4 py-2 font-medium text-sm transition-all ${
                                avatar.customization.accessories.includes(
                                  acc.toLowerCase(),
                                )
                                  ? "border border-violet-500/30 bg-violet-500/20 text-violet-300"
                                  : "border border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600"
                              }`}
                            >
                              {acc}
                            </button>
                          ))}
                        </div>

                        <h5 className="mb-3 font-medium text-slate-300 text-sm">
                          Emotes
                        </h5>
                        <div className="grid grid-cols-4 gap-3">
                          {[
                            { id: "wave", icon: HandIcon, label: "Wave" },
                            { id: "dance", icon: MusicIcon, label: "Dance" },
                            { id: "cheer", icon: Star, label: "Cheer" },
                            { id: "clap", icon: ClapIcon, label: "Clap" },
                          ].map((emote) => (
                            <button
                              key={emote.id}
                              className={`flex flex-col items-center gap-2 rounded-xl p-4 transition-all ${
                                avatar.customization.emotes.includes(emote.id)
                                  ? "border border-cyan-500/30 bg-cyan-500/20 text-cyan-300"
                                  : "border border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600"
                              }`}
                            >
                              <emote.icon className="h-6 w-6" />
                              <span className="text-xs">{emote.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-6 backdrop-blur-sm">
                        <h4 className="mb-4 flex items-center gap-2 font-semibold text-white">
                          <Box className="h-5 w-5 text-cyan-400" />
                          Inventory ({assets.filter((a) => a.equipped).length}{" "}
                          Equipped)
                        </h4>
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                          {assets.map((asset) => (
                            <div
                              key={asset.id}
                              className={`cursor-pointer rounded-xl border p-4 transition-all ${
                                asset.equipped
                                  ? "border-violet-500/30 bg-slate-800"
                                  : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
                              }`}
                            >
                              <div className="mb-2 flex items-start justify-between">
                                <span className="text-2xl">
                                  {asset.category === "wearable"
                                    ? "👕"
                                    : asset.category === "accessory"
                                      ? "🕶️"
                                      : asset.category === "emote"
                                        ? "🎭"
                                        : "🪑"}
                                </span>
                                {asset.isNFT && (
                                  <span className="rounded bg-purple-500/20 px-1.5 py-0.5 text-[10px] text-purple-300">
                                    NFT
                                  </span>
                                )}
                              </div>
                              <p className="mb-1 font-medium text-sm text-white">
                                {asset.name}
                              </p>
                              <p className="mb-2 text-slate-500 text-xs">
                                {asset.rarity}
                              </p>
                              {asset.equipped && (
                                <span className="text-violet-400 text-xs">
                                  Equipped
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "events" && (
                <motion.div
                  key="events"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-bold text-2xl text-white">
                        Virtual Events
                      </h2>
                      <p className="text-slate-400">
                        Join live classes, performances, and competitions
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1.5 rounded-full bg-red-500/20 px-3 py-1 text-red-300 text-sm">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                        {events.filter((e) => e.status === "live").length} Live
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {events.map((event, idx) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => joinEvent(event)}
                        className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-800/50 bg-slate-900/50 backdrop-blur-sm transition-all hover:border-slate-700"
                      >
                        <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(139,92,246,0.15),transparent)]" />
                          <Calendar className="h-16 w-16 text-slate-600 transition-all group-hover:scale-110 group-hover:text-violet-400" />
                          <div className="absolute top-4 left-4">
                            <span
                              className={`rounded-full px-3 py-1 font-medium text-xs ${
                                event.status === "live"
                                  ? "border border-red-500/30 bg-red-500/20 text-red-300"
                                  : event.status === "upcoming"
                                    ? "border border-amber-500/30 bg-amber-500/20 text-amber-300"
                                    : "bg-slate-500/20 text-slate-300"
                              }`}
                            >
                              {event.status === "live"
                                ? "🔴 LIVE"
                                : event.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="absolute top-4 right-4">
                            <span className="rounded bg-slate-900/80 px-2 py-1 text-slate-300 text-xs backdrop-blur">
                              {event.type}
                            </span>
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="mb-2 font-semibold text-lg text-white transition-colors group-hover:text-violet-300">
                            {event.title}
                          </h3>
                          <p className="mb-4 line-clamp-2 text-slate-400 text-sm">
                            {event.description}
                          </p>

                          <div className="mb-4 flex items-center gap-4 text-slate-500 text-sm">
                            <span className="flex items-center gap-1.5">
                              <Users className="h-4 w-4" />
                              {event.participants}/{event.maxParticipants}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MapPin className="h-4 w-4" />
                              {zones.find((z) => z.id === event.zoneId)?.name}
                            </span>
                          </div>

                          <div className="mb-4 flex items-center gap-2">
                            <span className="text-slate-500 text-xs">
                              Rewards:
                            </span>
                            {event.rewards.map((reward, i) => (
                              <span
                                key={i}
                                className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-300"
                              >
                                {reward}
                              </span>
                            ))}
                          </div>

                          <button className="w-full rounded-lg border border-violet-500/30 bg-violet-500/20 py-2.5 font-medium text-violet-300 transition-colors hover:bg-violet-500/30">
                            {event.status === "live"
                              ? "Join Now"
                              : "Set Reminder"}
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "marketplace" && (
                <motion.div
                  key="marketplace"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="flex items-center gap-2 font-bold text-2xl text-white">
                        <ShoppingBag className="h-6 w-6 text-pink-400" />
                        Asset Marketplace
                      </h2>
                      <p className="text-slate-400">
                        Trade virtual items, NFTs, and custom creations
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-800/50 px-4 py-2">
                        <span className="text-amber-400">🪙</span>
                        <span className="font-medium text-sm">2,450</span>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-800/50 px-4 py-2">
                        <span className="text-cyan-400">💎</span>
                        <span className="font-medium text-sm">120</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {[
                      "All",
                      "Wearables",
                      "Accessories",
                      "Emotes",
                      "Furniture",
                      "NFTs",
                    ].map((category, idx) => (
                      <button
                        key={category}
                        className={`whitespace-nowrap rounded-lg px-4 py-2 font-medium text-sm transition-all ${
                          idx === 0
                            ? "border border-pink-500/30 bg-pink-500/20 text-pink-300"
                            : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {assets.map((asset, idx) => (
                      <motion.div
                        key={asset.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => setSelectedAsset(asset)}
                        className={`group cursor-pointer overflow-hidden rounded-xl border border-slate-800/50 bg-slate-900/50 backdrop-blur-sm transition-all hover:border-slate-700 hover:shadow-lg ${rarityGlow[asset.rarity]}`}
                      >
                        <div
                          className={`relative h-32 bg-gradient-to-br ${rarityColors[asset.rarity]} opacity-20 transition-opacity group-hover:opacity-30`}
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-4xl">
                              {asset.category === "wearable"
                                ? "👕"
                                : asset.category === "accessory"
                                  ? "🕶️"
                                  : asset.category === "emote"
                                    ? "🎭"
                                    : "🪑"}
                            </span>
                          </div>
                          {asset.isNFT && (
                            <div className="absolute top-2 left-2">
                              <span className="flex items-center gap-1 rounded-full bg-purple-600 px-2 py-0.5 text-[10px] text-white">
                                <Hexagon className="h-3 w-3" />
                                NFT
                              </span>
                            </div>
                          )}
                          <div className="absolute top-2 right-2">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] ${
                                asset.rarity === "common"
                                  ? "bg-slate-600 text-slate-300"
                                  : asset.rarity === "rare"
                                    ? "bg-blue-600 text-blue-100"
                                    : asset.rarity === "epic"
                                      ? "bg-purple-600 text-purple-100"
                                      : "bg-amber-500 text-amber-900"
                              }`}
                            >
                              {asset.rarity}
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="mb-1 font-medium text-white transition-colors group-hover:text-pink-300">
                            {asset.name}
                          </h3>
                          <p className="mb-3 line-clamp-1 text-slate-500 text-xs">
                            {asset.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm text-white">
                              {asset.currency === "nft"
                                ? `${asset.price} ETH`
                                : `${asset.price} ${asset.currency === "coins" ? "🪙" : "💎"}`}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                purchaseAsset(asset);
                              }}
                              className="rounded-lg bg-pink-500/20 px-3 py-1.5 font-medium text-pink-300 text-xs transition-colors hover:bg-pink-500/30"
                            >
                              Buy
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "social" && (
                <motion.div
                  key="social"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="grid h-[calc(100vh-200px)] grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="flex flex-col rounded-2xl border border-slate-800/50 bg-slate-900/50 backdrop-blur-sm lg:col-span-2">
                      <div className="flex items-center justify-between border-slate-800/50 border-b p-4">
                        <div className="flex items-center gap-3">
                          <MessageSquare className="h-5 w-5 text-violet-400" />
                          <span className="font-medium text-white">
                            Campus Chat
                          </span>
                          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-slate-400 text-xs">
                            {zones.find((z) => z.id === "Z001")?.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setShowVoiceChat(!showVoiceChat)}
                            className={`rounded-lg p-2 transition-colors ${showVoiceChat ? "bg-cyan-500/20 text-cyan-300" : "text-slate-400 hover:bg-slate-800"}`}
                          >
                            <Mic className="h-4 w-4" />
                          </button>
                          <button className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800">
                            <Video className="h-4 w-4" />
                          </button>
                          <button className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800">
                            <Users className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex-1 space-y-3 overflow-y-auto p-4">
                        {chatMessages.length === 0 ? (
                          <div className="py-12 text-center">
                            <MessageSquare className="mx-auto mb-3 h-12 w-12 text-slate-600" />
                            <p className="text-slate-500">No messages yet</p>
                            <p className="text-slate-600 text-sm">
                              Start a conversation!
                            </p>
                          </div>
                        ) : (
                          chatMessages.map((msg) => (
                            <motion.div
                              key={msg.id}
                              initial={{
                                opacity: 0,
                                x: msg.userId === userId ? 20 : -20,
                              }}
                              animate={{ opacity: 1, x: 0 }}
                              className={`flex items-start gap-3 ${msg.userId === userId ? "flex-row-reverse" : ""}`}
                            >
                              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-500">
                                <span className="font-medium text-white text-xs">
                                  {msg.userName[0]}
                                </span>
                              </div>
                              <div
                                className={`max-w-[70%] ${msg.userId === userId ? "text-right" : ""}`}
                              >
                                <p className="mb-1 text-slate-500 text-xs">
                                  {msg.userName}
                                </p>
                                <div
                                  className={`inline-block rounded-2xl px-4 py-2 text-sm ${
                                    msg.userId === userId
                                      ? "border border-violet-500/30 bg-violet-500/20 text-violet-100"
                                      : "bg-slate-800 text-slate-200"
                                  }`}
                                >
                                  {msg.message}
                                </div>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>

                      <div className="border-slate-800/50 border-t p-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={chatInput}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => setChatInput(e.target.value)}
                            onKeyPress={(e) =>
                              e.key === "Enter" && handleSendMessage()
                            }
                            placeholder="Type a message..."
                            className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 focus:border-violet-500/50 focus:outline-none"
                          />
                          <button
                            onClick={handleSendMessage}
                            className="rounded-xl bg-violet-500 p-2.5 text-white transition-colors hover:bg-violet-600"
                          >
                            <Send className="h-5 w-5" />
                          </button>
                        </div>
                        {showVoiceChat && (
                          <div className="mt-3 flex items-center gap-3 rounded-lg border border-cyan-500/20 bg-cyan-500/10 p-3">
                            <Radio className="h-4 w-4 animate-pulse text-cyan-400" />
                            <span className="text-cyan-400 text-sm">
                              Voice chat active - 3 users speaking
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-4 backdrop-blur-sm">
                        <h4 className="mb-4 flex items-center gap-2 font-medium text-white">
                          <Users className="h-4 w-4 text-cyan-400" />
                          Friends Online
                        </h4>
                        <div className="space-y-2">
                          {friends.map((friend) => (
                            <div
                              key={friend.id}
                              className="flex cursor-pointer items-center gap-3 rounded-xl p-3 transition-colors hover:bg-slate-800/50"
                            >
                              <div className="relative">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-slate-600 to-slate-700">
                                  <span className="text-sm">
                                    {friend.name[0]}
                                  </span>
                                </div>
                                <span
                                  className={`-bottom-0.5 -right-0.5 absolute h-3 w-3 rounded-full border-2 border-slate-900 ${
                                    friend.status === "online"
                                      ? "bg-emerald-500"
                                      : friend.status === "in-world"
                                        ? "bg-violet-500"
                                        : "bg-slate-500"
                                  }`}
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate font-medium text-sm text-white">
                                  {friend.name}
                                </p>
                                <p className="text-slate-500 text-xs">
                                  {friend.status === "in-world"
                                    ? `In ${friend.currentZone}`
                                    : friend.status}
                                </p>
                              </div>
                              <span className="text-violet-400 text-xs">
                                Lv.{friend.level}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-4 backdrop-blur-sm">
                        <h4 className="mb-4 flex items-center gap-2 font-medium text-white">
                          <Share2 className="h-4 w-4 text-pink-400" />
                          Quick Actions
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          <button className="rounded-xl bg-slate-800/50 p-3 text-slate-300 text-sm transition-colors hover:bg-slate-800">
                            Invite Friend
                          </button>
                          <button className="rounded-xl bg-slate-800/50 p-3 text-slate-300 text-sm transition-colors hover:bg-slate-800">
                            Create Party
                          </button>
                          <button className="rounded-xl bg-slate-800/50 p-3 text-slate-300 text-sm transition-colors hover:bg-slate-800">
                            Share Location
                          </button>
                          <button className="rounded-xl bg-slate-800/50 p-3 text-slate-300 text-sm transition-colors hover:bg-slate-800">
                            Block User
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      <AnimatePresence>
        {selectedZone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setSelectedZone(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
            >
              <div
                className={`h-48 bg-gradient-to-br ${
                  selectedZone.type === "classroom"
                    ? "from-violet-600/30 to-violet-900/30"
                    : selectedZone.type === "social"
                      ? "from-cyan-600/30 to-cyan-900/30"
                      : selectedZone.type === "event"
                        ? "from-amber-600/30 to-amber-900/30"
                        : selectedZone.type === "marketplace"
                          ? "from-pink-600/30 to-pink-900/30"
                          : "from-emerald-600/30 to-emerald-900/30"
                } relative flex items-center justify-center`}
              >
                <Box
                  className={`h-24 w-24 ${
                    selectedZone.type === "classroom"
                      ? "text-violet-400"
                      : selectedZone.type === "social"
                        ? "text-cyan-400"
                        : selectedZone.type === "event"
                          ? "text-amber-400"
                          : selectedZone.type === "marketplace"
                            ? "text-pink-400"
                            : "text-emerald-400"
                  } opacity-50`}
                />
                <button
                  onClick={() => setSelectedZone(null)}
                  className="absolute top-4 right-4 rounded-full bg-slate-900/50 p-2 text-slate-400 backdrop-blur transition-colors hover:text-white"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="mb-1 font-bold text-2xl text-white">
                      {selectedZone.name}
                    </h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        selectedZone.type === "classroom"
                          ? "bg-violet-500/20 text-violet-300"
                          : selectedZone.type === "social"
                            ? "bg-cyan-500/20 text-cyan-300"
                            : selectedZone.type === "event"
                              ? "bg-amber-500/20 text-amber-300"
                              : selectedZone.type === "marketplace"
                                ? "bg-pink-500/20 text-pink-300"
                                : "bg-emerald-500/20 text-emerald-300"
                      }`}
                    >
                      {selectedZone.type}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-2xl text-white">
                      {selectedZone.currentUsers}
                    </p>
                    <p className="text-slate-500 text-sm">
                      / {selectedZone.capacity} users
                    </p>
                  </div>
                </div>
                <p className="mb-6 text-slate-400">
                  {selectedZone.description}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedZone(null);
                    }}
                    className="flex-1 rounded-xl bg-violet-500 py-3 font-medium text-white transition-colors hover:bg-violet-600"
                  >
                    Enter Zone
                  </button>
                  <button
                    onClick={() => setSelectedZone(null)}
                    className="rounded-xl border border-slate-700 px-6 py-3 text-slate-400 transition-colors hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
            >
              <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-violet-600/20 to-cyan-600/20">
                <Calendar className="h-24 w-24 text-violet-400 opacity-50" />
                <div className="absolute top-4 left-4">
                  <span
                    className={`rounded-full px-3 py-1 font-medium text-xs ${
                      selectedEvent.status === "live"
                        ? "bg-red-500/20 text-red-300"
                        : "bg-amber-500/20 text-amber-300"
                    }`}
                  >
                    {selectedEvent.status === "live" ? "🔴 LIVE" : "UPCOMING"}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 rounded-full bg-slate-900/50 p-2 text-slate-400 backdrop-blur transition-colors hover:text-white"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6">
                <h3 className="mb-2 font-bold text-2xl text-white">
                  {selectedEvent.title}
                </h3>
                <p className="mb-4 text-slate-400">
                  {selectedEvent.description}
                </p>
                <div className="mb-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Users className="h-4 w-4 text-slate-500" />
                    <span className="text-slate-300">
                      {selectedEvent.participants}/
                      {selectedEvent.maxParticipants} participants
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    <span className="text-slate-300">
                      {zones.find((z) => z.id === selectedEvent.zoneId)?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Sparkles className="h-4 w-4 text-amber-400" />
                    <span className="text-slate-300">
                      Rewards: {selectedEvent.rewards.join(", ")}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedEvent(null);
                    }}
                    className="flex-1 rounded-xl bg-violet-500 py-3 font-medium text-white transition-colors hover:bg-violet-600"
                  >
                    {selectedEvent.status === "live"
                      ? "Join Event"
                      : "Set Reminder"}
                  </button>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="rounded-xl border border-slate-700 px-6 py-3 text-slate-400 transition-colors hover:bg-slate-800"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {selectedAsset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setSelectedAsset(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
            >
              <div
                className={`relative h-56 bg-gradient-to-br ${rarityColors[selectedAsset.rarity]} opacity-30`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl">
                    {selectedAsset.category === "wearable"
                      ? "👕"
                      : selectedAsset.category === "accessory"
                        ? "🕶️"
                        : selectedAsset.category === "emote"
                          ? "🎭"
                          : "🪑"}
                  </span>
                </div>
                {selectedAsset.isNFT && (
                  <div className="absolute top-4 left-4">
                    <span className="flex items-center gap-1 rounded-full bg-purple-600 px-3 py-1 text-white text-xs">
                      <Hexagon className="h-4 w-4" />
                      NFT on {selectedAsset.blockchain}
                    </span>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      selectedAsset.rarity === "common"
                        ? "bg-slate-600 text-slate-300"
                        : selectedAsset.rarity === "rare"
                          ? "bg-blue-600 text-blue-100"
                          : selectedAsset.rarity === "epic"
                            ? "bg-purple-600 text-purple-100"
                            : "bg-amber-500 text-amber-900"
                    }`}
                  >
                    {selectedAsset.rarity.toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="absolute right-4 bottom-4 rounded-full bg-slate-900/50 p-2 text-slate-400 backdrop-blur transition-colors hover:text-white"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6">
                <h3 className="mb-2 font-bold text-2xl text-white">
                  {selectedAsset.name}
                </h3>
                <p className="mb-4 text-slate-400">
                  {selectedAsset.description}
                </p>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm">Price</p>
                    <p className="font-bold text-white text-xl">
                      {selectedAsset.currency === "nft"
                        ? `${selectedAsset.price} ETH`
                        : `${selectedAsset.price} ${selectedAsset.currency === "coins" ? "🪙" : "💎"}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-500 text-sm">Category</p>
                    <p className="font-medium text-lg text-white capitalize">
                      {selectedAsset.category}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      purchaseAsset(selectedAsset);
                      setSelectedAsset(null);
                    }}
                    className="flex-1 rounded-xl bg-pink-500 py-3 font-medium text-white transition-colors hover:bg-pink-600"
                  >
                    Purchase Now
                  </button>
                  <button
                    onClick={() => setSelectedAsset(null)}
                    className="rounded-xl border border-slate-700 px-6 py-3 text-slate-400 transition-colors hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function HandIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
      <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
      <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  );
}

function MusicIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

function ClapIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 11V8a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v3" />
      <path d="M11 14V5a1 1 0 0 0-1-1H8a2 2 0 0 0-2 2v4" />
      <path d="M11 22V9a1 1 0 0 0-1-1H8a2 2 0 0 0-2 2v5" />
      <path d="M17 14V3a1 1 0 0 0-1-1h-3a2 2 0 0 0-2 2v7" />
      <path d="M17 22V9a1 1 0 0 0-1-1h-3a2 2 0 0 0-2 2v8" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
