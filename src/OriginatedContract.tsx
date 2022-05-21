import React from "react";
import {
  BcdOriginatedContract,
  TzktContract,
  TzktOriginatedOperation,
} from "./types";

interface OriginatedContractProps {
  originatedContract: TzktOriginatedOperation;
}

const OriginatedContract: React.FC<OriginatedContractProps> = ({
  originatedContract,
}) => {
  const [data, setData] = React.useState<BcdOriginatedContract | null>(null);
  const { originatedContract: contract } = originatedContract;

  const loadBcdInfo = React.useCallback((contract: TzktContract) => {
    fetch(`https://api.better-call.dev/v1/contract/mainnet/${contract.address}`)
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  React.useEffect(() => {
    if (!contract.alias) {
      loadBcdInfo(contract);
    }
  }, [loadBcdInfo, contract]);

  return (
    <div>
      <div className="row">
        {contract.alias && (
          <div className="ktAlias">
            <strong>{contract.alias}</strong>
          </div>
        )}
        {data && data.alias && (
          <div className="bcdAlias">
            <strong>{data.alias}</strong>
          </div>
        )}
        <div>{contract.address}</div>
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
