import type { NextPage } from 'next';
import RecentBlocks from '../components/RecentBlocks';
import Layout from '../components/Layout';
import { rainbowCursor } from "cursor-effects";
import { useEffect } from "react";

const Home: NextPage = () => {
  useEffect(() => {
    new rainbowCursor()
  }, []);

  return <Layout>
    <RecentBlocks />
  </Layout>
};

export default Home;
