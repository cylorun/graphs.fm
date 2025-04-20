import { IMenuItem, ISocials } from "@/types";

export const footerDetails: {
    subheading: string;
    quickLinks: IMenuItem[];
    legal: IMenuItem[];
    discord: string;
    socials: ISocials;
} = {
    subheading: "All your listening habits in one place",
    quickLinks: [
        {
            text: "Features",
            url: "#features"
        },
        {
            text: "Global stats",
            url: "/global"
        }
    ],
    legal: [
        {
            text: "Privacy",
            url: "/privacy"
        },
        {
            text: "Terms",
            url: "/tos"
        }
    ],
    discord: 'discord.gg/graphsfm',
    socials: {
        github: 'https://github.com/graphsfm',
        twitter: 'https://twitter.com/',
        instagram: 'https://www.instagram.com',
    }
}