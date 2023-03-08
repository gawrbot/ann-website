import Link from 'next/link';
import { useState } from 'react';
import useScrollDirection from '../utils/useScrollDirection';
import Anchor from './Anchor';

export default function Header() {
  // states for Hamburger menu in the top right corner
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  // custom hook to listen to scroll event and make header (dis)appear depending on direction
  const scrollDirection = useScrollDirection();

  return (
    <div
      className={`flex fixed ${
        scrollDirection === 'down' ? '-top-8 lg:-top-28' : 'top-0'
      } w-full items-center justify-between px-3 lg:pt-3 h-8 lg:h-28 transition-all duration-500 z-10`}
    >
      <div>
        <Link
          href="/"
          className="hidden lg:inline hover:animate-pulse hover:font-normal"
        >
          <h1 lang="de">Exophonieprojekt</h1>
          <h1 lang="en">Exophony Project</h1>
          <h1 lang="ja">エクソフォニー • プロジェクト</h1>
        </Link>
      </div>
      <div className="flex">
        <nav>
          {/* Hamburger-Button zum Öffnen */}
          <button
            className="space-y-2"
            onClick={() => setIsHamburgerOpen((prev) => !prev)}
            onKeyDown={() => setIsHamburgerOpen((prev) => !prev)}
          >
            <span className="block h-0.5 w-8 animate-pulse bg-gray-600" />
            <span className="lg:block lg:h-0.5 lg:w-8 lg:animate-pulse lg:bg-gray-600" />
            <span className="lg:block lg:h-0.5 lg:w-8 lg:animate-pulse lg:bg-gray-600" />
          </button>
          {/* Nav-Menü offen/nicht offen */}
          <div
            className={
              isHamburgerOpen
                ? 'flex flex-col block absolute w-screen h-screen top-0 left-0 bg-white z-10 justify-evenly items-center'
                : 'hidden'
            }
          >
            {/* Kreuz-Button zum Schließen */}
            <button
              className="absolute top-0 right-0 px-8 py-8"
              onClick={() => setIsHamburgerOpen(false)}
              onKeyDown={() => setIsHamburgerOpen(false)}
            >
              <svg
                className="h-8 w-8 text-gray-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <ul className="flex flex-col items-center justify-between min-h-[250px]">
              <li className="inline lg:hidden text-center">
                <Anchor
                  href="/"
                  className="hover:animate-pulse hover:font-normal"
                >
                  <h1 lang="de">Exophonieprojekt</h1>
                  <h1 lang="en">Exophony Project</h1>
                  <h1 lang="ja">エクソフォニー • プロジェクト</h1>
                </Anchor>
              </li>
              <li className="border-b border-gray-400 hover:font-bold lg:my-8 uppercase">
                <Anchor href="/browse">Browse</Anchor>
              </li>
              <li className="border-b border-gray-400 hover:font-bold lg:my-8 uppercase">
                <Anchor href="/search">Search</Anchor>
              </li>
              <li className="border-b border-gray-400 hover:font-bold lg:my-8 uppercase">
                <Anchor href="/impressum">Impressum</Anchor>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
}
