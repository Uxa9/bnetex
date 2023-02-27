import React from "react";


export const BinanceContext = React.createContext({

})

export const useWebsocket = () => React.useContext(BinanceContext);