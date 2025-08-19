"use client";

import { motion } from "framer-motion";

type TabId = "create" | "manage" | "availability";

interface UnderlineTabsProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}

export function UnderlineTabs({ activeTab, setActiveTab }: UnderlineTabsProps) {
  const tabs = [
    { id: "create", label: "Booking Creation" },
    { id: "manage", label: "Booking Management" },
    { id: "availability", label: "Availability & Scheduling" },
  ];

  return (
    <div className="sticky top-0 z-20 backdrop-blur bg-gray-900/85 border-b border-gray-700">
      <div className="max-w-6xl mx-auto flex justify-center gap-10 py-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabId)}
            className={`relative text-sm md:text-base lg:text-lg font-semibold transition-colors ${
              activeTab === tab.id
                ? "text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="underline"
                className="absolute left-0 right-0 -bottom-[4px] h-[3px] rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                transition={{ type: "spring", stiffness: 420, damping: 28 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}