import { useRouter } from "next/router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";
import { client } from "../../lib/sanityClient";
import { CgWebsite } from "react-icons/cg";
import { AiOutlineInstagram, AiOutlineTwitter } from "react-icons/ai";
import { HiDotsVertical } from "react-icons/hi";

import Header from "../../components/Header";
import NFTCard from "../../components/NFTCard";

interface Collection {
  id: string;
  title: string;
  volumeTraded: string;
  contractAddress: string;
  floorPrice: string;
  description: string;
  creator: string;
  imageUrl: string;
  bannerImageUrl: string;
  allOwners: any[];
}

export interface NFT {
  id: string;
  image: string;
  name: string;
  background_color: string;
  description: string;
  external_url: string;
  uri: string;
  likes: string;
}

export interface Listing {
  asset: NFT;
  price?: number;
}

const style = {
  bannerImageContainer: `h-[20vh] w-screen overflow-hidden flex justify-center items-center`,
  bannerImage: `w-full object-cover`,
  infoContainer: `w-screen px-4`,
  midRow: `w-full flex justify-center text-white`,
  endRow: `w-full flex justify-end text-white`,
  profileImg: `w-40 h-40 object-cover rounded-full border-2 border-[#202225] mt-[-4rem]`,
  socialIconsContainer: `flex text-3xl mb-[-2rem]`,
  socialIconsWrapper: `w-44`,
  socialIconsContent: `flex container justify-between text-[1.4rem] border-2 rounded-lg px-2`,
  socialIcon: `my-2`,
  divider: `border-r-2`,
  title: `text-5xl font-bold mb-4`,
  createdBy: `text-lg mb-4`,
  statsContainer: `w-[44vw] flex justify-between py-4 border border-[#151b22] rounded-xl mb-4`,
  collectionStat: `w-1/4`,
  statValue: `text-3xl font-bold w-full flex items-center justify-center`,
  ethLogo: `h-6 mr-2`,
  statName: `text-lg w-full text-center mt-1`,
  description: `text-[#8a939b] text-xl w-max-1/4 flex-wrap mt-4`,
};

const Collection = () => {
  const isMountedRef = useRef(false);

  const { provider } = useWeb3();
  const router = useRouter();
  const CollectionId = router.query?.CollectionId as string;

  const [collection, setCollection] = useState({} as Collection);
  const [NFTs, setNFTs] = useState<NFT[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);

  const NFTModule = useMemo(() => {
    if (!provider) return;

    const sdk = new ThirdwebSDK(
      provider.getSigner(),
      // @ts-ignore
      "https://eth-goerli.g.alchemy.com/v2/iSWp-fXs_yuGC3lyL8TYMC60YWW226EL"
    );

    return sdk.getNFTModule(CollectionId);
  }, [provider]);

  // get all NFTs in the collection
  useEffect(() => {
    if (!NFTModule) return;

    (async () => {
      const nfts = await NFTModule.getAll();

      // @ts-ignore
      setNFTs(nfts);
    })();
  }, [NFTModule]);

  const marketplaceModule = useMemo(() => {
    if (!provider) return;

    const sdk = new ThirdwebSDK(
      provider.getSigner(),
      // @ts-ignore
      "https://eth-goerli.g.alchemy.com/v2/iSWp-fXs_yuGC3lyL8TYMC60YWW226EL"
    );

    return sdk.getMarketplaceModule(
      "0xC9737e07aFD576b651528284E4E6BE4f841d28d7"
    );
  }, [provider]);

  // get all listings in the collection
  useEffect(() => {
    if (!marketplaceModule) return;

    (async () => {
      const listings = await marketplaceModule.getAllListings();
      // @ts-ignore
      setListings(listings);
    })();
  }, [marketplaceModule]);

  console.log("listings ", listings);

  const fetchCollectionData = async (sanityClient = client) => {
    const query = `*[_type == "marketItems" && contractAddress == "${CollectionId}"]{
  title,
  volumeTraded,
  contractAddress,
  floorPrice,
  description,
  "creator": createdBy->userName,
  "imageUrl": profileImage.asset->url,
  "bannerImageUrl": bannerImage.asset->url,
  "owners": owners[]->
}`;

    try {
      const collectionData = await sanityClient.fetch(query);

      // console.log("data ", collectionData);

      setCollection(collectionData[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!isMountedRef.current) {
      fetchCollectionData();

      return () => {
        isMountedRef.current = true;
      };
    }
  }, [CollectionId]);

  // console.log(collection.floorPrice);

  return (
    <div className="overflow-hidden">
      <Header />

      <div className={style.bannerImageContainer}>
        <img
          className={style.bannerImage}
          src={
            collection?.bannerImageUrl
              ? collection?.bannerImageUrl
              : "https://via.placeholder.com/200"
          }
          alt="banner"
        />
      </div>

      <div className={style.infoContainer}>
        <div className={style.midRow}>
          <img
            className={style.profileImg}
            src={
              collection?.imageUrl
                ? collection?.imageUrl
                : "https://via.placeholder.com/200"
            }
            alt="profile-image"
          />
        </div>

        <div className={style.endRow}>
          <div className={style.socialIconsContainer}>
            <div className={style.socialIconsWrapper}>
              <div className={style.socialIconsContent}>
                <div className={style.socialIcon}>
                  <CgWebsite />
                </div>

                <div className={style.divider}></div>
                <div className={style.socialIcon}>
                  <AiOutlineInstagram />
                </div>

                <div className={style.divider}></div>
                <div className={style.socialIcon}>
                  <AiOutlineTwitter />
                </div>

                <div className={style.divider}></div>
                <div className={style.socialIcon}>
                  <HiDotsVertical />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={style.midRow}>
          <div className={style.title}>{collection?.title}</div>
        </div>

        <div className={style.midRow}>
          <div className={style.createdBy}>
            Created By{" "}
            <span className="text-[#2081e2]">{collection?.creator}</span>
          </div>
        </div>

        <div className={style.midRow}>
          <div className={style.statsContainer}>
            <div className={style.collectionStat}>
              <div className={style.statValue}>{NFTs.length}</div>
              <div className={style.statName}>Items</div>
            </div>

            <div className={style.collectionStat}>
              <div className={style.statValue}>
                {collection?.allOwners ? collection?.allOwners.length : "0"}
              </div>
              <div className={style.statName}>Owners</div>
            </div>

            <div className={style.collectionStat}>
              <div className={style.statValue}>
                <img
                  src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg"
                  alt="eth"
                  className={style.ethLogo}
                />
                {collection?.floorPrice}
              </div>
              <div className={style.statName}>Floor Price</div>
            </div>

            <div className={style.collectionStat}>
              <div className={style.statValue}>
                <img
                  src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg"
                  alt="eth"
                  className={style.ethLogo}
                />
                {collection?.volumeTraded}.5k
              </div>
              <div className={style.statName}>Volume Traded</div>
            </div>
          </div>
        </div>

        <div className={style.midRow}>
          <div className={style.description}>{collection?.description}</div>
        </div>
      </div>

      <div className="flex flex-wrap">
        {NFTs.map((ntfItem, id) => (
          <NFTCard
            key={id}
            nftItem={ntfItem}
            title={collection?.title}
            listings={listings}
          />
        ))}
      </div>
    </div>
  );
};

export default Collection;
