import React from "react";

export const Gauge = ({ percent = 0, radius, text = "", colors = ["#00ff00", "#ffff00", "#ff0000"], ...rest }) => {
  const strokeWidth = radius * 0.2;
  const innerRadius = radius - strokeWidth;
  const circumference = innerRadius * 2 * Math.PI;
  const arc = circumference * 0.75;
  const dashArray = `${arc} ${circumference}`;
  const transform = `rotate(135, ${radius}, ${radius})`;
  const offset = arc - (percent / 100) * arc;

  return (
    <svg height={radius * 2} width={radius * 2} {...rest}>
      <defs>
        <linearGradient id={`grad-${text}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={colors[0]} />
          stop offset="50%" stopColor={colors[1]} />
          <stop offset="100%" stopColor={colors[2]} />
        </linearGradient>
      </defs>

      {/* Base Gauge */}
      <circle
        className="gauge_base"
        cx={radius}
        cy={radius}
        fill="transparent"
        r={innerRadius}
        stroke="gray"
        strokeDasharray={dashArray}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        transform={transform}
      />

      {/* Active Gauge */}
      <circle
        className="gauge_percent"
        cx={radius}
        cy={radius}
        fill="transparent"
        r={innerRadius}
        stroke={`url(#grad-${text})`}
        strokeDasharray={dashArray}
        strokeDashoffset={offset}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        style={{ transition: "stroke-dashoffset 0.3s" }}
        transform={transform}
      />

      {/* Center Text */}
      <text
        x="50%"
        y="55%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="18"
        fontWeight="bold"
        fill="black"
      >
        {text}
      </text>
    </svg>
  );
};
