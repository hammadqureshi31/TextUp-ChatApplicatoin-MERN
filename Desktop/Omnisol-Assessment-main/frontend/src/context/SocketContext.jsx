import React, { createContext, useMemo, useContext } from "react";
import { io } from "socket.io-client";
import { backendPortURL } from "../config";

const SocketContext = createContext(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  // console.log("socketprovider", socket)
  return socket;
};

export const SocketProvider = (props) => {
  const socket = useMemo(
    () =>
      io(`${backendPortURL}`, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 3,
        transports: ["websocket"],
      }),
    []
  );

  // console.log("socketprovider", socket)

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};