import { IMenuItem, ISocials } from "@/types";

export const footerDetails: {
    subheading: string;
    quickLinks: IMenuItem[];
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
    discord: 'discord.gg/notestats',
    socials: {
        github: 'https://github.com/',
        twitter: 'https://twitter.com/',
        instagram: 'https://www.instagram.com',
    }
}