import Link from 'next/link';

export default function Footer() {
  return (
    <div className="fixed bottom-0 left-0 text-center text-white px-3 pb-3 h-8 z-10 lg:text-black lg:text-lg">
      <Link href="/impressum">Impressum</Link>
    </div>
  );
}
