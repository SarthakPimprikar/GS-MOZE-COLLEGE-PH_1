"use client";

import React, { useState } from "react";
import {
  Users,
  LineChart,
  Folder,
  CalendarCheck,
  ClipboardList,
} from "lucide-react";

const pillarsData = [
  {
    icon: <Users className="w-8 h-8" />,
    title: "Student Portal",
    description:
      "Centralized student access for academics, attendance and applications.",
  },
  {
    icon: <LineChart className="w-8 h-8" />,
    title: "Smart Analytics",
    description:
      "Real-time dashboards for performance, growth tracking and insights.",
  },
  {
    icon: <Folder className="w-8 h-8" />,
    title: "Course Management",
    description:
      "Organize subjects, timetables, assignments and learning resources.",
  },
  {
    icon: <CalendarCheck className="w-8 h-8" />,
    title: "Event Coordination",
    description:
      "Schedule seminars, exams, fests and automate notifications.",
  },
  {
    icon: <ClipboardList className="w-8 h-8" />,
    title: "Project Tracking",
    description:
      "Monitor projects, submissions, evaluation and approvals.",
  },
];

export default function CircularPillars() {
  const [active, setActive] = useState(null);

  const polarToCartesian = (cx, cy, r, a) => {
    const rad = ((a - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  const createArc = (start, end, innerR, outerR) => {
    const sO = polarToCartesian(0, 0, outerR, end);
    const eO = polarToCartesian(0, 0, outerR, start);
    const sI = polarToCartesian(0, 0, innerR, end);
    const eI = polarToCartesian(0, 0, innerR, start);
    const largeArc = end - start > 180 ? "1" : "0";

    return `
      M ${sO.x} ${sO.y}
      A ${outerR} ${outerR} 0 ${largeArc} 0 ${eO.x} ${eO.y}
      L ${eI.x} ${eI.y}
      A ${innerR} ${innerR} 0 ${largeArc} 1 ${sI.x} ${sI.y}
      Z
    `;
  };

  const getTextPos = (start, end, r) => {
    const mid = (start + end) / 2;
    return polarToCartesian(0, 0, r, mid);
  };

  const getOuterText = (start, end, r) => {
    const pos = getTextPos(start, end, r);
    return {
      ...pos,
      anchor:
        pos.x > 60 ? "start" : pos.x < -60 ? "end" : "middle",
    };
  };

  const pillars = pillarsData.map((item, i) => {
    const step = 360 / 5;
    return {
      number: `0${i + 1}`,
      ...item,
      start: -90 + i * step,
      end: -90 + (i + 1) * step,
    };
  });

  return (
    <section className="py-16 bg-white" id="pillars">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Our <span className="text-blue-600">Core Pillars</span>
        </h2>

        <p className="text-gray-600 mb-14 max-w-2xl mx-auto">
          The foundation modules that drive efficiency, innovation &
          seamless campus operations.
        </p>

        <div className="w-full max-w-4xl mx-auto">
          <svg
            viewBox="-380 -320 760 640"
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-auto"
            onMouseLeave={() => setActive(null)}
            style={{ overflow: "visible" }}
          >
            {pillars.map((p, i) => {
              const arc = createArc(p.start, p.end, 120, 220);
              const textPos = getTextPos(p.start, p.end, 165);
              const outer = getOuterText(p.start, p.end, 270);

              const isOn = active === i;

              const fill = isOn ? "#d4ff00" : "#0066ff";

              const mid = (p.start + p.end) / 2;
              const rad = ((mid - 90) * Math.PI) / 180;
              const floatDistance = isOn ? 18 : 0;
              const translateX = Math.cos(rad) * floatDistance;
              const translateY = Math.sin(rad) * floatDistance;

              return (
                <g
                  key={i}
                  transform={`translate(${translateX}, ${translateY})`}
                  style={{ transition: "transform 0.4s ease" }}
                >
                  <path
                    d={arc}
                    fill={fill}
                    onMouseEnter={() => setActive(i)}
                    style={{
                      cursor: "pointer",
                      transition: "fill 0.3s ease",
                    }}
                  />

                  {/* 🔹 NUMBER (COLOR CHANGES ON HOVER) */}
                  <text
                    x={textPos.x}
                    y={textPos.y}
                    fill={isOn ? "#0066ff" : "#ffffff"}
                    fontSize="46"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ transition: "fill 0.3s ease" }}
                  >
                    {p.number}
                  </text>

                  {/* Title */}
                  <text
                    x={outer.x}
                    y={outer.y - 8}
                    fill={isOn ? "#0066ff" : "#0066ff"}
                    fontSize="14"
                    fontWeight="bold"
                    textAnchor={outer.anchor}
                    style={{ transition: "0.3s" }}
                  >
                    {p.title}
                  </text>

                  {/* Description */}
                  <text
                    x={outer.x}
                    y={outer.y + 10}
                    fill={isOn ? "#000" : "#4B5563"}
                    fontSize="11"
                    textAnchor={outer.anchor}
                  >
                    <tspan x={outer.x}>
                      {p.description.slice(0, 35)}
                    </tspan>
                    <tspan x={outer.x} dy="12">
                      {p.description.slice(35)}
                    </tspan>
                  </text>
                </g>
              );
            })}

            {/* Center */}
            <circle cx="0" cy="0" r="115" fill="white" />
            <text x="0" y="-10" fontSize="16" fontWeight="500" textAnchor="middle">
              Five essential pillars
            </text>
            <text x="0" y="10" fontSize="16" fontWeight="500" textAnchor="middle">
              That Power Engineering
            </text>
            <text x="0" y="30" fontSize="16" fontWeight="500" textAnchor="middle">
              Excellence
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}
