import { useEffect, useState } from "react";
import api from "@/util/api";

export type ListeningClockProps = {
    uid: string;
};

export function ListeningClock({ uid }: ListeningClockProps) {
    const [hourData, setHourData] = useState<number[]>([]);
    const [hovered, setHovered] = useState<number | null>(null);

    useEffect(() => {
        const fetchHourData = async () => {
            if (!uid) return;
            try {
                const res = await api.get(`/users/${uid}/playcount/hourly`);
                setHourData(res.data);
            } catch (err) {
                console.error("Failed to fetch hour data:", err);
            }
        };
        fetchHourData();
    }, [uid]);

    if (hourData.length !== 24) return null;

    const center = 150;
    const radius = 60;
    const barWidth = 6;
    const maxBarLength = 50;
    const maxCount = Math.max(...hourData, 1);

    return (
        <svg width={300} height={300} viewBox="0 0 300 300">
            <circle cx={center} cy={center} r={radius - 10} fill="none" stroke="#eee" />
            {hourData.map((count, i) => {
                const angle = (i / 24) * 2 * Math.PI - Math.PI / 2;
                const isHovered = i === hovered;

                const barLength = (count / maxCount) * maxBarLength;
                const expand = isHovered ? 10 : 0;
                const outerRadius = radius + maxBarLength;
                const startRadius = radius;
                const endRadius = startRadius + barLength + expand;

                const thickness = barWidth;

                const angleLeft = angle - (thickness / radius);
                const angleRight = angle + (thickness / radius);

                // base
                const x1 = center + Math.cos(angleLeft) * startRadius;
                const y1 = center + Math.sin(angleLeft) * startRadius;
                const x2 = center + Math.cos(angleRight) * startRadius;
                const y2 = center + Math.sin(angleRight) * startRadius;

                // tip
                const x3 = center + Math.cos(angle) * endRadius;
                const y3 = center + Math.sin(angle) * endRadius;

                const textRadius = outerRadius + 10;

                const textX = center + Math.cos(angle) * textRadius;
                const textY = center + Math.sin(angle) * textRadius;
                return (
                    <g
                        key={i}
                        onMouseEnter={() => setHovered(i)}
                        onMouseLeave={() => setHovered(null)}
                        style={{ transition: "all 0.2s ease" }}
                    >
                        <polygon
                            points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`}
                            fill={isHovered ? "#22c55e" : "#4ade80"}
                        />

                        {isHovered && (
                            <text
                                x={textX}
                                y={textY}
                                fontSize="12"
                                textAnchor="middle"
                                alignmentBaseline="middle"
                                fill="#fff"
                                fontWeight="bold"
                            >
                                {`${count} plays`}
                            </text>
                        )}
                    </g>
                );
            })}


            {/* hour labels */}
            {Array.from({ length: 24 }).map((_, i) => {
                const isHovered = i === hovered;
                const angle = (i / 24) * 2 * Math.PI - Math.PI / 2;
                const x = center + Math.cos(angle) * (radius + maxBarLength + (isHovered ? 32 : 14));
                const y = center + Math.sin(angle) * (radius + maxBarLength + (isHovered ? 32 : 14));
                return (
                    <text
                        key={`label-${i}`}
                        x={x}
                        y={y}
                        fontSize="10"
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        fill="#aaa"
                    >
                        {i % 3 == 0 ? i : ''}
                    </text>
                );
            })}
        </svg>
    );
}
