import type { NextPage } from 'next';
import RecentBlocks from '../components/RecentBlocks';
import Layout from '../components/Layout';
import Onboarding from '../components/Onboarding';

const Home: NextPage = () => {
  return <Layout>
    <RecentBlocks />
  </Layout>
};

export default Home;
