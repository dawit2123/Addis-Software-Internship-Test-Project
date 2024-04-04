import { css } from "@emotion/react";
import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Box, Flex, Text } from "rebass";
// import { toggleDarkMode } from "../state/generalState";

const sectionTitleStyle = css`
  padding: 10px;
  border-top: 1px solid #444;
  border-bottom: 1px solid #444;
`;

const sidebarItemStyle = css`
  padding: 10px;
  cursor: pointer;

  &:hover {
    background-color: #444;
  }
`;

const Sidebar = () => {
  const dispatch = useDispatch();

  const { darkMode } = useSelector((state) => state.general);
 
  const sidebarStyle = css`
    width: 250px;
    background-color: ${darkMode ? "black" : "#f3f4f6"};
    color: ${darkMode ? "white" : "#000"};
    min-height: 90vh;
    padding-top: 20px;
  `;
  return (
    <Flex css={sidebarStyle} flexDirection='column'>
      <Box css={sectionTitleStyle}>
        <Text fontWeight='bold'>Library</Text>
      </Box>

      <Box css={sidebarItemStyle}>
        <Text>Home</Text>
      </Box>
      <Box css={sidebarItemStyle}>
        <Text>About</Text>
      </Box>

      <Box css={sectionTitleStyle}>
        <Text fontWeight='bold'>Playlists</Text>
      </Box>
      <Box css={sidebarItemStyle}>
        <Text>Playlist 1</Text>
      </Box>
      <Box css={sidebarItemStyle}>
        <Text>Playlist 2</Text>
      </Box>
      <Box css={sidebarItemStyle}>
        <Text>Playlist 3</Text>
      </Box>
      <Box
        
        css={css`
          display: flex;
          align-self: center;
          margin-top: 30px;
        `}>
      </Box>
    </Flex>
  );
};

export default Sidebar;
