import Hero from "@/components/hero";
import Testimonials from "@/components/testimonials";
import Pricing from "@/components/pricing/pricing";
import FAQ from "@/components/FAQ";
import Logos from "@/components/logos";
import Benefits from "@/components/benefits/benefits";
import Container from "@/components/container";
import Section from "@/components/section";
import Stats from "@/components/stats";
import CTA from "@/components/CTA";

const HomePage: React.FC = () => {
    return (
        <>
            <Hero/>
            <Logos/>
            <Container>
                <Benefits/>

                <Section
                    id="pricing"
                    title="Pricing"
                    description="Simple, transparent pricing. No surprises."
                >
                    <Pricing/>
                </Section>

                <Section
                    id="testimonials"
                    title="What Our Clients Say"
                    description="Hear from those who have partnered with us."
                >
                    <Testimonials/>
                </Section>

                <FAQ/>

                <Stats/>

                <CTA/>
            </Container>
        </>
    );
};

export default HomePage;
