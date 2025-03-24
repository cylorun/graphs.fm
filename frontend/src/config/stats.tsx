import { BsBarChartFill, BsFillStarFill } from "react-icons/bs";
import { PiGlobeFill } from "react-icons/pi";

import { IStats } from "@/types";

export const stats: IStats[] = [
    {
        title: "1+",
        icon: <BsBarChartFill size={34}/>,
        description: "Users registered every day, providing real-time insights."
    },
    {
        title: "5.0",
        icon: <BsFillStarFill size={34}/>,
        description: "Star rating, consistently maintained."
    },
    {
        title: "100+",
        icon: <PiGlobeFill size={34}/>,
        description: "Total plays"
    }
];