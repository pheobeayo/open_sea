import React, { useState } from "react";
import { IoMdSnow } from "react-icons/io";
import { AiOutlineHeart } from "react-icons/ai";

import { NFT } from "../../pages/collections/[CollectionId]";

interface NFTImageProps {
  selectedNFT: NFT;
}

const style = {
  topBar: `bg-[#303339] p-2 rounded-t-lg border-[#151c22] border`,
  topBarContent: `flex items-center`,
  likesCounter: `flex-1 flex items-center justify-end`,
};

const NFTImage = ({ selectedNFT }: NFTImageProps) => {

  return (
    <>
      <div className={style.topBar}>
        <div className={style.topBarContent}>
          <IoMdSnow />
          <div className={style.likesCounter}>
            <AiOutlineHeart />
            2.3k
          </div>
        </div>
      </div>
      <div className="">
        <img src={selectedNFT.image} alt="" />
      </div>
    </>
  );
};

export default NFTImage;
