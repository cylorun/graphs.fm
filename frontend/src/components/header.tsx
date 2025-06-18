'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { HiOutlineXMark, HiBars3 } from 'react-icons/hi2';

import Container from './container';
import { siteConfig } from '@/config/siteConfig';
import { menuItems } from '@/config/menuItems';
import GetStartedButton from "@/components/get-started-button";
import api, {API_BASE_URL} from "@/util/api";
import {PublicUser} from "@shared/types";
import { useSession } from '@/context/session-context';

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const {user} = useSession();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="bg-transparent fixed top-0 left-0 right-0 md:absolute z-50 mx-auto w-full">
            <Container className="!px-0">
                <nav className="shadow-md md:shadow-none bg-background   md:bg-transparent mx-auto flex justify-between items-center py-2 px-5 md:py-10">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <img src={'/images/logo.png'} alt={"logo"} className="text-foreground min-w-fit size-10" />
                        <span className="manrope text-xl font-semibold text-foreground cursor-pointer">
                            {siteConfig.siteName}
                        </span>
                        <h2 className="inline-flex items-center justify-center gap-1 px-4 py-1.5 text-sm font-semibold tracking-wide text-black bg-gradient-to-tr from-[#1db954] to-[#1ed760] rounded-full shadow-md ring-1 ring-black/10">
                            WIP
                        </h2>
                    </Link>

                    {/* Desktop Menu */}
                    <ul className="hidden md:flex space-x-6">
                        {menuItems.map(item => (
                            <li key={item.text}>
                                <Link href={item.url} className="text-foreground hover:text-foreground-accent transition-colors">
                                    {item.text}
                                </Link>
                            </li>
                        ))}
                        <li className={'border-r border-r-gray-500'}></li>
                        {user ? (
                            <>
                                <li>
                                    <Link href={`/user/${user.username}`} className="text-foreground hover:text-foreground-accent transition-colors">
                                        Profile
                                    </Link>
                                </li>
                                <li>
                                    <a href={`${API_BASE_URL}/auth/logout`} className="text-foreground hover:text-foreground-accent transition-colors">
                                        Log out
                                    </a>
                                </li>
                            </>

                        ) : (
                            <li>
                                <GetStartedButton />
                            </li>
                        )}
                    </ul>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            type="button"
                            className="bg-primary text-black focus:outline-none rounded-full w-10 h-10 flex items-center justify-center"
                            aria-controls="mobile-menu"
                            aria-expanded={isOpen}
                        >
                            {isOpen ? (
                                <HiOutlineXMark className="h-6 w-6" aria-hidden="true" />
                            ) : (
                                <HiBars3 className="h-6 w-6" aria-hidden="true" />
                            )}
                            <span className="sr-only">Toggle navigation</span>
                        </button>
                    </div>
                </nav>
            </Container>

            {/* Mobile Menu with Transition */}
            <Transition
                show={isOpen}
                enter="transition ease-out duration-200 transform"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-75 transform"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <div id="mobile-menu" className="md:hidden bg-background shadow-lg">
                    <ul className="flex flex-col space-y-4 pt-1 pb-6 px-6">
                        {menuItems.map(item => (
                            <li key={item.text}>
                                <Link href={item.url} className="text-foreground hover:text-primary block" onClick={toggleMenu}>
                                    {item.text}
                                </Link>
                            </li>
                        ))}
                        {/* Conditionally render "Get Started" or Profile Link */}
                        <li className={'border-t border-t-gray-400'}></li>
                        {user ? (
                            <>
                                <li>
                                    <Link href={`/user/${user.username}`} className="text-foreground hover:text-foreground-accent transition-colors">
                                        Profile
                                    </Link>
                                </li>
                                <li>
                                    <a href={`${API_BASE_URL}/auth/logout`} className="text-foreground hover:text-foreground-accent transition-colors">
                                        Log out
                                    </a>
                                </li>
                            </>

                        ) : (
                            <li>
                                <GetStartedButton />
                            </li>
                        )}
                    </ul>
                </div>
            </Transition>
        </header>
    );
};

export default Header;
