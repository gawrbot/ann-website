import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useRef } from 'react';
import Layout from '../components/Layout';
import { scrollContext } from '../components/ScrollContext';

export default function App({ Component, pageProps }: AppProps) {
  // useRef will return the 'current' object storing the scroll position (--> stored when the 'all robots' page is loaded and passed in the value property of the userContext provider)
  const scrollRef = useRef({
    scrollPos: 0,
  });

  return (
    <Layout>
      <scrollContext.Provider value={{ scrollRef: scrollRef }}>
        <Component {...pageProps} />
      </scrollContext.Provider>
    </Layout>
  );
}
