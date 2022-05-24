import React from "react";
import {
  BcdContractStorage,
  BcdOriginatedContract,
  TzktContract,
  TzktOriginatedOperation,
} from "./types";

interface OriginatedContractProps {
  originatedContract: TzktOriginatedOperation;
}

const triggerFields = [
  {
    name: "^token1*",
  },
  {
    name: "^token2*",
  },
];

const OriginatedContract: React.FC<OriginatedContractProps> = ({
  originatedContract,
}) => {
  const [bcdMetadata, setMetadataa] =
    React.useState<BcdOriginatedContract | null>(null);
  const [bcdStorage, setStorage] = React.useState<BcdContractStorage | null>(
    null
  );
  const [unfold, setFold] = React.useState<boolean>(false);
  const { originatedContract: contract } = originatedContract;

  const loadBcdInfo = React.useCallback((contract: TzktContract) => {
    fetch(`https://api.better-call.dev/v1/contract/mainnet/${contract.address}`)
      .then((res) => res.json())
      .then((json) => setMetadataa(json));
  }, []);

  const loadBcdStorage = React.useCallback((contract: TzktContract) => {
    fetch(
      `https://api.better-call.dev/v1/contract/mainnet/${contract.address}/storage`
    )
      .then((res) => res.json())
      .then((json) => setStorage(json[0]));
  }, []);

  React.useEffect(() => {
    if (!contract.alias) {
      loadBcdInfo(contract);
      loadBcdStorage(contract);
    }
  }, [loadBcdInfo, loadBcdStorage, contract]);

  const handleClick = () => {
    setFold(!unfold);
  };

  const bcdTrigger = React.useMemo(() => {
    if (!bcdStorage) return [];
    if (!bcdStorage.children) return [];
    return bcdStorage.children.filter((field) =>
      triggerFields.some((x) => RegExp(x.name).test(field.name))
    );
  }, [bcdStorage]);

  const dexScore = React.useMemo(() => {
    if (!bcdStorage) return { text: "0", value: 0 };
    if (!bcdStorage.children) return { text: "0", value: 0 };
    const value = (bcdTrigger.length / bcdStorage.children.length) * 100;
    return { text: value.toFixed(2), value };
  }, [bcdStorage, bcdTrigger]);

  const dexPrediction = React.useMemo(
    () => ({
      text: `${dexScore.text}%`,
      detailedText:
        dexScore.value > 40
          ? "Definetely DEX"
          : dexScore.value > 19
          ? "Possibly DEX"
          : "not a DEX",
      className:
        dexScore.value > 40
          ? "yesDex"
          : dexScore.value > 19
          ? "possiblyDex"
          : "notDex",
    }),
    [dexScore]
  );

  return (
    <div
      className={["item"].join(" ")}
      id={contract.address}
      onClick={handleClick}
    >
      <div className="row">
        {contract.alias && (
          <div className="ktAlias">
            <strong>{contract.alias}</strong>
          </div>
        )}
        {bcdMetadata && bcdMetadata.alias && (
          <div className="bcdAlias">
            <strong>{bcdMetadata.alias}</strong>
          </div>
        )}
        <div>{contract.address}</div>
      </div>
      <div className="row">
        <div className={["badge", dexPrediction.className].join(" ")}>
          {dexPrediction.detailedText}
        </div>
        {contract.alias && (
          <div className="badge tzkt">
            <strong>TZKT alias</strong>
          </div>
        )}
        {bcdMetadata && bcdMetadata.alias && (
          <div className="badge bcd">
            <strong>BCD alias</strong>
          </div>
        )}
        <div className="badge assetType">
          {contract.kind === "asset" ? "Asset" : "Smart Contract"}
        </div>
      </div>
      {bcdStorage && bcdStorage.children && bcdTrigger && (
        <div className="column">
          {bcdTrigger.map((field) => (
            <div key={`${contract.address}_${field.name}`}>
              <strong>{field.name} :</strong>
              {field.value}
            </div>
          ))}
        </div>
      )}
      <div className="row">
        <a
          target={"_blank"}
          rel="noopener noreferrer"
          href={`https://tzkt.io/${contract.address}/operations/`}
          className="contractLink"
        >
          tzkt
        </a>
        <a
          target={"_blank"}
          rel="noopener noreferrer"
          href={`https://better-call.dev/mainnet/${contract.address}/storage`}
          className="contractLink"
        >
          bcd
        </a>
      </div>
    </div>
  );
};

export default OriginatedContract;
