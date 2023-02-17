import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";

import Header from "../../components/Header";
import NFTImage from "../../components/nft/NFTImage";
import { Listing, NFT } from "../collections/[CollectionId]";
import GeneralDetails from "../../components/nft/GeneralDetails";
import ItemActivity from "../../components/nft/ItemActivity";
import Purchase from "../../components/nft/Purchase";

const style = {
  wrapper: `flex flex-col items-center container-lg text-[#e5e8eb]`,
  container: `container p-6`,
  topContent: `flex`,
  nftImgContainer: `flex-2 mr-4`,
  detailsContainer: `flex-[2] ml-4`,
};

const Nft = () => {
  const router = useRouter();
  const { provider } = useWeb3();
  const [selectedNFT, setSelectedNFT] = useState({} as NFT);
  const [listings, setListings] = useState<Listing[]>([]);

  const isListed = router.query.isListed as string;

  const NFTModule = useMemo(() => {
    if (!provider) return;

    const sdk = new ThirdwebSDK(
      provider.getSigner(),
      // @ts-ignore
      "https://eth-goerli.g.alchemy.com/v2/iSWp-fXs_yuGC3lyL8TYMC60YWW226EL"
    );

    return sdk.getNFTModule("0x8f62D6a14Ea9cCA3779b120B7a096294e0e2ff0b");
  }, [provider]);

  // get all NFTs in the collection
  useEffect(() => {
    if (!NFTModule) return;

    (async () => {
      const nfts = await NFTModule.getAll();

      const selectedNFT = nfts.find(
        (nft) => nft.id === router.query.Nft
      ) as NFT;

      setSelectedNFT(selectedNFT);
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

  return (
    <div>
      <Header />
      <div className={style.wrapper}>
        <div className={style.container}>
          <div className={style.topContent}>
            <div className={style.nftImgContainer}>
              <NFTImage selectedNFT={selectedNFT} />
            </div>

            <div className={style.detailsContainer}>
              <GeneralDetails selectedNFT={selectedNFT} />
              <Purchase
                isListed={isListed}
                selectedNft={selectedNFT}
                listings={listings}
                marketPlaceModule={marketplaceModule}
              />
            </div>
          </div>
          <ItemActivity />
        </div>
      </div>
    </div>
  );
};

export default Nft;
