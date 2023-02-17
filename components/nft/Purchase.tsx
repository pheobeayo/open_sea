import { useEffect, useState } from "react";

import { HiTag } from "react-icons/hi";
import { IoMdWallet } from "react-icons/io";
import toast, { Toaster } from "react-hot-toast";
import { BigNumber, BigNumberish } from "ethers";
import { Listing, NFT } from "../../pages/collections/[CollectionId]";

const style = {
  button: `mr-8 flex items-center py-2 px-12 rounded-lg cursor-pointer`,
  buttonIcon: `text-xl`,
  buttonText: `ml-2 text-lg font-semibold`,
};

const confirmPurchase = (toastHandler = toast) =>
  toastHandler.success(`Purchase successful!`, {
    style: {
      background: "#04111d",
      color: "#fff",
    },
  });

interface PurchaseProps {
  listings: Listing[];
  isListed: string;
  selectedNft: NFT;
  marketPlaceModule: any;
}

const Purchase = ({
  isListed,
  selectedNft,
  listings,
  marketPlaceModule,
}: PurchaseProps) => {
  const [selectedMarketNft, setSelectedMarketNft] = useState({} as NFT);
  const [enableButton, setEnableButton] = useState(false);
  const [lists] = useState(listings);

  // console.log(selectedNft.id);
  // console.log(lists);

  useEffect(() => {
    if (!listings || isListed === "false") return;

    (async () => {
      const selectedMarketNft = listings.find(
        (marketNft) => marketNft.asset?.id === selectedNft.id
      );

      // console.log("match ", selectedMarketNft);
      // @ts-ignore
      setSelectedMarketNft(selectedMarketNft);
    })();
  }, [selectedNft, lists, isListed]);

  useEffect(() => {
    if (!selectedMarketNft || !selectedNft) return;

    setEnableButton(true);
  }, [selectedMarketNft, selectedNft]);

  // console.log(selectedMarketNft);

  const buyItem = async (
    listingId = selectedNft?.id,
    quantityDesired = 1,
    module = marketPlaceModule
  ) => {
    // console.log(listingId, quantityDesired, module, "david");

    // console.log("module ", module);

    try {
      await module.buyoutListing({
        listingId: BigNumber.from(listingId),
        // quantityDesired: BigNumber.from(quantityDesired),
      });

      confirmPurchase();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex h-20 w-full items-center rounded-lg border border-[#151c22] bg-[#303339] px-12">
      <Toaster position="bottom-left" reverseOrder={false} />
      {isListed === "true" && selectedMarketNft ? (
        <>
          <div
            onClick={() => {
              enableButton ? buyItem(selectedNft?.id, 1) : null;
            }}
            className={`${style.button} bg-[#2081e2] hover:bg-[#42a0ff]`}
          >
            <IoMdWallet className={style.buttonIcon} />
            <div className={style.buttonText}>Buy Now</div>
          </div>
          <div
            className={`${style.button} border border-[#151c22]  bg-[#363840] hover:bg-[#4c505c]`}
          >
            <HiTag className={style.buttonIcon} />
            <div className={style.buttonText}>Make Offer</div>
          </div>
        </>
      ) : (
        <div className={`${style.button} bg-[#2081e2] hover:bg-[#42a0ff]`}>
          <IoMdWallet className={style.buttonIcon} />
          <div className={style.buttonText}>List Item</div>
        </div>
      )}
    </div>
  );
};

export default Purchase;
