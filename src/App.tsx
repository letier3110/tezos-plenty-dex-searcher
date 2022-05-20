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

interface Tab {
  name: string;
  value: string;
}

const TABS = [
  {
    name: "Plenty",
    value: "tz1NbDzUQCcV2kp3wxdVHVSZEDeq2h97mweW",
  },
  {
    name: "Youves",
    value: "tz1TkUbh7oW8AdAUkoqKpCsCLk9894KZfLBM",
  },
];

function App() {
  const [data, setData] = React.useState<Array<TzktOriginatedOperation>>([]);
  const [tab, setTab] = React.useState<Tab>(TABS[0]);

  const loadOriginatedContracts = React.useCallback((selectedTab: string) => {
    fetch(
      `https://api.tzkt.io/v1/accounts/${selectedTab}/operations?type=origination&limit=1000&sort=1`
    )
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  React.useEffect(() => {
    loadOriginatedContracts(tab.value);
  }, [loadOriginatedContracts, tab.value]);

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
        <h1>Deployed {tab.name} Dexes</h1>
        <select
          onChange={(e) => {
            const selectedTab = e.target.value as string;
            const foundTab = TABS.find(
              (tab) => tab.value === selectedTab
            ) as Tab;
            setTab(foundTab);
            document.title = `${foundTab.name} dexes`;
          }}
        >
          {TABS.map((tab) => (
            <option key={tab.value} value={tab.value}>
              {tab.name}
            </option>
          ))}
        </select>
        <section>
          {data && data.length && data.length > 0
            ? Object.keys(dataSection).map((section) => {
                const sectionData = dataSection[section];
                const dateStamp = new Date(Number(section)).toLocaleDateString(
                  "uk-UA"
                );
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
                            <a
                              target={"_blank"}
                              rel="noopener noreferrer"
                              href={`https://tzkt.io/${originatedContract.address}/operations/`}
                              className="contractLink"
                            >
                              tzkt
                            </a>
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
