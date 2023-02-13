import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Head from 'next/head';

type ImpressumType = {
  [index: string]: any;
  mainText: string;
};

type Props =
  | {
      impressum: ImpressumType[];
    }
  | { error: string };

async function getImpressum() {
  const res = await fetch(
    `https://cdn.contentful.com/spaces/${process.env.SPACE_ID}/environments/master/entries?access_token=${process.env.ACCESS_TOKEN}&content_type=impressum`,
  ).then((resp) => resp.json());

  const impressum = res.items;

  return impressum;
}

export default function Impressum(props: Props) {
  if ('error' in props) {
    return (
      <>
        <h1>Something went wrong 👀</h1>
        <p>{props.error}</p>
      </>
    );
  }
  return (
    <div className="h-[80vh] lg:h-screen">
      <Head>
          <title>Impressum</title>
          <meta name="description" content="Exophony - Impressum" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
      <div className="bg-white px-10 py-5 justify-items-center mr-0 mb-5 lg:mx-auto lg:mt-16 h-auto w-2/3 lg:w-1/2">
        <h1>Impressum</h1>
        {props.impressum.map((impressum: ImpressumType) => {
          return (
            <div key="impressum">
              {documentToReactComponents(impressum.fields.mainText)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const impressum = await getImpressum();

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
