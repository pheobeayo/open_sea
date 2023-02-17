import type { NextPage } from "next";
import { useWeb3 } from "@3rdweb/hooks";
import toast, { Toaster } from "react-hot-toast";

import Header from "../components/Header";
import Hero from "../components/Hero";
import { useEffect, useRef } from "react";
import { client } from "../lib/sanityClient";

const style = {
  wrapper: ``,
  walletConnectWrapper: `flex flex-col justify-center items-center h-screen w-screen bg-[#3b3d42] `,
  button: `border border-[#282b2f] bg-[#2081e2] p-[0.8rem] text-xl font-semibold rounded-lg cursor-pointer text-black`,
  details: `text-lg text-center text=[#282b2f] font-semibold mt-4`,
};

interface IuserDoc {
  _type: string;
  _id: string;
  userName: string;
  walletAddress: string;
}

const Home: NextPage = () => {
  const { address, connectWallet } = useWeb3();

  const isMountedRef = useRef(false);

  const welcomeUser = (userName: string, toastHandler = toast) => {
    toastHandler.success(
      `Welcome back${userName !== "Unnamed" ? ` ${userName}` : ""}!`,
      {
        style: {
          background: "#04111d",
          color: "#fff",
        },
      }
    );
  };

  useEffect(() => {
    if (!address) return;

    const userDoc: IuserDoc = {
      _type: "users",
      _id: address,
      userName: "Unnamed",
      walletAddress: address,
    };

    const addUserToSanityDB = async (userDoc: IuserDoc) => {
      const result = await client.createIfNotExists(userDoc);

      welcomeUser(result.userName);
    };

    if (!isMountedRef.current) {
      addUserToSanityDB(userDoc);

      return () => {
        isMountedRef.current = true;
      };
    }
  }, [address]);

  return (
    <>
      <div className={style.wrapper}>
        <Toaster position="top-center" reverseOrder={false} />
        {address ? (
          <>
            <Header />
            <Hero />
          </>
        ) : (
          <div className={style.walletConnectWrapper}>
            <button
              className={style.button}
              onClick={() => connectWallet("injected")}
            >
              Connect Wallet
            </button>
            <div className={style.details}>
              You need Chrome to be
              <br /> able to run this app.
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
