import Head from "next/head";
import Layout from "../components/Layout";
import styles from "../styles/Home.module.css";

export default function Home() {
  return <Layout>Home</Layout>;
}

export async function getStaticProps() {
  // Using the variables below in the browser will return `undefined`. Next.js doesn't
  // expose environment variables unless they start with `NEXT_PUBLIC_`
  // console.log('[Node.js only] ENV_VARIABLE:', process.env.ENV_VARIABLE)
  // console.log("[Node.js only] ENV_LOCAL_VARIABLE:", process.env.SRIPE_KEY);

  return { props: {} };
}
