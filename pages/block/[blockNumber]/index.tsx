import { GetStaticPaths, GetStaticProps, NextPage, InferGetStaticPropsType } from "next";
import Head from 'next/head';
import Link from "next/link";
import { ParsedUrlQuery } from "querystring";
import BlockDetails from "../../../components/BlockDetails";
import Layout from "../../../components/Layout";

interface Params extends ParsedUrlQuery {
    blockNumber: string,
}

interface Props {
    blockNumber: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: true
    }
}

export const getStaticProps: GetStaticProps<Props, Params> = async (context) => {
    const { blockNumber } = context.params!;

    return {
        props: {
            blockNumber: blockNumber,
        },
    }
}




const Page: NextPage<Props> = ({ blockNumber }: InferGetStaticPropsType<typeof getStaticProps>) => {
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

    const blockNumberBigInt = blockNumber !== undefined ? BigInt(blockNumber) : undefined
    return <Layout>
        <Head>
            <title>{`So Extra | Block ${blockNumber}`}</title>
            <meta
                content={`So Extra | Block ${blockNumber}`}
                name="Buy block extra data - a new SUAVE app for Goerli"
            />
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content="https://metatags.io/" />
            <meta property="twitter:title" content="Meta Tags — Preview, Edit and Generate" />
            <meta property="twitter:description" content="With Meta Tags you can edit and experiment with your content then preview how your webpage will look on Google, Facebook, Twitter and more!" />
            <meta property="twitter:image" content="https://metatags.io/images/meta-tags.png" />
            <link href="/favicon.ico" rel="icon" />
        </Head>
        <div className="flex flex-col pb-3">
            <div className="flex flex-col px-6 py-3 gap-6">
                {blockNumberBigInt !== undefined && <BlockDetails blockNumber={blockNumberBigInt} shareUrl={currentUrl} />}
                <div className="w-full text-center">
                    <Link href="/">
                        <button
                            className="px-8 py-4 text-lg rounded-full border-2 border-fuchsia-600 bg-neutral-200 hover:bg-white text-black shadow-xl shadow-indigo-950/40 hover:shadow-none"
                            type="submit"
                        >
                            <p className="font-semibold">Read More Posts</p>
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    </Layout>
}

export default Page