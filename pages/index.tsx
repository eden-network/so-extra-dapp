import type { NextPage } from 'next';
import RecentBlocks from '../components/RecentBlocks';
import Layout from '../components/Layout';
import { rainbowCursor, fairyDustCursor, emojiCursor } from "cursor-effects";
import { useEffect } from "react";

const Home: NextPage = () => {
  useEffect(() => {
    rainbowCursor({
      length: 40,
      size: 4,
      colors: ["#FF7A00", "#FFE500", "#F063F9", "#C50099", "#2114B5", "#260056"]
    })
    // new fairyDustCursor({
    //   colors: ["#FF7A00", "#FFE500", "#F063F9", "#C50099", "#2114B5", "#260056"]
    // })
    // new emojiCursor({ emoji: ["🌈"] });
  }, []);

  return <Layout>
    <RecentBlocks />
  </Layout>
};

export default Home;
