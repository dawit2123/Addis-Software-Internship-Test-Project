import React from "react";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import { Flex } from "rebass";
import Sidebar from "../components/Sidebar";
import { css } from "@emotion/react";
import { useSelector } from "react-redux";

const RootLayout = ({ handleSearch }) => {
  const { darkMode } = useSelector((state) => state.general);
  return (
    <>
      <Header handleSearch={handleSearch} />
      <Flex
        css={css`
          background-color: ${darkMode ? "#404040" : "white"};
        `}
        flex={[1, 3]}
      >
        <Sidebar />
        <Outlet />
      </Flex>
    </>
  );
};

export default RootLayout;
