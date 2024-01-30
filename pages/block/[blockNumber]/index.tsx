import { GetStaticPaths, GetStaticProps, NextPage, InferGetStaticPropsType } from "next";
import Head from 'next/head';
import Link from "next/link";
import { ParsedUrlQuery } from "querystring";
import BlockDetails from "../../../components/BlockDetails";
import Layout from "../../../components/Layout";
import { randomInt } from "crypto";

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


const rndInt = Math.floor(Math.random() * 40) + 1

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
            <link href="/favicon.ico" rel="icon" />
        </Head>
        <div className="flex flex-col pb-3">
            <div className="flex flex-col px-6 py-3 gap-6">
                {blockNumberBigInt !== undefined && <BlockDetails blockNumber={blockNumberBigInt} shareUrl={currentUrl} index={rndInt} />}
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