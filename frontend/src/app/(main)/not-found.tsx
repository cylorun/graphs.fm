import Container from "@/components/container";
import React from "react";


const NotFound: React.FC = () => {
    return (
        <>
            {/*<Hero></Hero>*/}
            <Container className="relative flex items-center justify-center min-h-screen pb-0 pt-32 md:pt-40 px-5">
                The page your are looking for doesn&apos;t exist
            </Container>

        </>
    )
}


export default NotFound