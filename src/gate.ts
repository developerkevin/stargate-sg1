import {GetBlockByNumberResult} from "@etclabscore/ethereum-json-rpc";
import {EthGetTransactionByHash} from "@etclabscore/ethereum-json-rpc/build";
import {StarClass} from "./star";

export interface IGateCredit {
  fromClient: StarClass;
  sender: string;
  value: string;
}

const getOutstandingCredits = (client: StarClass, addr: string): IGateCredit[] => {
  const block = client.latestBlock;
  const credits: IGateCredit[] = [];

  if (!block || !block.transactions) {
    return [];
  }

  // tslint:disable-next-line:no-console
  console.log("goerli.txs", block.transactions);

  for (let i = 0; i < block.transactions.length; i++) {
    const t = block.transactions[i];
    if (t !== null) {
      if (typeof t === "string") {
        client.getTransaction(t)
          .then((tx) => {
            if (tx) {
              if (addr === tx.to) {
                credits.push({
                  fromClient: client,
                  sender: tx.from || "",
                  value: tx.value || "",
                });
              }
            }
          });
      } else  {
        if (addr === t.to) {
          credits.push({
            fromClient: client,
            sender: t.from || "",
            value: t.value || "",
          });
        }
      }
    }
  }

  return credits;
}

export default {
  getOutstandingCredits,
};
