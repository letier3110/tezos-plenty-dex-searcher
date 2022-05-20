import React from "react";
import "./App.css";

interface TzktAlias {
  address: string;
  alias?: string;
}

interface TzktContract extends TzktAlias {
  kind: string;
  typeHash: number;
}

interface TzktOriginatedOperation {
  allocationFee: number;
  bakerFee: number;
  block: string;
  contractBalance: number;
  counter: number;
  gasLimit: number;
  gasUsed: number;
  hash: string;
  id: number;
  level: number;
  originatedContract: TzktContract;
  sender: TzktAlias;
  status: string;
  storageFee: number;
  storageLimit: number;
  storageUsed: number;
  timestamp: string; //Date
  type: string;
}

function App() {
  const [data, setData] = React.useState<Array<TzktOriginatedOperation>>([]);

  const loadOriginatedContracts = React.useCallback(() => {
    fetch(
      "https://api.tzkt.io/v1/accounts/tz1NbDzUQCcV2kp3wxdVHVSZEDeq2h97mweW/operations?type=origination&limit=1000&sort=1"
    )
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  React.useEffect(() => {
    loadOriginatedContracts();
  }, [loadOriginatedContracts]);

  const sortedData = React.useMemo(
    () =>
      data.map((operation) => ({
        ...operation,
        date: new Date(operation.timestamp).setHours(0, 0, 0, 0),
      })),
    [data]
  ).sort((a, b) => b.counter - a.counter);

  const dataSection: Record<
    string,
    Array<TzktOriginatedOperation & { date: number }>
  > = React.useMemo(() => {
    const sections: Record<
      string,
      Array<TzktOriginatedOperation & { date: number }>
    > = {};
    sortedData.forEach((operation) => {
      if (!sections[operation.date]) {
        sections[operation.date] = [operation];
      } else {
        sections[operation.date] = [...sections[operation.date], operation];
      }
      return;
    });
    return sections;
  }, [sortedData]);

  return (
    <div className="App">
      <main>
        <h1>Plenty Dexes</h1>
        <section>
          {data && data.length && data.length > 0
            ? Object.keys(dataSection).map((section) => {
                const sectionData = dataSection[section];
                const dateStamp = new Date(Number(section)).toLocaleDateString(
                  "uk-UA"
                );
                console.log(section, dateStamp);
                return (
                  <div key={section}>
                    <h2>Contracts from {dateStamp}</h2>
                    {sectionData.map(({ id, originatedContract }) => {
                      return (
                        <div key={id}>
                          <div className="row">
                            {originatedContract.alias && (
                              <div className="ktAlias">
                                <strong>{originatedContract.alias}</strong>
                              </div>
                            )}
                            <div>{originatedContract.address}</div>
                          </div>
                        </div>
                      );
                    })}
                    <hr />
                  </div>
                );
              })
            : "Loading...."}
        </section>
      </main>
    </div>
  );
}

export default App;
