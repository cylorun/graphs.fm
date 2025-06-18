import React from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const GetStartedButton: React.FC = () => {
    return (
        <a
            href={`${API_URL}/auth/spotify/login`}
            className="text-black bg-primary hover:bg-primary-accent px-8 py-3 rounded-full transition-colors"
        >
            Get started
        </a>
    );
};

export default GetStartedButton