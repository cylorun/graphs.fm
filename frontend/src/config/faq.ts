import { IFAQ } from "@/types";
import { siteConfig } from "./siteConfig";

export const faqs: IFAQ[] = [
    {
        question: `Is ${siteConfig.siteName} safe to use?`,
        answer: 'Absolutely! We use secure authentication methods and never store your Spotify login details. Your data remains private and protected at all times.',
    },
    {
        question: `Can I access ${siteConfig.siteName} on multiple devices?`,
        answer: 'Yes! Our platform is fully responsive and works seamlessly on any browser',
    },
    {
        question: 'Do I need a Spotify Premium account?',
        answer: 'Nope! Our tracker works with both free and premium Spotify accounts, so you can analyze your stats no matter your subscription type.',
    },
    {
        question: 'How often are my stats updated?',
        answer: 'Your stats update in real time whenever you sync your Spotify account. You can check your latest top artists, tracks, and genres anytime!',
    },
    {
        question: 'Can I share my stats with friends?',
        answer: 'Yes! Easily generate shareable graphics of your top tracks and artists to post on social media or compare with friends.',
    },
    {
        question: 'What if I have issues or need support?',
        answer: 'Our support team is here to help! Reach out to us via email or check our knowledge base for troubleshooting tips and guides.',
    }
];
