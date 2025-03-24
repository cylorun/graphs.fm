import Hero from "@/components/hero";
import FAQ from "@/components/FAQ";
import Benefits from "@/components/benefits/benefits";
import Container from "@/components/container";
import Stats from "@/components/stats";
import CTA from "@/components/CTA";

const HomePage: React.FC = () => {
    return (
        <>
            <Hero/>
            <Container>
                <Benefits/>

                <Stats/>

                <FAQ/>


                <CTA/>
            </Container>
        </>
    );
};

export default HomePage;
