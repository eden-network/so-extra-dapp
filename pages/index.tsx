import type { NextPage } from 'next';
import RecentBlocks from '../components/RecentBlocks';
import Layout from '../components/Layout';
import { rainbowCursor, fairyDustCursor, emojiCursor } from "cursor-effects";
import { useEffect } from "react";

const Home: NextPage = () => {
  useEffect(() => {
    new rainbowCursor({
      length: 40,
      size: 4,
      colors: ["rgb(239 68 68)", "rgb(251 146 60)", "rgb(253 224 71)", "rgb(163 230 53)", "rgb(34 211 238)", "rgb(37 99 235)", "rgb(67 56 202)"]
    })
    new fairyDustCursor({
      colors: ["rgb(239 68 68)", "rgb(251 146 60)", "rgb(253 224 71)", "rgb(163 230 53)", "rgb(34 211 238)", "rgb(37 99 235)", "rgb(67 56 202)"]
    })
    new emojiCursor({ emoji: ["🌈"] });
  }, []);

  return <Layout>
    <RecentBlocks />
  </Layout>
};

export default Home;
