"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import NavLink from "../NavLink";

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isHoveredMobileButton, setIsHoveredMobileButton] =
    React.useState(false);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "API", href: "#api" },
    { name: "Pricing", href: "#pricing" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <motion.a
              href="/"
              className="text-2xl font-bold text-gradient-brand"
              animate={{ y: [0, -2, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "mirror",
              }}
            >
              TaaS
            </motion.a>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  href={link.href}
                  className="text-foreground px-3 py-2 rounded-md text-sm font-medium"
                  gradientClass="text-gradient-cyan-purple"
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>
          <div className="hidden md:block">
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-md text-sm font-medium"
                style={{
                  background: "linear-gradient(to right, #FF8C00, #A020F0)",
                  color: "white",
                }}
              >
                Get Started
              </motion.button>
            </Link>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className={`bg-background inline-flex items-center justify-center p-2 rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background ${
                isHoveredMobileButton ? "text-gradient-purple-green" : ""
              }`}
              onMouseEnter={() => setIsHoveredMobileButton(true)}
              onMouseLeave={() => setIsHoveredMobileButton(false)}
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                href={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium"
                gradientClass="text-gradient-cyan-purple"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-border">
            <div className="flex items-center px-5">
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-4 py-2 rounded-md text-sm font-medium"
                  style={{ backgroundColor: "#F97316", color: "white" }}
                >
                  Get Started
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </motion.nav>
  );
};

export default Navbar;
