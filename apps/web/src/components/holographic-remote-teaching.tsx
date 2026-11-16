"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Atom,
  Box,
  Box as BoxIcon,
  Cast,
  Cpu,
  Eraser,
  Eye,
  Focus,
  Glasses,
  Hand,
  LayoutGrid,
  Maximize2,
  MessageSquare,
  MicOff,
  Minimize2,
  Minus,
  Monitor,
  MoreHorizontal,
  MousePointer2,
  PenTool,
  Plus,
  Presentation,
  Radio,
  RotateCcw,
  Scan,
  ScanEye,
  Settings,
  Sparkles,
  Target,
  Users,
  VideoOff,
  Volume2,
  VolumeX,
  Wifi,
  X,
} from "lucide-react";
import React, { useState, useRef, useCallback } from "react";

interface HologramUser {
  id: string;
  name: string;
  role: "teacher" | "student";
  avatar: string;
  position: { x: number; y: number; z: number };
  isSpeaking: boolean;
  isMuted: boolean;
  videoEnabled: boolean;
  handRaised: boolean;
  eyeContactScore: number;
  engagementLevel: number;
  attentionDirection: { x: number; y: number };
  audioZone: string;
  lastActivity: string;
}

interface HolographicObject {
  id: string;
  type: "whiteboard" | "presentation" | "model" | "screen" | "annotation";
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: number;
  content?: string;
  isActive: boolean;
  color: string;
}

interface AudioZone {
  id: string;
  name: string;
  position: { x: number; y: number; z: number };
  radius: number;
  volume: number;
  isSpatial: boolean;
  users: string[];
  color: string;
}

interface Gesture {
  id: string;
  name: string;
  icon: React.ReactNode;
  action: string;
  isActive: boolean;
}

interface EngagementMetrics {
  totalParticipants: number;
  averageEyeContact: number;
  averageEngagement: number;
  attentionDistribution: {
    front: number;
    left: number;
    right: number;
    back: number;
  };
  speakingTime: Record<string, number>;
  interactionsPerMinute: number;
}

const MOCK_USERS: HologramUser[] = [
  {
    id: "1",
    name: "Dr. Sarah Chen",
    role: "teacher",
    avatar: "SC",
    position: { x: 0, y: 0, z: -2 },
    isSpeaking: true,
    isMuted: false,
    videoEnabled: true,
    handRaised: false,
    eyeContactScore: 94,
    engagementLevel: 98,
    attentionDirection: { x: 0, y: 0 },
    audioZone: "main",
    lastActivity: "Presenting holographic model",
  },
  {
    id: "2",
    name: "Alex Rivera",
    role: "student",
    avatar: "AR",
    position: { x: -2.5, y: 0.5, z: 1 },
    isSpeaking: false,
    isMuted: false,
    videoEnabled: true,
    handRaised: false,
    eyeContactScore: 87,
    engagementLevel: 92,
    attentionDirection: { x: 0.2, y: -0.1 },
    audioZone: "left-front",
    lastActivity: "Viewing molecular structure",
  },
  {
    id: "3",
    name: "Maya Johnson",
    role: "student",
    avatar: "MJ",
    position: { x: 2.5, y: 0.5, z: 1 },
    isSpeaking: false,
    isMuted: true,
    videoEnabled: true,
    handRaised: true,
    eyeContactScore: 91,
    engagementLevel: 95,
    attentionDirection: { x: -0.3, y: 0.1 },
    audioZone: "right-front",
    lastActivity: "Annotating whiteboard",
  },
  {
    id: "4",
    name: "James Park",
    role: "student",
    avatar: "JP",
    position: { x: -1.5, y: 0.3, z: 3 },
    isSpeaking: false,
    isMuted: false,
    videoEnabled: true,
    handRaised: false,
    eyeContactScore: 78,
    engagementLevel: 85,
    attentionDirection: { x: 0.1, y: 0 },
    audioZone: "back-left",
    lastActivity: "Listening to lecture",
  },
  {
    id: "5",
    name: "Emma Wilson",
    role: "student",
    avatar: "EW",
    position: { x: 1.5, y: 0.3, z: 3 },
    isSpeaking: false,
    isMuted: false,
    videoEnabled: false,
    handRaised: false,
    eyeContactScore: 82,
    engagementLevel: 88,
    attentionDirection: { x: -0.2, y: 0.2 },
    audioZone: "back-right",
    lastActivity: "Camera disabled",
  },
  {
    id: "6",
    name: "Lucas Martinez",
    role: "student",
    avatar: "LM",
    position: { x: 0, y: 0.2, z: 2.5 },
    isSpeaking: false,
    isMuted: false,
    videoEnabled: true,
    handRaised: false,
    eyeContactScore: 89,
    engagementLevel: 90,
    attentionDirection: { x: 0, y: -0.1 },
    audioZone: "center",
    lastActivity: "Taking notes",
  },
];

