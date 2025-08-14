import { Aptos, AptosConfig, Network, Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";
import 'dotenv/config';

const APTOS_NETWORK = process.env.APTOS_NETWORK || Network.LOCAL;
const SERVER_PRIVATE_KEY = process.env.SERVER_WALLET_PRIVATE_KEY;

const aptosConfig = new AptosConfig({ network: APTOS_NETWORK });
const aptos = new Aptos(aptosConfig);

const privateKey = new Ed25519PrivateKey(SERVER_PRIVATE_KEY);
const serverAccount = Account.fromPrivateKey({ privateKey });
const MODULE_ADDRESS = serverAccount.accountAddress.toString();

export const createProposalOnChain = async (applicant, requestedAmount, description) => {
    const transaction = await aptos.transaction.build.simple({
        sender: serverAccount.accountAddress,
        data: {
            function: `${MODULE_ADDRESS}::aidefund::create_proposal`,
            functionArguments: [
                applicant,
                Buffer.from(description, 'utf-8'),
                requestedAmount * 10**8,
            ],
        },
    });

    try {
        const committedTx = await aptos.signAndSubmitTransaction({
            signer: serverAccount,
            transaction,
        });

        // FIX: Capture the result of waitForTransaction in a new variable.
        const transactionResponse = await aptos.waitForTransaction({ transactionHash: committedTx.hash });

        // FIX: Now, find the event on the new `transactionResponse` object.
        const event = transactionResponse.events.find(
            (e) => e.type === `${MODULE_ADDRESS}::aidefund::ProposalCreatedEvent`
        );

        if (event) {
            return { success: true, onChainId: parseInt(event.data.proposal_id, 10) };
        } else {
            throw new Error("ProposalCreatedEvent not found in transaction events.");
        }
    } catch (error) {
        console.error("Failed to create proposal on-chain:", error);
        return { success: false, error };
    }
};