require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "hyperspace",
  networks: {
    hyperspace: {
      chainId: 3141,
      url: "https://api.hyperspace.node.glif.io/rpc/v1",
      accounts: ['20569c8e9f9cb6c459f9f869d4f0aaaa2f18fb4b7b147bcbe80c9a6763f9bd73'],
    },
  }
};
