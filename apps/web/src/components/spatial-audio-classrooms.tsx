"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Headphones,
  MapPin,
  Mic,
  MicOff,
  Monitor,
  Radio,
  Sliders,
  Users,
  Volume,
  Volume2,
  VolumeX,
  Waves,
  Zap,
} from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";

// Types
interface AudioZone {
  id: string;
  name: string;
  type: "main" | "breakout" | "quiet";
  participants: Participant[];
  position: { x: number; y: number; z: number };
  radius: number;
  color: string;
}

interface Participant {
  id: string;
  name: string;
  avatar: string;
  position: { x: number; y: number; z: number };
  isSpeaking: boolean;
  volume: number;
  muted: boolean;
  role: "teacher" | "student" | "observer";
}

interface AudioSettings {
  masterVolume: number;
  spatialAudio: boolean;
  noiseCancellation: boolean;
  voiceEnhancement: boolean;
  dolbyAtmos: boolean;
  voiceDirectionality: number;
  distanceAttenuation: number;
  reverbAmount: number;
}

// Mock data
const mockParticipants: Participant[] = [
  {
    id: "1",
    name: "Dr. Sarah Chen",
    avatar: "SC",
    position: { x: 0, y: 0, z: 0 },
    isSpeaking: true,
    volume: 85,
    muted: false,
    role: "teacher",
  },
  {
    id: "2",
    name: "Alex Rivera",
    avatar: "AR",
    position: { x: -3, y: 2, z: -2 },
    isSpeaking: false,
    volume: 70,
    muted: false,
    role: "student",
  },
  {
    id: "3",
    name: "Jordan Kim",
    avatar: "JK",
    position: { x: 3, y: -1, z: -1 },
    isSpeaking: false,
    volume: 65,
    muted: true,
    role: "student",
  },
  {
    id: "4",
    name: "Maya Patel",
    avatar: "MP",
    position: { x: -2, y: -2, z: -3 },
    isSpeaking: false,
    volume: 72,
    muted: false,
    role: "student",
  },
  {
    id: "5",
    name: "Chris Thompson",
    avatar: "CT",
    position: { x: 2, y: 3, z: 1 },
    isSpeaking: true,
    volume: 60,
    muted: false,
    role: "student",
  },
  {
    id: "6",
    name: "Lisa Wang",
    avatar: "LW",
    position: { x: -4, y: 1, z: 0 },
    isSpeaking: false,
    volume: 68,
    muted: false,
    role: "observer",
  },
];

const mockZones: AudioZone[] = [
  {
    id: "1",
    name: "Main Lecture Hall",
    type: "main",
    participants: mockParticipants.slice(0, 4),
    position: { x: 0, y: 0, z: 0 },
    radius: 6,
    color: "#6366f1",
  },
  {
    id: "2",
    name: "Breakout Room A",
    type: "breakout",
    participants: mockParticipants.slice(4, 5),
    position: { x: -8, y: 0, z: 4 },
    radius: 3,
    color: "#22d3ee",
  },
  {
    id: "3",
    name: "Quiet Study",
    type: "quiet",
    participants: mockParticipants.slice(5, 6),
    position: { x: 8, y: 0, z: 4 },
    radius: 2.5,
    color: "#34d399",
  },
];

