require('dotenv').config();

const fs = require('fs');
// const pinataSDK = require('@pinata/sdk');
// const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_API_KEY);
const lootData = require('@loot3d/data/loot.json');
const path = require('path');

const NUM_CREATURES = 8000;

const metadataTemplate = {
  name: '',
  image: '',
  animation_url: '',
  external_url: '',
  background_color: '000000',
  description: 'Loot 3D is the first collection of 3D character for loot metaverse.',
  attributes: [],
};

function makeMetadata(imageIPFSHash, modalIPFSHash) {
  for (let i = 0; i < NUM_CREATURES; i++) {
    const tokenId = i + 1;
    const bag = lootData[i][tokenId];

    const attributes = [];
    for (const key in bag) {
      attributes.push({
        trait_type: key,
        value: bag[key],
      });
    }

    const metadata = {
      ...metadataTemplate,
      name: `Character #${tokenId}`,
      image: `https://ipfs.io/ipfs/${imageIPFSHash}/${tokenId}.png`,
      animation_url: `https://ipfs.io/ipfs/${modalIPFSHash}/${tokenId}.glb`,
      external_url: `https://loot3d.com/?bagNumber=${tokenId}`,
      attributes,
    }

    const savePath = path.join(__dirname, `../output/tokens/${tokenId}`);
    fs.writeFileSync(savePath, JSON.stringify(metadata));

    console.log(`Wrote metadata for bag #${tokenId}`);
  }
}

async function main() {
  try {
    // const imageResult = await pinata.pinFromFS('./output/images/', {});
    // const modelResult = await pinata.pinFromFS('./output/models/', {});
    // const bagResult = await pinata.pinFromFS('./output/tokens/', {});
    // console.log(modelResult.IpfsHash);

    makeMetadata(process.env.IPFS_IMAGES_CID, process.env.IPFS_MODELS_CID);
  } catch (err) {
    console.log(err);
  }
}

main();
