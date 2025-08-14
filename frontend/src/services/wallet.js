// services/wallet.js

import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

// --- CONFIGURATION ---
// ⚠ Make sure this matches the address from your published testnet Move module
const MODULE_ADDRESS = "0xbefdd983391e6b4c1fe18ec63c2556e3cdbe83e7534f2eda547267b767775182";

// Testnet config
const aptosConfig = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(aptosConfig);

// --- WALLET CONNECTION ---
export const connectWallet = async () => {
  if (!window.aptos) {
    return { status: "error", message: "Aptos wallet not found. Please install Petra." };
  }
  try {
    const response = await window.aptos.connect();
    return { status: "success", address: response.address };
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return { status: "error", message: "Connection rejected by user." };
  }
};

// Utility to sign and submit any transaction
const signAndSubmit = async (payload) => {
  try {
    const pendingTx = await window.aptos.signAndSubmitTransaction({ payload });
    await aptos.waitForTransaction({ transactionHash: pendingTx.hash });
    return { success: true, hash: pendingTx.hash };
  } catch (error) {
    console.error("Transaction failed:", error);
    return { success: false, error };
  }
};

// --- MODULE CALLS ---
export const depositFunds = async (amountInOctas) => {
  if (!window.aptos) return { success: false, error: "Aptos wallet not found!" };

  const payload = {
    type: "entry_function_payload",
    function: `${MODULE_ADDRESS}::aidefund::deposit`,
    arguments: [amountInOctas.toString()], // pass as string
    type_arguments: []
  };

  return await signAndSubmit(payload);
};

export const voteOnProposal = async (proposalId, inFavor) => {
  if (!window.aptos) return { success: false, error: "Aptos wallet not found!" };

  const payload = {
    type: "entry_function_payload",
    function: `${MODULE_ADDRESS}::aidefund::vote`,
    arguments: [proposalId.toString(), inFavor],
    type_arguments: []
  };

  return await signAndSubmit(payload);
};

export const tallyVotesOnChain = async (proposalId) => {
  if (!window.aptos) return { success: false, error: "Aptos wallet not found!" };

  const payload = {
    type: "entry_function_payload",
    function: `${MODULE_ADDRESS}::aidefund::tally_votes`,
    arguments: [proposalId.toString()],
    type_arguments: []
  };

  return await signAndSubmit(payload);
};

export const claimInitialFunds = async (proposalId) => {
  if (!window.aptos) return { success: false, error: "Aptos wallet not found!" };

  const payload = {
    type: "entry_function_payload",
    function: `${MODULE_ADDRESS}::aidefund::claim_funds`,
    arguments: [proposalId.toString()],
    type_arguments: []
  };

  return await signAndSubmit(payload);
};