const MOCK_HOLOGRAPHIC_OBJECTS: HolographicObject[] = [
  {
    id: "1",
    type: "whiteboard",
    position: { x: 0, y: 1.5, z: -1 },
    rotation: { x: -15, y: 0, z: 0 },
    scale: 1,
    content: "Quantum Physics: Wave-Particle Duality",
    isActive: true,
    color: "#00ffff",
  },
  {
    id: "2",
    type: "model",
    position: { x: 0, y: 0, z: -0.5 },
    rotation: { x: 0, y: 45, z: 0 },
    scale: 0.8,
    isActive: true,
    color: "#ff6b6b",
  },
  {
    id: "3",
    type: "presentation",
    position: { x: -3, y: 1.2, z: 0 },
    rotation: { x: 0, y: 30, z: 0 },
    scale: 0.6,
    content: "Slide 7: Electron Microscopy",
    isActive: false,
    color: "#4ecdc4",
  },
  {
    id: "4",
    type: "screen",
    position: { x: 3, y: 1.2, z: 0 },
    rotation: { x: 0, y: -30, z: 0 },
    scale: 0.6,
    content: "Live Experiment Feed",
    isActive: true,
    color: "#45b7d1",
  },
  {
    id: "5",
    type: "annotation",
    position: { x: 1, y: 2, z: 0.5 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 0.4,
    content: "Key Formula: E = hf",
    isActive: true,
    color: "#ffd93d",
  },
];

const MOCK_AUDIO_ZONES: AudioZone[] = [
  {
    id: "main",
    name: "Main Stage",
    position: { x: 0, y: 0, z: -2 },
    radius: 2,
    volume: 100,
    isSpatial: false,
    users: ["1"],
    color: "#00ffff",
  },
  {
    id: "left-front",
    name: "Left Front",
    position: { x: -2.5, y: 0.5, z: 1 },
    radius: 1.2,
    volume: 85,
    isSpatial: true,
    users: ["2"],
    color: "#ff6b6b",
  },
  {
    id: "right-front",
    name: "Right Front",
    position: { x: 2.5, y: 0.5, z: 1 },
    radius: 1.2,
    volume: 85,
    isSpatial: true,
    users: ["3"],
    color: "#4ecdc4",
  },
  {
    id: "back-left",
    name: "Back Left",
    position: { x: -1.5, y: 0.3, z: 3 },
    radius: 1,
    volume: 70,
    isSpatial: true,
    users: ["4"],
    color: "#45b7d1",
  },
  {
    id: "back-right",
    name: "Back Right",
    position: { x: 1.5, y: 0.3, z: 3 },
    radius: 1,
    volume: 70,
    isSpatial: true,
    users: ["5"],
    color: "#ffd93d",
  },
  {
    id: "center",
    name: "Center",
    position: { x: 0, y: 0.2, z: 2.5 },
    radius: 1,
    volume: 80,
    isSpatial: true,
    users: ["6"],
    color: "#a78bfa",
  },
];

const MOCK_GESTURES: Gesture[] = [
  {
    id: "1",
    name: "Raise Hand",
    icon: <Hand className="h-5 w-5" />,
    action: "raise_hand",
    isActive: false,
  },
  {
    id: "2",
    name: "Point",
    icon: <MousePointer2 className="h-5 w-5" />,
    action: "point",
    isActive: true,
  },
  {
    id: "3",
    name: "Grab",
    icon: <Target className="h-5 w-5" />,
    action: "grab",
    isActive: false,
  },
  {
    id: "4",
    name: "Rotate",
    icon: <RotateCcw className="h-5 w-5" />,
    action: "rotate",
    isActive: false,
  },
  {
    id: "5",
    name: "Scale",
    icon: <Maximize2 className="h-5 w-5" />,
    action: "scale",
    isActive: false,
  },
  {
    id: "6",
    name: "Annotate",
    icon: <PenTool className="h-5 w-5" />,
    action: "annotate",
    isActive: false,
  },
];

const MOCK_ENGAGEMENT: EngagementMetrics = {
  totalParticipants: 6,
  averageEyeContact: 87,
  averageEngagement: 91,
  attentionDistribution: { front: 45, left: 20, right: 20, back: 15 },
  speakingTime: { "1": 65, "2": 8, "3": 12, "4": 5, "5": 5, "6": 5 },
  interactionsPerMinute: 4.2,
};

const THEMES = {
  cyber: {
    name: "Cyber Grid",
    colors: ["#00ffff", "#ff00ff", "#ffff00"],
    bg: "from-slate-950 via-cyan-950/30 to-slate-950",
    accent: "#00ffff",
  },
  neon: {
    name: "Neon Horizon",
    colors: ["#ff6b6b", "#4ecdc4", "#45b7d1"],
    bg: "from-gray-950 via-rose-950/30 to-gray-950",
    accent: "#ff6b6b",
  },
  aurora: {
    name: "Aurora Flow",
    colors: ["#a78bfa", "#3b82f6", "#10b981"],
    bg: "from-slate-950 via-violet-950/30 to-slate-950",
    accent: "#a78bfa",
  },
};

const HolographicGrid: React.FC<{ theme: keyof typeof THEMES }> = ({
  theme,
}) => {
  const colors = THEMES[theme].colors;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg className="absolute inset-0 h-full w-full opacity-20">
        <defs>
          <pattern
            id="grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke={colors[0]}
              strokeWidth="0.5"
            />
          </pattern>
          <linearGradient id="gridFade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors[0]} stopOpacity="0.1" />
            <stop offset="50%" stopColor={colors[1]} stopOpacity="0.05" />
            <stop offset="100%" stopColor={colors[0]} stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${colors[0]}10 0%, transparent 60%)`,
        }}
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${colors[1]}08 50%, transparent 100%)`,
        }}
      />
    </div>
  );
};

