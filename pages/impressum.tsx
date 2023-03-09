import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { ImpressumType, PropsImpressum } from '../utils/types';

const contentful = require('contentful');

const renderOptions = {
  renderNode: {
    [INLINES.EMBEDDED_ENTRY]: (node: any) => {
      return (
        <Link
          className="hover:font-bold"
          href={`/${node.data.target.fields.slug}`}
        >
          {node.data.target.fields.title}
        </Link>
      );
    },
    [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
      return (
        <Image
          className="inline mb-2"
          src={`https://${node.data.target.fields.file.url}`}
          height="18"
          width="18"
          alt={node.data.target.fields.description}
        />
      );
    },
  },
};

export default function Impressum(props: PropsImpressum) {
  if ('error' in props) {
    return (
      <>
        <h1>Something went wrong 👀</h1>
        <p>{props.error}</p>
      </>
    );
  }
  return (
    <div className="w-[80vh] absolute right-[27rem] -top-[22rem] lg:mx-40 lg:h-screen lg:w-auto lg:relative lg:right-auto lg:top-auto">
      <Head>
        <title>Impressum</title>
        <meta name="description" content="Exophony - Impressum" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-white px-10 pt-5 pb-12 overflow-auto justify-items-center mr-0 mb-5 h-auto lg:w-1/2 lg:mx-auto lg:mt-16">
        <h1 className="mb-2 font-bold">Impressum</h1>
        {props.impressum.map((impressum: ImpressumType) => {
          return (
            <div key="impressum">
              {documentToReactComponents(
                impressum.fields.mainText,
                renderOptions,
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const client = await contentful.createClient({
    space: process.env.SPACE_ID,
    accessToken: process.env.ACCESS_TOKEN,
  });

  const impressum = await client
    .getEntries({
      content_type: 'impressum',
    })
    .then((response: ImpressumType) => response.items)
    .catch(console.error);

  if (typeof impressum === 'undefined') {
    return {
      props: {
        error: 'Fetching the impressum from the CMS seems to have failed',
      },
    };
  }
  return {
    props: { impressum },
  };
}
