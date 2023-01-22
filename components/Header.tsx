import Link from 'next/link';
import { useState } from 'react';
import Anchor from './Anchor';

export default function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="flex fixed w-full items-center justify-between px-3 pt-3 h-28">
      <div className="text-xl">
        <Link href="/">
          <h1 lang="de">Titel</h1>
          <h1 lang="en">Title</h1>
          <h1 lang="ja">見出し</h1>
        </Link>
      </div>
      <section className="flex">
        <nav>
          <button
            className="space-y-2"
            onClick={() => setIsNavOpen((prev) => !prev)}
            onKeyDown={() => setIsNavOpen((prev) => !prev)}
          >
            <span className="block h-0.5 w-8 animate-pulse bg-gray-600" />
            <span className="block h-0.5 w-8 animate-pulse bg-gray-600" />
            <span className="block h-0.5 w-8 animate-pulse bg-gray-600" />
          </button>

          <div
            className={
              isNavOpen
                ? 'flex flex-col block absolute w-screen h-screen top-0 left-0 bg-white z-10 justify-evenly items-center'
                : 'hidden'
            }
          >
            <button
              className="absolute top-0 right-0 px-8 py-8"
              onClick={() => setIsNavOpen(false)}
              onKeyDown={() => setIsNavOpen(false)}
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
              <li className="border-b border-gray-400 my-8 uppercase">
                <Anchor href="/browse">Browse</Anchor>
              </li>
              <li className="border-b border-gray-400 my-8 uppercase">
                <Anchor href="/search">Search</Anchor>
              </li>
              <li className="border-b border-gray-400 my-8 uppercase">
                <Anchor href="/impressum">Impressum</Anchor>
              </li>
            </ul>
          </div>
        </nav>
      </section>
    </div>
  );
}
