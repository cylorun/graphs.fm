import {
    FiBarChart2,
    FiBriefcase,
    FiDollarSign,
    FiLock,
    FiPieChart,
    FiShield,
    FiTarget,
    FiTrendingUp,
    FiUser,
    FiUsers
} from "react-icons/fi";

import { IBenefit } from "@/types"

export const benefits: IBenefit[] = [
    {
        title: "Music Insights",
        description: "Share and view all your listening habits in one place",
        bullets: [
            {
                title: "Personalized Analytics",
                description: "Understand your top artists, most-played songs, and listening trends over time with real-time stats.",
                icon: <FiBarChart2 size={26} />
            },
            {
                title: "Compare & Share",
                description: "Easily compare and share stats with friends",
                icon: <FiUsers size={26} />
            },
            {
                title: "Listening Trends & Predictions",
                description: "Track your evolving music taste and get future recommendations based on your listening patterns.",
                icon: <FiTrendingUp size={26} />
            }
        ],
        imageSrc: "/images/mockup.webp"
    }
]