/* import type { NextPage } from 'next' */
import Head from 'next/head'
import Image from 'next/image'
import Sidebar from '../components/Sidebar'
import Center from '../components/Center'

const Home = () => {
  return (
    <div className="h-screen overflow-hidden bg-black">
      <Head>
        <title>Create Next App</title>
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <main className="flex">
        <Sidebar />
        <Center />
      </main>

      <div>{/* Player */}</div>
    </div>
  )
}

export default Home
