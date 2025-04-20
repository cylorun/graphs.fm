import Container from "@/components/container";
import {siteConfig} from "@/config/siteConfig";

const sectionTitleClass = "text-xl font-medium mb-2";
const sectionHeadingClass = "text-lg font-medium mb-2 ml-4 text-gray-300";
const sectionListClass = "text-md ml-6 space-y-1 text-gray-400";

export default function Page() {
    return (
        <Container className="flex flex-col min-h-screen px-5 pt-32 md:pt-40">
            <h1 className="text-4xl font-semibold mb-6">Privacy Policy</h1>
            <h3 className={'my-8 text-xl'}>We as in graphs.fm</h3>
            <ul className="space-y-8">
                <li>
                    <h2 className={sectionTitleClass}>1. Information We Collect</h2>
                    <h3 className={`${sectionHeadingClass}`}></h3>
                    <ul className={sectionListClass}>
                        <li>Cookies - We only use cookies to store session and login data and analytics</li>
                        <br/>
                        <li>
                            User Data we store and collect:
                            <ul className={`${sectionListClass} list-disc`}>
                                <li>Email linked to your spotify account</li>
                                <li>Creation date of your account</li>
                                <li>Date of last login</li>
                                <li>Your timezone</li>
                            </ul>
                            <br/>

                            Spotify related data:
                            <ul className={`${sectionListClass} list-disc`}>
                                <li>While your account is active we store every track you played, and when it was played.</li>
                            </ul>
                        </li>
                    </ul>
                </li>

                <li>
                    <h2 className={sectionTitleClass}>2. How We Use Your Information</h2>
                    <ul className={sectionListClass}>
                        <li>To provide and maintain our services, including customer support and responding to inquiries.</li>
                        <li>To improve our website and services by analyzing user behavior and preferences.</li>
                        <li>To communicate updates, promotions, or service-related information, if you have opted in.</li>
                    </ul>
                </li>

                <li>
                    <h2 className={sectionTitleClass}>4. Data Security</h2>
                    <ul className={sectionListClass}>
                        <li>We implement industry-standard security measures to protect your personal data from unauthorized access, alteration, or destruction.</li>
                        <li>Despite our efforts, no method of transmission over the internet or electronic storage is 100% secure.</li>
                    </ul>
                </li>

                <li>
                    <h2 className={sectionTitleClass}>5. Your Rights</h2>
                    <ul className={sectionListClass}>
                        <li>You have the right to access and delete your personal data held by us.</li>
                    </ul>
                </li>

                <li>
                    <h2 className={sectionTitleClass}>6. Changes to This Policy</h2>
                    <ul className={sectionListClass}>
                        <li>We may update this Privacy Policy. All changes will be posted on this page with an updated effective date.</li>
                    </ul>
                </li>

                <li>
                    <h2 className={sectionTitleClass}>7. Contact Us</h2>
                    <ul className={sectionListClass}>
                        <li>If you have any questions or concerns about this policy, please reach out to us at {siteConfig.supportMail}.</li>
                    </ul>
                </li>
            </ul>

            <p className={'mt-24'}>
                Policy last updated at: 20 april 2025
            </p>
        </Container>
    );
}
