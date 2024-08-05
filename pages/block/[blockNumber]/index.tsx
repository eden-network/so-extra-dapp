import { GetStaticPaths, GetStaticProps, NextPage, InferGetStaticPropsType } from "next";
import Head from 'next/head';
import Link from "next/link";
import { ParsedUrlQuery } from "querystring";
import BlockDetails from "../../../components/BlockDetails";
import Layout from "../../../components/Layout";
import { randomInt } from "crypto";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

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
                name="Buy block extra data - a new SUAVE app"
            />
            <link href="/favicon.ico" rel="icon" />
        </Head>
        <div className="flex flex-col">
            <div className="flex flex-col">
                <div className="w-full text-left flex mb-1">
                    <Link href="/" className="group flex gap-2 items-center">
                        <ArrowLeftIcon className="group-hover:text-white w-4 h-4 text-white/60" />
                        <button
                            className="text-sm text-white/60 group-hover:text-white"
                            type="submit"
                        >
                            <p className="font-semibold">Back</p>
                        </button>
                    </Link>
                </div>
                {blockNumberBigInt !== undefined && <BlockDetails blockNumber={blockNumberBigInt} shareUrl={currentUrl} index={rndInt} />}
            </div>
        </div>
    </Layout>
}

export default Page