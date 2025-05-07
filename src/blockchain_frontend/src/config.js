console.log("Environment variables:", {
  BLOCKCHAIN_BACKEND: process.env.CANISTER_ID_BLOCKCHAIN_BACKEND,
  NFT: process.env.CANISTER_ID_NFT,
  II: process.env.CANISTER_ID_INTERNET_IDENTITY
});


export const CANISTER_IDS = {
  BLOCKCHAIN_BACKEND: process.env.CANISTER_ID_BLOCKCHAIN_BACKEND,
  NFT: process.env.CANISTER_ID_NFT,
  II: process.env.CANISTER_ID_INTERNET_IDENTITY
};





//const isLocal = import.meta.env.VITE_DFX_NETWORK === "local";

// export const HOST = isLocal ? "http://localhost:4943" : "https://ic0.app";

// export const AUTH_CONFIG = {
//   identityProvider: isLocal
//     ? `http://${import.meta.env.VITE_INTERNET_IDENTITY_CANISTER_ID}.localhost:4943/`
//     : "https://identity.ic0.app/#authorize"
// };