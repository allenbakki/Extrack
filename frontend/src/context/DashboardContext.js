import React, { createContext, useContext, useState } from "react";

const DashboardContext = createContext({});

export const DashboardProvider = ({ children }) => {
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);

  console.log(typeof friends);

  return (
    <DashboardContext.Provider
      value={{
        setFriends,
        friends,
        groups,
        setGroups,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => {
  return useContext(DashboardContext);
};
