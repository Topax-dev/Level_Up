import { DiscIcon, Facebook, Github, Youtube } from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-6 lg:gap-10">
          <div className="space-y-4 sm:col-span-2 lg:col-span-2">
            <h1 className="text-2xl font-bold">LevelUp.</h1>
            <p className="text-sm leading-6 max-w-md">
              High quality coding education maintained by an open source
              community.
            </p>
            
            <div className="flex gap-4 pt-2">
              <Link 
                href="#" 
                aria-label="Github"
                className="transition-colors duration-200"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link 
                href="#" 
                aria-label="Youtube"
                className="transition-colors duration-200"
              >
                <Youtube className="h-5 w-5" />
              </Link>
              <Link 
                href="#" 
                aria-label="Facebook"
                className="transition-colors duration-200"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link 
                href="#" 
                aria-label="Discord"
                className="transition-colors duration-200"
              >
                <DiscIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="sm:col-span-1">
            <h3 className="text-sm font-semibold leading-6 mb-4">
              About Us
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  href="/about" 
                  className="transition-colors duration-200"
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  href="/team" 
                  className="transition-colors duration-200"
                >
                  Team
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog" 
                  className="transition-colors duration-200"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  href="/success_stories" 
                  className="transition-colors duration-200"
                >
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          <div className="sm:col-span-1">
            <h3 className="text-sm font-semibold leading-6 mb-4">
              Support
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  href="/faq" 
                  className="transition-colors duration-200"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link 
                  href="/contribute" 
                  className="transition-colors duration-200"
                >
                  Contribute
                </Link>
              </li>
              <li>
                <Link 
                  href="/about#contact-us" 
                  className="transition-colors duration-200"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="sm:col-span-1">
            <h3 className="text-sm font-semibold lea mb-4">
              Guides
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  href="/guides/community" 
                  className="transition-colors duration-200"
                >
                  Community Guides
                </Link>
              </li>
              <li>
                <Link 
                  href="/guides/installation" 
                  className="transition-colors duration-200"
                >
                  Installation Guides
                </Link>
              </li>
            </ul>
          </div>

          <div className="sm:col-span-1">
            <h3 className="text-sm font-semibold lea mb-4">
              Legal
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  href="/terms" 
                  className="transition-colors duration-200"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy" 
                  className="transition-colors duration-200"
                >
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} LevelUp. All rights reserved.
            </p>
            <p className="text-sm text-gray-400">
              Made with ❤️ by the community
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;