// Sound wave visualization component
const SoundWave: React.FC<{ active: boolean; intensity: number }> = ({
  active,
  intensity,
}) => {
  return (
    <div className="flex h-8 items-end gap-0.5">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-0.5 rounded-full bg-current"
          animate={{
            height: active ? [4, Math.random() * 24 * intensity + 4, 4] : 4,
            opacity: active ? 1 : 0.3,
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            delay: i * 0.05,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// 3D visualization component
const SpatialVisualization: React.FC<{
  participants: Participant[];
  zones: AudioZone[];
  selectedParticipant: string | null;
  onSelectParticipant: (id: string) => void;
  settings: AudioSettings;
}> = ({
  participants,
  zones,
  selectedParticipant,
  onSelectParticipant,
  settings,
}) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!settings.spatialAudio) return;
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [settings.spatialAudio]);

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-950">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-slate-600"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Radial circles */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {[1, 2, 3, 4, 5].map((ring) => (
          <motion.div
            key={ring}
            className="absolute rounded-full border border-slate-700/50"
            style={{
              width: `${ring * 20}%`,
              height: `${ring * 20}%`,
            }}
            animate={{
              borderColor: settings.spatialAudio
                ? [
                    "rgba(99, 102, 241, 0.3)",
                    "rgba(34, 211, 238, 0.3)",
                    "rgba(99, 102, 241, 0.3)",
                  ]
                : "rgba(51, 65, 85, 0.5)",
            }}
            transition={{ duration: 3, repeat: Infinity, delay: ring * 0.5 }}
          />
        ))}
      </div>

      {/* Audio zones */}
      {zones.map((zone) => (
        <motion.div
          key={zone.id}
          className="pointer-events-none absolute rounded-full border-2 border-dashed"
          style={{
            left: `${50 + zone.position.x * 6}%`,
            top: `${50 + zone.position.z * 6}%`,
            width: `${zone.radius * 12}%`,
            height: `${zone.radius * 12}%`,
            transform: "translate(-50%, -50%)",
            borderColor: zone.color,
            backgroundColor: `${zone.color}10`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div
            className="-top-6 -translate-x-1/2 absolute left-1/2 whitespace-nowrap rounded-full px-2 py-1 font-mono text-xs"
            style={{ backgroundColor: zone.color, color: "#0f172a" }}
          >
            {zone.name}
          </div>
        </motion.div>
      ))}

      {/* Participants */}
      {participants.map((participant, index) => {
        const isSelected = selectedParticipant === participant.id;
        const isSpeaking = participant.isSpeaking;

        return (
          <motion.div
            key={participant.id}
            className="absolute z-10 cursor-pointer"
            style={{
              left: `${50 + participant.position.x * 8}%`,
              top: `${50 + participant.position.z * 8}%`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: isSelected ? 1.2 : 1,
              opacity: 1,
              x: Math.sin((rotation + index * 60) * (Math.PI / 180)) * 5,
              y: Math.cos((rotation + index * 60) * (Math.PI / 180)) * 5,
            }}
            whileHover={{ scale: 1.15 }}
            onClick={() => onSelectParticipant(participant.id)}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div
              className={`-translate-x-1/2 -translate-y-1/2 relative transition-all duration-300 ${
                isSpeaking ? "ring-4 ring-indigo-500/50" : ""
              } ${isSelected ? "ring-4 ring-cyan-400/60" : ""}`}
            >
              {/* Avatar */}
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full font-bold text-sm shadow-lg transition-all duration-300 ${
                  participant.role === "teacher"
                    ? "bg-gradient-to-br from-amber-400 to-orange-600 text-slate-900"
                    : participant.role === "observer"
                      ? "bg-gradient-to-br from-emerald-400 to-teal-600 text-slate-900"
                      : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                } ${isSpeaking ? "animate-pulse" : ""}`}
              >
                {participant.avatar}
              </div>

              {/* Speaking indicator */}
              {isSpeaking && (
                <motion.div
                  className="-inset-2 absolute rounded-full border-2 border-indigo-400"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}

              {/* Position indicator */}
              <div className="-bottom-8 -translate-x-1/2 absolute left-1/2 whitespace-nowrap font-mono text-[10px] text-slate-400 opacity-0 transition-opacity group-hover:opacity-100">
                x:{participant.position.x} y:{participant.position.y} z:
                {participant.position.z}
              </div>

              {/* Name label */}
              <div className="-bottom-5 -translate-x-1/2 absolute left-1/2 whitespace-nowrap">
                <span className="rounded-full bg-slate-900/80 px-2 py-0.5 font-medium text-slate-300 text-xs">
                  {participant.name}
                </span>
              </div>

              {/* Volume indicator */}
              {isSpeaking && (
                <div className="-top-2 -right-2 absolute">
                  <div className="flex gap-0.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1 rounded-full bg-indigo-400"
                        animate={{ height: [4, 12, 4] }}
                        transition={{
                          duration: 0.4,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}

      {/* Center reference point */}
      <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2">
        <motion.div
          className="h-3 w-3 rounded-full bg-cyan-500"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-900/90 p-3 backdrop-blur-sm">
        <div className="mb-1 font-semibold text-slate-400 text-xs">Legend</div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-gradient-to-br from-amber-400 to-orange-600" />
          <span className="text-slate-300 text-xs">Teacher</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600" />
          <span className="text-slate-300 text-xs">Student</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600" />
          <span className="text-slate-300 text-xs">Observer</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-2 animate-pulse rounded-full bg-indigo-400" />
          <span className="text-slate-300 text-xs">Speaking</span>
        </div>
      </div>
    </div>
  );
};

// Control panel component
const ControlPanel: React.FC<{
  settings: AudioSettings;
  onSettingsChange: (settings: AudioSettings) => void;
  selectedParticipant: Participant | null;
  onParticipantUpdate: (participant: Participant) => void;
}> = ({
  settings,
  onSettingsChange,
  selectedParticipant,
  onParticipantUpdate,
}) => {
  const [expandedSection, setExpandedSection] = useState<string>("spatial");

  const toggleSetting = (key: keyof AudioSettings) => {
    onSettingsChange({ ...settings, [key]: !settings[key] });
  };

  const updateSetting = (key: keyof AudioSettings, value: number) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-xl">
      {/* Section: Spatial Audio */}
      <div className="overflow-hidden rounded-2xl border border-slate-800">
        <button
          onClick={() =>
            setExpandedSection(expandedSection === "spatial" ? "" : "spatial")
          }
          className="flex w-full items-center justify-between bg-slate-800/50 p-4 transition-colors hover:bg-slate-800"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20">
              <MapPin className="h-5 w-5 text-indigo-400" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-slate-200">Spatial Audio</h3>
              <p className="text-slate-400 text-xs">
                3D positioning & directionality
              </p>
            </div>
          </div>
          <ChevronDown
            className={`h-5 w-5 text-slate-400 transition-transform ${
              expandedSection === "spatial" ? "rotate-180" : ""
            }`}
          />
        </button>

        <AnimatePresence>
          {expandedSection === "spatial" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 p-4">
                {/* Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-sm">
                    Enable Spatial Audio
                  </span>
                  <button
                    onClick={() => toggleSetting("spatialAudio")}
                    className={`relative h-6 w-12 rounded-full transition-colors ${
                      settings.spatialAudio ? "bg-indigo-500" : "bg-slate-700"
                    }`}
                  >
                    <motion.div
                      className="absolute top-1 h-4 w-4 rounded-full bg-white"
                      animate={{ left: settings.spatialAudio ? "28px" : "4px" }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  </button>
                </div>

                {/* Voice Directionality */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 text-sm">
                      Voice Directionality
                    </span>
                    <span className="font-mono text-slate-400 text-xs">
                      {settings.voiceDirectionality}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.voiceDirectionality}
                    onChange={(e) =>
                      updateSetting(
                        "voiceDirectionality",
                        parseInt(e.target.value),
                      )
                    }
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-700 accent-indigo-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Omnidirectional</span>
                    <span>Highly Directional</span>
                  </div>
                </div>

                {/* Distance Attenuation */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 text-sm">
                      Distance Attenuation
                    </span>
                    <span className="font-mono text-slate-400 text-xs">
                      {settings.distanceAttenuation}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.distanceAttenuation}
                    onChange={(e) =>
                      updateSetting(
                        "distanceAttenuation",
                        parseInt(e.target.value),
                      )
                    }
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-700 accent-indigo-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Constant Volume</span>
                    <span>Natural Distance</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Section: Audio Enhancement */}
      <div className="overflow-hidden rounded-2xl border border-slate-800">
        <button
          onClick={() =>
            setExpandedSection(
              expandedSection === "enhancement" ? "" : "enhancement",
            )
          }
          className="flex w-full items-center justify-between bg-slate-800/50 p-4 transition-colors hover:bg-slate-800"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20">
              <Zap className="h-5 w-5 text-cyan-400" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-slate-200">
                Audio Enhancement
              </h3>
              <p className="text-slate-400 text-xs">
                Voice clarity & processing
              </p>
            </div>
          </div>
          <ChevronDown
            className={`h-5 w-5 text-slate-400 transition-transform ${
              expandedSection === "enhancement" ? "rotate-180" : ""
            }`}
          />
        </button>

        <AnimatePresence>
          {expandedSection === "enhancement" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 p-4">
                {/* Voice Enhancement Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Waves className="h-4 w-4 text-cyan-400" />
                    <span className="text-slate-300 text-sm">
                      Voice Clarity Enhancement
                    </span>
                  </div>
                  <button
                    onClick={() => toggleSetting("voiceEnhancement")}
                    className={`relative h-6 w-12 rounded-full transition-colors ${
                      settings.voiceEnhancement ? "bg-cyan-500" : "bg-slate-700"
                    }`}
                  >
                    <motion.div
                      className="absolute top-1 h-4 w-4 rounded-full bg-white"
                      animate={{
                        left: settings.voiceEnhancement ? "28px" : "4px",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  </button>
                </div>

                {/* Noise Cancellation Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <VolumeX className="h-4 w-4 text-rose-400" />
                    <span className="text-slate-300 text-sm">
                      Noise Cancellation
                    </span>
                  </div>
                  <button
                    onClick={() => toggleSetting("noiseCancellation")}
                    className={`relative h-6 w-12 rounded-full transition-colors ${
                      settings.noiseCancellation
                        ? "bg-rose-500"
                        : "bg-slate-700"
                    }`}
                  >
                    <motion.div
                      className="absolute top-1 h-4 w-4 rounded-full bg-white"
                      animate={{
                        left: settings.noiseCancellation ? "28px" : "4px",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  </button>
                </div>

                {/* Reverb Amount */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 text-sm">Room Reverb</span>
                    <span className="font-mono text-slate-400 text-xs">
                      {settings.reverbAmount}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.reverbAmount}
                    onChange={(e) =>
                      updateSetting("reverbAmount", parseInt(e.target.value))
                    }
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-700 accent-cyan-500"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Section: Dolby Atmos / 3D Audio */}
      <div className="overflow-hidden rounded-2xl border border-slate-800">
        <button
          onClick={() =>
            setExpandedSection(expandedSection === "dolby" ? "" : "dolby")
          }
          className="flex w-full items-center justify-between bg-slate-800/50 p-4 transition-colors hover:bg-slate-800"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20">
              <Headphones className="h-5 w-5 text-amber-400" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-slate-200">Dolby Atmos</h3>
              <p className="text-slate-400 text-xs">
                Immersive 3D audio support
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {settings.dolbyAtmos && (
              <span className="rounded-full bg-amber-400/10 px-2 py-1 font-semibold text-[10px] text-amber-400">
                ACTIVE
              </span>
            )}
            <ChevronDown
              className={`h-5 w-5 text-slate-400 transition-transform ${
                expandedSection === "dolby" ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>

        <AnimatePresence>
          {expandedSection === "dolby" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 p-4">
                {/* Dolby Atmos Toggle */}
                <div className="flex items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20">
                      <Radio className="h-4 w-4 text-amber-400" />
                    </div>
                    <div>
                      <span className="font-medium text-amber-400 text-sm">
                        Dolby Atmos
                      </span>
                      <p className="text-[10px] text-slate-400">
                        Object-based 3D audio
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSetting("dolbyAtmos")}
                    className={`relative h-6 w-12 rounded-full transition-colors ${
                      settings.dolbyAtmos ? "bg-amber-500" : "bg-slate-700"
                    }`}
                  >
                    <motion.div
                      className="absolute top-1 h-4 w-4 rounded-full bg-white"
                      animate={{ left: settings.dolbyAtmos ? "28px" : "4px" }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  </button>
                </div>

                {/* Status indicators */}
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className={`rounded-xl border p-3 ${settings.dolbyAtmos ? "border-amber-500/30 bg-amber-500/10" : "border-slate-700 bg-slate-800/50"}`}
                  >
                    <div className="mb-1 text-[10px] text-slate-400">
                      Audio Objects
                    </div>
                    <div
                      className={`font-semibold text-lg ${settings.dolbyAtmos ? "text-amber-400" : "text-slate-500"}`}
                    >
                      {settings.dolbyAtmos ? "12" : "—"}
                    </div>
                  </div>
                  <div
                    className={`rounded-xl border p-3 ${settings.dolbyAtmos ? "border-amber-500/30 bg-amber-500/10" : "border-slate-700 bg-slate-800/50"}`}
                  >
                    <div className="mb-1 text-[10px] text-slate-400">
                      Channels
                    </div>
                    <div
                      className={`font-semibold text-lg ${settings.dolbyAtmos ? "text-amber-400" : "text-slate-500"}`}
                    >
                      {settings.dolbyAtmos ? "7.1.4" : "Stereo"}
                    </div>
                  </div>
                </div>

                {/* Visualization */}
                {settings.dolbyAtmos && (
                  <div className="rounded-xl bg-slate-800/50 p-3">
                    <div className="mb-2 text-[10px] text-slate-400">
                      Channel Activity
                    </div>
                    <div className="grid grid-cols-8 gap-1">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="h-8 rounded bg-amber-500/30"
                          animate={{
                            opacity: [0.3, 0.8, 0.3],
                            scaleY: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: i * 0.05,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Section: Master Volume */}
      <div className="rounded-2xl border border-slate-800 p-4">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800">
            <Volume2 className="h-5 w-5 text-slate-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-200">Master Volume</h3>
            <p className="text-slate-400 text-xs">Overall session level</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() =>
              updateSetting(
                "masterVolume",
                Math.max(0, settings.masterVolume - 10),
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 transition-colors hover:bg-slate-700"
          >
            <Volume className="h-4 w-4 text-slate-400" />
          </button>

          <div className="flex-1">
            <input
              type="range"
              min="0"
              max="100"
              value={settings.masterVolume}
              onChange={(e) =>
                updateSetting("masterVolume", parseInt(e.target.value))
              }
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-700 accent-indigo-500"
            />
          </div>

          <span className="w-12 text-right font-mono text-slate-300 text-sm">
            {settings.masterVolume}%
          </span>

          <button
            onClick={() =>
              updateSetting(
                "masterVolume",
                Math.min(100, settings.masterVolume + 10),
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 transition-colors hover:bg-slate-700"
          >
            <Volume2 className="h-4 w-4 text-slate-400" />
          </button>
        </div>

        {/* Visualizer */}
        <div className="mt-4">
          <SoundWave
            active={settings.masterVolume > 0}
            intensity={settings.masterVolume / 100}
          />
        </div>
      </div>
    </div>
  );
};

// Participant details panel
const ParticipantPanel: React.FC<{
  participant: Participant | null;
  onUpdate: (participant: Participant) => void;
}> = ({ participant, onUpdate }) => {
  if (!participant) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-xl">
        <div className="py-8 text-center text-slate-500">
          <Users className="mx-auto mb-3 h-12 w-12 opacity-50" />
          <p className="text-sm">
            Select a participant to adjust their audio settings
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-xl"
    >
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl font-bold text-xl shadow-lg ${
            participant.role === "teacher"
              ? "bg-gradient-to-br from-amber-400 to-orange-600 text-slate-900"
              : participant.role === "observer"
                ? "bg-gradient-to-br from-emerald-400 to-teal-600 text-slate-900"
                : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
          }`}
        >
          {participant.avatar}
        </div>
        <div>
          <h3 className="font-semibold text-slate-200">{participant.name}</h3>
          <span className="text-slate-400 text-xs capitalize">
            {participant.role}
          </span>
        </div>
        <div className="ml-auto">
          <button
            onClick={() =>
              onUpdate({ ...participant, muted: !participant.muted })
            }
            className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
              participant.muted
                ? "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            {participant.muted ? (
              <MicOff className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Position Controls */}
      <div className="mb-6 space-y-4">
        <h4 className="flex items-center gap-2 font-semibold text-slate-300 text-sm">
          <MapPin className="h-4 w-4 text-indigo-400" />
          3D Position
        </h4>

        {["x", "y", "z"].map((axis) => (
          <div key={axis} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-slate-400 text-xs uppercase">
                {axis}-axis
              </span>
              <span className="font-mono text-slate-300 text-xs">
                {
                  participant.position[
                    axis as keyof typeof participant.position
                  ]
                }
              </span>
            </div>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.1"
              value={
                participant.position[axis as keyof typeof participant.position]
              }
              onChange={(e) =>
                onUpdate({
                  ...participant,
                  position: {
                    ...participant.position,
                    [axis]: parseFloat(e.target.value),
                  },
                })
              }
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-700 accent-indigo-500"
            />
          </div>
        ))}
      </div>

      {/* Volume Control */}
      <div className="space-y-4">
        <h4 className="flex items-center gap-2 font-semibold text-slate-300 text-sm">
          <Volume2 className="h-4 w-4 text-cyan-400" />
          Individual Volume
        </h4>

        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              onUpdate({
                ...participant,
                volume: Math.max(0, participant.volume - 10),
              })
            }
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 transition-colors hover:bg-slate-700"
          >
            <Volume className="h-3 w-3 text-slate-400" />
          </button>

          <div className="flex-1">
            <input
              type="range"
              min="0"
              max="100"
              value={participant.volume}
              onChange={(e) =>
                onUpdate({ ...participant, volume: parseInt(e.target.value) })
              }
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-700 accent-cyan-500"
            />
          </div>

          <span className="w-10 text-right font-mono text-slate-300 text-sm">
            {participant.volume}%
          </span>

          <button
            onClick={() =>
              onUpdate({
                ...participant,
                volume: Math.min(100, participant.volume + 10),
              })
            }
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 transition-colors hover:bg-slate-700"
          >
            <Volume2 className="h-3 w-3 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Speaking indicator */}
      <div className="mt-6 rounded-xl bg-slate-800/50 p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-slate-400 text-xs">Voice Activity</span>
          <div
            className={`h-2 w-2 rounded-full ${participant.isSpeaking ? "animate-pulse bg-indigo-400" : "bg-slate-600"}`}
          />
        </div>
        <SoundWave
          active={participant.isSpeaking}
          intensity={participant.volume / 100}
        />
      </div>
    </motion.div>
  );
};

// Zones panel
const ZonesPanel: React.FC<{
  zones: AudioZone[];
  activeZone: string | null;
  onZoneSelect: (zoneId: string | null) => void;
}> = ({ zones, activeZone, onZoneSelect }) => {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-xl">
      <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-200">
        <Monitor className="h-5 w-5 text-indigo-400" />
        Audio Zones
      </h3>

      <div className="space-y-3">
        {zones.map((zone) => (
          <motion.button
            key={zone.id}
            onClick={() =>
              onZoneSelect(activeZone === zone.id ? null : zone.id)
            }
            className={`w-full rounded-xl border p-4 text-left transition-all ${
              activeZone === zone.id
                ? "border-indigo-500/50 bg-indigo-500/10"
                : "border-slate-800 bg-slate-800/50 hover:bg-slate-800"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: zone.color }}
                />
                <span className="font-medium text-slate-200">{zone.name}</span>
              </div>
              <span className="rounded-full bg-slate-700 px-2 py-1 text-slate-400 text-xs capitalize">
                {zone.type}
              </span>
            </div>

            <div className="flex items-center gap-4 text-slate-400 text-xs">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {zone.participants.length}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {zone.radius}m radius
              </span>
            </div>

            {/* Mini participant avatars */}
            <div className="mt-3 flex items-center gap-1">
              {zone.participants.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className={`flex h-6 w-6 items-center justify-center rounded-full font-bold text-[8px] ${
                    p.role === "teacher"
                      ? "bg-amber-500/30 text-amber-400"
                      : "bg-indigo-500/30 text-indigo-400"
                  }`}
                >
                  {p.avatar[0]}
                </div>
              ))}
              {zone.participants.length > 4 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-[8px] text-slate-400">
                  +{zone.participants.length - 4}
                </div>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Create new zone button */}
      <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 border-dashed p-4 text-slate-400 transition-colors hover:border-indigo-500/50 hover:text-indigo-400">
        <div className="flex h-5 w-5 items-center justify-center rounded-full border border-current text-sm">
          +
        </div>
        <span className="text-sm">Create Breakout Zone</span>
      </button>
    </div>
  );
};

// Main component
export default function SpatialAudioClassrooms() {
  const [participants, setParticipants] =
    useState<Participant[]>(mockParticipants);
  const [zones] = useState<AudioZone[]>(mockZones);
  const [selectedParticipantId, setSelectedParticipantId] = useState<
    string | null
  >(null);
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [settings, setSettings] = useState<AudioSettings>({
    masterVolume: 75,
    spatialAudio: true,
    noiseCancellation: true,
    voiceEnhancement: true,
    dolbyAtmos: true,
    voiceDirectionality: 65,
    distanceAttenuation: 80,
    reverbAmount: 30,
  });

  const selectedParticipant =
    participants.find((p) => p.id === selectedParticipantId) || null;

  const updateParticipant = useCallback((updatedParticipant: Participant) => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === updatedParticipant.id ? updatedParticipant : p,
      ),
    );
  }, []);

  // Simulate random speaking
  useEffect(() => {
    const interval = setInterval(() => {
      setParticipants((prev) =>
        prev.map((p) => ({
          ...p,
          isSpeaking: Math.random() > 0.7 && !p.muted,
        })),
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-200">
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-[800px] w-[800px] rounded-full bg-purple-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/20 shadow-lg">
              <Headphones className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-white via-indigo-200 to-cyan-200 bg-clip-text font-bold text-3xl text-transparent">
                Spatial Audio Classrooms
              </h1>
              <p className="text-slate-400">
                Immersive 3D audio for virtual learning environments
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left column: Visualization */}
          <div className="space-y-6 lg:col-span-5">
            <SpatialVisualization
              participants={participants}
              zones={zones}
              selectedParticipant={selectedParticipantId}
              onSelectParticipant={setSelectedParticipantId}
              settings={settings}
            />

            <ZonesPanel
              zones={zones}
              activeZone={activeZone}
              onZoneSelect={setActiveZone}
            />
          </div>

          {/* Middle column: Controls */}
          <div className="lg:col-span-4">
            <ControlPanel
              settings={settings}
              onSettingsChange={setSettings}
              selectedParticipant={selectedParticipant}
              onParticipantUpdate={updateParticipant}
            />
          </div>

          {/* Right column: Participant details */}
          <div className="lg:col-span-3">
            <ParticipantPanel
              participant={selectedParticipant}
              onUpdate={updateParticipant}
            />

            {/* Quick stats */}
            <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-xl">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-300 text-sm">
                <Sliders className="h-4 w-4 text-indigo-400" />
                Session Stats
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs">
                    Active Speakers
                  </span>
                  <span className="font-mono text-indigo-400 text-sm">
                    {participants.filter((p) => p.isSpeaking).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs">
                    Muted Participants
                  </span>
                  <span className="font-mono text-rose-400 text-sm">
                    {participants.filter((p) => p.muted).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs">Audio Zones</span>
                  <span className="font-mono text-cyan-400 text-sm">
                    {zones.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs">Dolby Atmos</span>
                  <span
                    className={`font-mono text-sm ${settings.dolbyAtmos ? "text-amber-400" : "text-slate-500"}`}
                  >
                    {settings.dolbyAtmos ? "Active" : "Off"}
                  </span>
                </div>
              </div>

              {/* Audio quality indicator */}
              <div className="mt-4 rounded-xl bg-slate-800/50 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-slate-400 text-xs">Audio Quality</span>
                  <span className="font-mono text-emerald-400 text-xs">
                    Excellent
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                    initial={{ width: 0 }}
                    animate={{ width: "95%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
