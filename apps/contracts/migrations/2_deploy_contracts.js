const Loot3D = artifacts.require('Loot3D');

require('dotenv').config();

const TOKEN_URI = `https://ipfs.io/ipfs/${process.env.IPFS_TOKENS_CID}/`;

module.exports = async function (deployer) {
  await deployer.deploy(Loot3D, TOKEN_URI);
};
