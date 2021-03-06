import React from "react";
import "./App.css";
import OriginatedContract from "./OriginatedContract";
import { Tab, TzktOriginatedOperation } from "./types";

const TABS = [
  {
    name: "Plenty",
    value: "tz1NbDzUQCcV2kp3wxdVHVSZEDeq2h97mweW",
  },
  {
    name: "Youves",
    value: "tz1TkUbh7oW8AdAUkoqKpCsCLk9894KZfLBM",
  },
  {
    name: "FlameDEX",
    value: "tz1hpGLqt7g55NYtryP2wx1sPLV6CG6A6bZn",
  },
];

const size = 1000;

function App() {
  const [data, setData] = React.useState<Array<TzktOriginatedOperation>>([]);
  const [tab, setTab] = React.useState<Tab>(TABS[0]);

  const loadOriginatedContracts = React.useCallback((selectedTab: string) => {
    fetch(
      `https://api.tzkt.io/v1/accounts/${selectedTab}/operations?type=origination&limit=${size}&sort=1`
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
                    {sectionData.map((contract) => {
                      return (
                        <OriginatedContract
                          key={contract.id}
                          originatedContract={contract}
                        />
                      );
                    })}
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
