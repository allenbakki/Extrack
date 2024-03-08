import React, { useContext, useEffect, useState, createContext } from "react";

const GlobalContext = createContext({
  isLogggedIn: false,
  displayName: "",
  email: "",
  accessToken: "",
  refreshToken: "",
  signOut: () => {},
  updateUserDetails: () => {},
});

export const GlobalProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState({
    isLogggedIn: false,
    displayName: "",
    email: "",
    accessToken: "",
    refreshToken: "",
  });

  //this login
  const updateUserDetails = (newUserDetails) => {
    setUserDetails((prev) => {
      const updatedDetails = {
        ...prev,
        ...newUserDetails,
      };
      localStorage.setItem("userDetails", JSON.stringify(updatedDetails));
      return updatedDetails;
    });
  };

  const signOut = () => {
    localStorage.clear();
    setUserDetails({
      isLogggedIn: false,
      displayName: "",
      email: "",
      accessToken: "",
      refreshToken: "",
    });
  };
  useEffect(() => {
    const details = localStorage.getItem("userDetails");

    if (details) {
      const parseDetails = JSON.parse(details);
      setUserDetails(parseDetails);
    }
  }, []);
  return (
    <GlobalContext.Provider
      value={{ signOut, ...userDetails, updateUserDetails }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// export const useGlobalContext = () => {
//   return useContext(GlobalContext);
// };

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