const HolographicUser: React.FC<{
  user: HologramUser;
  isSelected: boolean;
  onClick: () => void;
  theme: keyof typeof THEMES;
}> = ({ user, isSelected, onClick, theme }) => {
  const colors = THEMES[theme].colors;
  const isTeacher = user.role === "teacher";
  const color = isTeacher ? colors[0] : colors[1];

  return (
    <motion.div
      className={`absolute cursor-pointer ${isSelected ? "z-50" : "z-10"}`}
      style={{
        left: `${50 + user.position.x * 15}%`,
        top: `${40 + user.position.z * 10}%`,
        transform: `translate(-50%, -50%)`,
      }}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      animate={user.isSpeaking ? { y: [0, -5, 0] } : {}}
      transition={{ duration: 0.5, repeat: user.isSpeaking ? Infinity : 0 }}
    >
      <div className="relative">
        <motion.div
          className={`h-28 w-20 rounded-lg border-2 backdrop-blur-sm transition-all duration-300 ${
            isSelected ? "scale-110" : ""
          }`}
          style={{
            background: `linear-gradient(135deg, ${color}20 0%, ${color}05 100%)`,
            borderColor: isSelected ? color : `${color}60`,
            boxShadow: user.isSpeaking
              ? `0 0 30px ${color}50, inset 0 0 20px ${color}20`
              : `0 0 15px ${color}30`,
          }}
        >
          <div className="flex h-full flex-col items-center p-3">
            <motion.div
              className={`mb-2 flex h-12 w-12 items-center justify-center rounded-full font-bold text-sm text-white`}
              style={{
                background: `linear-gradient(135deg, ${color} 0%, ${color}80 100%)`,
                boxShadow: `0 0 20px ${color}50`,
              }}
              animate={user.isSpeaking ? { scale: [1, 1.1, 1] } : {}}
              transition={{
                duration: 0.8,
                repeat: user.isSpeaking ? Infinity : 0,
              }}
            >
              {user.videoEnabled ? user.avatar : <Eye className="h-5 w-5" />}
            </motion.div>

            <div className="text-center">
              <p className="max-w-[70px] truncate font-medium text-white text-xs">
                {user.name}
              </p>
              <p className="text-[10px] text-white/60 uppercase tracking-wider">
                {user.role}
              </p>
            </div>

            <div className="mt-2 flex gap-1">
              {user.isMuted && <MicOff className="h-3 w-3 text-red-400" />}
              {!user.videoEnabled && (
                <VideoOff className="h-3 w-3 text-yellow-400" />
              )}
              {user.handRaised && <Hand className="h-3 w-3 text-green-400" />}
            </div>
          </div>

          {isTeacher && (
            <motion.div
              className="-top-2 -right-2 absolute flex h-4 w-4 items-center justify-center rounded-full"
              style={{ background: colors[2] }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="h-2.5 w-2.5 text-black" />
            </motion.div>
          )}
        </motion.div>

        <motion.div
          className="-bottom-8 -translate-x-1/2 absolute left-1/2 whitespace-nowrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div
            className="rounded-full px-3 py-1 font-medium text-[10px]"
            style={{
              background: `${color}30`,
              color: color,
              border: `1px solid ${color}50`,
            }}
          >
            {user.lastActivity}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const HolographicObject3D: React.FC<{
  obj: HolographicObject;
  isSelected: boolean;
  onClick: () => void;
  theme: keyof typeof THEMES;
}> = ({ obj, isSelected, onClick, theme }) => {
  const colors = THEMES[theme].colors;

  const getObjectIcon = () => {
    switch (obj.type) {
      case "whiteboard":
        return <LayoutGrid className="h-6 w-6" />;
      case "presentation":
        return <Presentation className="h-6 w-6" />;
      case "model":
        return <BoxIcon className="h-6 w-6" />;
      case "screen":
        return <Monitor className="h-6 w-6" />;
      case "annotation":
        return <PenTool className="h-6 w-6" />;
      default:
        return <Box className="h-6 w-6" />;
    }
  };

  return (
    <motion.div
      className={`absolute cursor-pointer ${isSelected ? "z-40" : "z-5"}`}
      style={{
        left: `${50 + obj.position.x * 12}%`,
        top: `${35 + obj.position.z * 8}%`,
        transform: `translate(-50%, -50%) perspective(1000px) rotateX(${obj.rotation.x}deg) rotateY(${obj.rotation.y}deg)`,
      }}
      onClick={onClick}
      whileHover={{ scale: 1.05, rotateY: obj.rotation.y + 10 }}
      animate={{ rotateY: [obj.rotation.y, obj.rotation.y + 360] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >
      <div
        className={`relative rounded-xl border p-4 backdrop-blur-md transition-all duration-300 ${
          isSelected ? "scale-110" : ""
        } ${obj.isActive ? "" : "opacity-50"}`}
        style={{
          background: `linear-gradient(135deg, ${obj.color}25 0%, ${obj.color}05 100%)`,
          borderColor: obj.isActive ? obj.color : `${obj.color}40`,
          boxShadow: obj.isActive
            ? `0 0 40px ${obj.color}40, 0 20px 40px rgba(0,0,0,0.3)`
            : `0 10px 30px rgba(0,0,0,0.2)`,
          width:
            obj.type === "whiteboard"
              ? "280px"
              : obj.type === "model"
                ? "200px"
                : "180px",
          minHeight: obj.type === "whiteboard" ? "160px" : "120px",
        }}
      >
        <div className="mb-3 flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: `${obj.color}40` }}
          >
            {getObjectIcon()}
          </div>
          <span className="font-medium text-sm text-white capitalize">
            {obj.type}
          </span>
          {obj.isActive && (
            <motion.div
              className="h-2 w-2 rounded-full"
              style={{ background: obj.color }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </div>

        {obj.content && (
          <div className="text-sm text-white/90 leading-relaxed">
            {obj.content}
          </div>
        )}

        {obj.type === "model" && (
          <div className="mt-3 flex justify-center">
            <motion.div
              className="relative h-24 w-24"
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <div
                className="absolute inset-0 rounded-lg"
                style={{
                  background: `linear-gradient(135deg, ${colors[0]}40 0%, ${colors[1]}40 50%, ${colors[2]}40 100%)`,
                  transform: "rotateX(60deg) rotateZ(45deg)",
                  boxShadow: `0 0 30px ${colors[0]}30`,
                }}
              />
              <Atom className="absolute inset-0 m-auto h-12 w-12 text-white/80" />
            </motion.div>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
          <motion.div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${obj.color}20 50%, transparent 100%)`,
            }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

const AudioZoneVisualizer: React.FC<{
  zone: AudioZone;
  isVisible: boolean;
  theme: keyof typeof THEMES;
}> = ({ zone, isVisible, theme }) => {
  if (!isVisible) return null;

  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{
        left: `${50 + zone.position.x * 15}%`,
        top: `${40 + zone.position.z * 10}%`,
        transform: `translate(-50%, -50%)`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
    >
      <motion.div
        className="rounded-full border-2"
        style={{
          width: zone.radius * 60,
          height: zone.radius * 60,
          borderColor: zone.color,
          background: `radial-gradient(circle, ${zone.color}10 0%, transparent 70%)`,
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute h-3 w-1 rounded-full"
            style={{
              background: zone.color,
              transform: `rotate(${i * 45}deg) translateY(${zone.radius * 25}px)`,
              opacity: 0.6,
            }}
          />
        ))}
      </motion.div>

      <div
        className="-top-8 -translate-x-1/2 absolute left-1/2 whitespace-nowrap rounded px-2 py-1 font-medium text-[10px]"
        style={{ background: zone.color, color: "#000" }}
      >
        {zone.name} • {zone.volume}%
      </div>
    </motion.div>
  );
};

const EngagementPanel: React.FC<{
  metrics: EngagementMetrics;
  users: HologramUser[];
  isOpen: boolean;
  onClose: () => void;
  theme: keyof typeof THEMES;
}> = ({ metrics, users, isOpen, onClose, theme }) => {
  const colors = THEMES[theme].colors;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed top-20 right-4 z-50 w-80"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
        >
          <div
            className="rounded-2xl border p-6 backdrop-blur-xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(20,20,30,0.9) 100%)",
              borderColor: colors[0],
              boxShadow: `0 0 40px ${colors[0]}30`,
            }}
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ScanEye className="h-5 w-5" style={{ color: colors[0] }} />
                <span className="font-semibold text-white">
                  Engagement Analytics
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4">
              <div
                className="rounded-xl border p-4"
                style={{
                  background: `${colors[0]}15`,
                  borderColor: `${colors[0]}40`,
                }}
              >
                <p className="mb-1 text-white/60 text-xs">Avg Eye Contact</p>
                <p className="font-bold text-2xl text-white">
                  {metrics.averageEyeContact}%
                </p>
                <div className="mt-2 flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-1.5 flex-1 rounded-full"
                      style={{
                        background:
                          i < Math.round(metrics.averageEyeContact / 20)
                            ? colors[0]
                            : "rgba(255,255,255,0.2)",
                      }}
                    />
                  ))}
                </div>
              </div>

              <div
                className="rounded-xl border p-4"
                style={{
                  background: `${colors[1]}15`,
                  borderColor: `${colors[1]}40`,
                }}
              >
                <p className="mb-1 text-white/60 text-xs">Engagement</p>
                <p className="font-bold text-2xl text-white">
                  {metrics.averageEngagement}%
                </p>
                <div className="mt-2 flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-1.5 flex-1 rounded-full"
                      style={{
                        background:
                          i < Math.round(metrics.averageEngagement / 20)
                            ? colors[1]
                            : "rgba(255,255,255,0.2)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <p className="mb-3 text-white/60 text-xs">
                Attention Distribution
              </p>
              <div
                className="relative h-24 overflow-hidden rounded-xl"
                style={{ background: `${colors[0]}10` }}
              >
                <div className="absolute inset-0 flex">
                  <div
                    className="flex flex-col items-center justify-end pb-2"
                    style={{
                      width: `${metrics.attentionDistribution.front}%`,
                      background: `${colors[0]}40`,
                    }}
                  >
                    <span className="font-medium text-white text-xs">
                      {metrics.attentionDistribution.front}%
                    </span>
                    <span className="text-[10px] text-white/60">Front</span>
                  </div>
                  <div
                    className="flex flex-col items-center justify-end pb-2"
                    style={{
                      width: `${metrics.attentionDistribution.left}%`,
                      background: `${colors[1]}40`,
                    }}
                  >
                    <span className="font-medium text-white text-xs">
                      {metrics.attentionDistribution.left}%
                    </span>
                    <span className="text-[10px] text-white/60">Left</span>
                  </div>
                  <div
                    className="flex flex-col items-center justify-end pb-2"
                    style={{
                      width: `${metrics.attentionDistribution.right}%`,
                      background: `${colors[2]}40`,
                    }}
                  >
                    <span className="font-medium text-white text-xs">
                      {metrics.attentionDistribution.right}%
                    </span>
                    <span className="text-[10px] text-white/60">Right</span>
                  </div>
                  <div
                    className="flex flex-col items-center justify-end pb-2"
                    style={{
                      width: `${metrics.attentionDistribution.back}%`,
                      background: `rgba(255,255,255,0.1)`,
                    }}
                  >
                    <span className="font-medium text-white text-xs">
                      {metrics.attentionDistribution.back}%
                    </span>
                    <span className="text-[10px] text-white/60">Back</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <p className="mb-3 text-white/60 text-xs">
                Participant Engagement
              </p>
              <div className="max-h-48 space-y-2 overflow-y-auto">
                {users
                  .filter((u) => u.role === "student")
                  .map((user, idx) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 rounded-lg p-2"
                      style={{
                        background:
                          idx % 2 === 0 ? `${colors[0]}08` : "transparent",
                      }}
                    >
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full font-bold text-white text-xs"
                        style={{ background: colors[idx % colors.length] }}
                      >
                        {user.avatar}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-white">
                          {user.name}
                        </p>
                        <div className="mt-0.5 flex items-center gap-2">
                          <Eye className="h-3 w-3 text-white/40" />
                          <span className="text-white/60 text-xs">
                            {user.eyeContactScore}%
                          </span>
                          <Activity className="ml-1 h-3 w-3 text-white/40" />
                          <span className="text-white/60 text-xs">
                            {user.engagementLevel}%
                          </span>
                        </div>
                      </div>
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{
                          background:
                            user.engagementLevel > 90
                              ? "#22c55e"
                              : user.engagementLevel > 75
                                ? "#eab308"
                                : "#ef4444",
                        }}
                      />
                    </div>
                  ))}
              </div>
            </div>

            <div className="border-white/10 border-t pt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60">Interactions/min</span>
                <span className="font-medium text-white">
                  {metrics.interactionsPerMinute}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const GesturePanel: React.FC<{
  gestures: Gesture[];
  activeGesture: string | null;
  onGestureSelect: (id: string) => void;
  theme: keyof typeof THEMES;
}> = ({ gestures, activeGesture, onGestureSelect, theme }) => {
  const colors = THEMES[theme].colors;

  return (
    <div className="flex items-center gap-2">
      {gestures.map((gesture, idx) => (
        <motion.button
          key={gesture.id}
          onClick={() => onGestureSelect(gesture.id)}
          className={`rounded-xl border p-3 transition-all ${
            activeGesture === gesture.id ? "scale-110" : "hover:scale-105"
          }`}
          style={{
            background:
              activeGesture === gesture.id
                ? `${colors[idx % colors.length]}30`
                : "rgba(255,255,255,0.05)",
            borderColor:
              activeGesture === gesture.id
                ? colors[idx % colors.length]
                : "rgba(255,255,255,0.1)",
            color:
              activeGesture === gesture.id
                ? colors[idx % colors.length]
                : "rgba(255,255,255,0.6)",
          }}
          whileTap={{ scale: 0.95 }}
          title={gesture.name}
        >
          {gesture.icon}
        </motion.button>
      ))}
    </div>
  );
};

export const HolographicRemoteTeaching: React.FC = () => {
  const [currentTheme, setCurrentTheme] =
    useState<keyof typeof THEMES>("cyber");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [showAudioZones, setShowAudioZones] = useState(false);
  const [showEngagementPanel, setShowEngagementPanel] = useState(true);
  const [activeGesture, setActiveGesture] = useState<string | null>("2");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cameraZoom, setCameraZoom] = useState(1);
  const [hologramOpacity, setHologramOpacity] = useState(0.9);
  const [spatialAudioEnabled, setSpatialAudioEnabled] = useState(true);
  const [gestureRecognitionEnabled, setGestureRecognitionEnabled] =
    useState(true);
  const [eyeTrackingEnabled, setEyeTrackingEnabled] = useState(true);
  const [activeTool, setActiveTool] = useState<
    "pointer" | "pen" | "eraser" | "hand"
  >("pointer");
  const containerRef = useRef<HTMLDivElement>(null);

  const colors = THEMES[currentTheme].colors;

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const getSpeakingUsers = () => MOCK_USERS.filter((u) => u.isSpeaking);
  const getHandRaisedUsers = () => MOCK_USERS.filter((u) => u.handRaised);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-gradient-to-br ${THEMES[currentTheme].bg}`}
      style={{ height: isFullscreen ? "100vh" : "calc(100vh - 40px)" }}
    >
      <HolographicGrid theme={currentTheme} />

      <div className="absolute inset-0" style={{ opacity: hologramOpacity }}>
        {MOCK_AUDIO_ZONES.map((zone) => (
          <AudioZoneVisualizer
            key={zone.id}
            zone={zone}
            isVisible={showAudioZones}
            theme={currentTheme}
          />
        ))}

        {MOCK_HOLOGRAPHIC_OBJECTS.map((obj) => (
          <HolographicObject3D
            key={obj.id}
            obj={obj}
            isSelected={selectedObject === obj.id}
            onClick={() =>
              setSelectedObject(selectedObject === obj.id ? null : obj.id)
            }
            theme={currentTheme}
          />
        ))}

        {MOCK_USERS.map((user) => (
          <HolographicUser
            key={user.id}
            user={user}
            isSelected={selectedUser === user.id}
            onClick={() =>
              setSelectedUser(selectedUser === user.id ? null : user.id)
            }
            theme={currentTheme}
          />
        ))}
      </div>

      <motion.div
        className="absolute top-4 left-4 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div
          className="flex items-center gap-4 rounded-2xl border px-6 py-3 backdrop-blur-xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(20,20,30,0.8) 100%)",
            borderColor: `${colors[0]}50`,
            boxShadow: `0 0 30px ${colors[0]}20`,
          }}
        >
          <div className="flex items-center gap-2">
            <Glasses className="h-6 w-6" style={{ color: colors[0] }} />
            <span className="font-bold text-lg text-white tracking-wide">
              HoloClass
            </span>
          </div>
          <div className="h-6 w-px bg-white/20" />
          <div className="flex items-center gap-2 text-sm text-white/60">
            <Wifi className="h-4 w-4" style={{ color: colors[1] }} />
            <span>5ms latency</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/60">
            <Cpu className="h-4 w-4" style={{ color: colors[2] }} />
            <span>8K Holographic</span>
          </div>
          <div className="h-6 w-px bg-white/20" />
          <div className="flex items-center gap-1">
            {(Object.keys(THEMES) as Array<keyof typeof THEMES>).map(
              (theme) => (
                <button
                  key={theme}
                  onClick={() => setCurrentTheme(theme)}
                  className={`rounded-lg px-3 py-1 font-medium text-xs transition-all ${
                    currentTheme === theme
                      ? "text-black"
                      : "text-white/60 hover:text-white"
                  }`}
                  style={{
                    background:
                      currentTheme === theme
                        ? THEMES[theme].accent
                        : "rgba(255,255,255,0.1)",
                  }}
                >
                  {THEMES[theme].name}
                </button>
              ),
            )}
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute top-4 right-4 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div
          className="flex items-center gap-3 rounded-xl border px-4 py-2 backdrop-blur-xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(20,20,30,0.8) 100%)",
            borderColor: `${colors[1]}50`,
          }}
        >
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" style={{ color: colors[1] }} />
            <span className="font-medium text-sm text-white">
              {MOCK_USERS.length} Present
            </span>
          </div>
          {getHandRaisedUsers().length > 0 && (
            <div
              className="flex items-center gap-1 rounded-lg px-2 py-1"
              style={{ background: `${colors[2]}30` }}
            >
              <Hand className="h-3 w-3" style={{ color: colors[2] }} />
              <span className="text-white text-xs">
                {getHandRaisedUsers().length}
              </span>
            </div>
          )}
          <div className="h-4 w-px bg-white/20" />
          <div className="-space-x-2 flex">
            {MOCK_USERS.slice(0, 4).map((user, idx) => (
              <div
                key={user.id}
                className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-black font-bold text-[10px] text-white"
                style={{ background: colors[idx % colors.length] }}
                title={user.name}
              >
                {user.avatar}
              </div>
            ))}
            {MOCK_USERS.length > 4 && (
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-black font-bold text-[10px] text-white"
                style={{ background: colors[3 % colors.length] || colors[0] }}
              >
                +{MOCK_USERS.length - 4}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <EngagementPanel
        metrics={MOCK_ENGAGEMENT}
        users={MOCK_USERS}
        isOpen={showEngagementPanel}
        onClose={() => setShowEngagementPanel(false)}
        theme={currentTheme}
      />

      <motion.div
        className="absolute right-4 bottom-4 left-4 z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div
          className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border px-6 py-4 backdrop-blur-xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(20,20,30,0.9) 100%)",
            borderColor: `${colors[0]}50`,
            boxShadow: `0 -10px 40px ${colors[0]}20`,
          }}
        >
          <GesturePanel
            gestures={MOCK_GESTURES}
            activeGesture={activeGesture}
            onGestureSelect={setActiveGesture}
            theme={currentTheme}
          />

          <div className="mx-4 h-10 w-px bg-white/10" />

          <div className="flex items-center gap-2">
            {[
              {
                id: "pointer",
                icon: <MousePointer2 className="h-4 w-4" />,
                label: "Pointer",
              },
              {
                id: "pen",
                icon: <PenTool className="h-4 w-4" />,
                label: "Pen",
              },
              {
                id: "eraser",
                icon: <Eraser className="h-4 w-4" />,
                label: "Eraser",
              },
              { id: "hand", icon: <Hand className="h-4 w-4" />, label: "Hand" },
            ].map((tool, idx) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id as typeof activeTool)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-all ${
                  activeTool === tool.id ? "" : "hover:bg-white/5"
                }`}
                style={{
                  background:
                    activeTool === tool.id
                      ? `${colors[idx % colors.length]}30`
                      : "transparent",
                  color:
                    activeTool === tool.id
                      ? colors[idx % colors.length]
                      : "rgba(255,255,255,0.6)",
                }}
              >
                {tool.icon}
                <span className="font-medium text-sm">{tool.label}</span>
              </button>
            ))}
          </div>

          <div className="mx-4 h-10 w-px bg-white/10" />

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAudioZones(!showAudioZones)}
              className={`rounded-xl border p-3 transition-all ${
                showAudioZones ? "" : "hover:bg-white/5"
              }`}
              style={{
                background: showAudioZones ? `${colors[0]}30` : "transparent",
                borderColor: showAudioZones
                  ? colors[0]
                  : "rgba(255,255,255,0.1)",
                color: showAudioZones ? colors[0] : "rgba(255,255,255,0.6)",
              }}
              title="Toggle Audio Zones"
            >
              {showAudioZones ? (
                <Volume2 className="h-5 w-5" />
              ) : (
                <VolumeX className="h-5 w-5" />
              )}
            </button>

            <button
              onClick={() => setShowEngagementPanel(!showEngagementPanel)}
              className={`rounded-xl border p-3 transition-all ${
                showEngagementPanel ? "" : "hover:bg-white/5"
              }`}
              style={{
                background: showEngagementPanel
                  ? `${colors[1]}30`
                  : "transparent",
                borderColor: showEngagementPanel
                  ? colors[1]
                  : "rgba(255,255,255,0.1)",
                color: showEngagementPanel
                  ? colors[1]
                  : "rgba(255,255,255,0.6)",
              }}
              title="Toggle Analytics"
            >
              <Activity className="h-5 w-5" />
            </button>

            <div className="mx-1 h-10 w-px bg-white/10" />

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCameraZoom(Math.max(0.5, cameraZoom - 0.1))}
                className="rounded-lg p-2 text-white/60 transition-colors hover:bg-white/5"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center text-sm text-white/60">
                {(cameraZoom * 100).toFixed(0)}%
              </span>
              <button
                onClick={() => setCameraZoom(Math.min(2, cameraZoom + 0.1))}
                className="rounded-lg p-2 text-white/60 transition-colors hover:bg-white/5"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={toggleFullscreen}
              className="rounded-xl border border-white/10 p-3 text-white/60 transition-all hover:bg-white/5"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? (
                <Minimize2 className="h-5 w-5" />
              ) : (
                <Maximize2 className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute right-4 bottom-24 z-40"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div
          className="space-y-3 rounded-2xl border p-4 backdrop-blur-xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(20,20,30,0.8) 100%)",
            borderColor: `${colors[2]}50`,
          }}
        >
          <p className="mb-2 font-medium text-white/60 text-xs uppercase tracking-wider">
            Hologram Settings
          </p>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-white">Opacity</span>
              <input
                type="range"
                min="0.3"
                max="1"
                step="0.1"
                value={hologramOpacity}
                onChange={(e) => setHologramOpacity(parseFloat(e.target.value))}
                className="h-1 w-24 cursor-pointer appearance-none rounded-full"
                style={{
                  background: `linear-gradient(to right, ${colors[0]} 0%, ${colors[0]} ${((hologramOpacity - 0.3) / 0.7) * 100}%, rgba(255,255,255,0.2) ${((hologramOpacity - 0.3) / 0.7) * 100}%, rgba(255,255,255,0.2) 100%)`,
                }}
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-white">Spatial Audio</span>
              <button
                onClick={() => setSpatialAudioEnabled(!spatialAudioEnabled)}
                className={`relative h-5 w-10 rounded-full transition-colors`}
                style={{
                  background: spatialAudioEnabled
                    ? colors[0]
                    : "rgba(255,255,255,0.2)",
                }}
              >
                <motion.div
                  className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-lg"
                  animate={{ left: spatialAudioEnabled ? "22px" : "2px" }}
                  transition={{ duration: 0.2 }}
                />
              </button>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-white">Gesture Recognition</span>
              <button
                onClick={() =>
                  setGestureRecognitionEnabled(!gestureRecognitionEnabled)
                }
                className={`relative h-5 w-10 rounded-full transition-colors`}
                style={{
                  background: gestureRecognitionEnabled
                    ? colors[1]
                    : "rgba(255,255,255,0.2)",
                }}
              >
                <motion.div
                  className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-lg"
                  animate={{ left: gestureRecognitionEnabled ? "22px" : "2px" }}
                  transition={{ duration: 0.2 }}
                />
              </button>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-white">Eye Tracking</span>
              <button
                onClick={() => setEyeTrackingEnabled(!eyeTrackingEnabled)}
                className={`relative h-5 w-10 rounded-full transition-colors`}
                style={{
                  background: eyeTrackingEnabled
                    ? colors[2]
                    : "rgba(255,255,255,0.2)",
                }}
              >
                <motion.div
                  className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-lg"
                  animate={{ left: eyeTrackingEnabled ? "22px" : "2px" }}
                  transition={{ duration: 0.2 }}
                />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-24 left-4 z-40"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div
          className="rounded-2xl border p-4 backdrop-blur-xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(20,20,30,0.8) 100%)",
            borderColor: `${colors[0]}50`,
          }}
        >
          <p className="mb-3 font-medium text-white/60 text-xs uppercase tracking-wider">
            Quick Actions
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/10">
              <Cast className="h-4 w-4" style={{ color: colors[0] }} />
              <span>Share Screen</span>
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/10">
              <Radio className="h-4 w-4" style={{ color: colors[1] }} />
              <span>Record</span>
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/10">
              <Scan className="h-4 w-4" style={{ color: colors[2] }} />
              <span>Scan Room</span>
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/10">
              <Settings className="h-4 w-4" style={{ color: colors[0] }} />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </motion.div>

      {selectedUser && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedUser(null)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(20,20,30,0.95) 100%)",
              border: `2px solid ${colors[0]}`,
              boxShadow: `0 0 60px ${colors[0]}40`,
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {(() => {
              const user = MOCK_USERS.find((u) => u.id === selectedUser);
              if (!user) return null;
              return (
                <>
                  <div
                    className="p-8"
                    style={{
                      background: `linear-gradient(135deg, ${colors[0]}10 0%, transparent 50%)`,
                    }}
                  >
                    <div className="flex items-start gap-6">
                      <motion.div
                        className="flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl font-bold text-4xl text-white"
                        style={{
                          background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`,
                          boxShadow: `0 0 40px ${colors[0]}50`,
                        }}
                        animate={{ rotateY: [0, 360] }}
                        transition={{
                          duration: 10,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        {user.avatar}
                      </motion.div>
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                          <h2 className="font-bold text-3xl text-white">
                            {user.name}
                          </h2>
                          <span
                            className="rounded-full px-3 py-1 font-medium text-xs uppercase"
                            style={{
                              background:
                                user.role === "teacher" ? colors[0] : colors[1],
                              color: "#000",
                            }}
                          >
                            {user.role}
                          </span>
                        </div>
                        <p className="mb-4 text-white/60">
                          {user.lastActivity}
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                          <div
                            className="rounded-xl border p-4"
                            style={{
                              background: `${colors[0]}15`,
                              borderColor: `${colors[0]}40`,
                            }}
                          >
                            <div className="mb-2 flex items-center gap-2">
                              <ScanEye
                                className="h-4 w-4"
                                style={{ color: colors[0] }}
                              />
                              <span className="text-sm text-white/60">
                                Eye Contact
                              </span>
                            </div>
                            <p className="font-bold text-2xl text-white">
                              {user.eyeContactScore}%
                            </p>
                          </div>

                          <div
                            className="rounded-xl border p-4"
                            style={{
                              background: `${colors[1]}15`,
                              borderColor: `${colors[1]}40`,
                            }}
                          >
                            <div className="mb-2 flex items-center gap-2">
                              <Activity
                                className="h-4 w-4"
                                style={{ color: colors[1] }}
                              />
                              <span className="text-sm text-white/60">
                                Engagement
                              </span>
                            </div>
                            <p className="font-bold text-2xl text-white">
                              {user.engagementLevel}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 border-white/10 border-t pt-6">
                      <p className="mb-4 text-sm text-white/60">
                        Audio Zone:{" "}
                        <span style={{ color: colors[2] }}>
                          {
                            MOCK_AUDIO_ZONES.find(
                              (z) => z.id === user.audioZone,
                            )?.name
                          }
                        </span>
                      </p>
                      <div className="flex gap-3">
                        <button
                          className="flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-white transition-colors"
                          style={{ background: colors[0] }}
                        >
                          <MessageSquare className="h-4 w-4" />
                          Message
                        </button>
                        <button
                          className="flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-white transition-colors"
                          style={{ background: colors[1] }}
                        >
                          <Focus className="h-4 w-4" />
                          Focus
                        </button>
                        <button className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 font-medium text-white transition-colors hover:bg-white/20">
                          <MoreHorizontal className="h-4 w-4" />
                          More
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedUser(null)}
                    className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </>
              );
            })()}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default HolographicRemoteTeaching;
