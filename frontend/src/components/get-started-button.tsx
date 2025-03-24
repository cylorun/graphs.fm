import React from "react";
import Link from "next/link";


const GetStartedButton: React.FC = () => {

    return (
        <Link href="/start" className="text-black bg-primary hover:bg-primary-accent px-8 py-3 rounded-full transition-colors">
            Get started
        </Link>
    )
}

export default GetStartedButton