/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Box, Button, Flex, Text } from "rebass";
import { Input } from "@rebass/forms";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaPlusCircle } from "react-icons/fa";
import { FaMoon, FaSun } from "react-icons/fa";
import { toggleDarkMode } from "../state/generalState";

const logoStyle = css`
  flex: 1;
`;

const searchBarStyle = css`
  flex: 2;
  border-radius: 20px;
  color: #fff;
`;

const avatarStyle = css`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const Header = ({ handleSearch }) => {
  const { darkMode } = useSelector((state) => state.general);
  const dispatch = useDispatch();
  const headerStyle = css`
    background-color: ${darkMode ? "#404040" : "#f3f4f6"};
    color: ${darkMode ? "white" : "#000"};
    padding: 15px;
    border-bottom: 1px white solid;
  `;

  const textStyle = css`
    color: ${darkMode ? "white" : "black"};
  `;

  return (
    <Flex css={headerStyle} alignItems={"center"}>
      <Box css={logoStyle}>
        <Text fontSize="24px" fontWeight="bold">
          <Link css={textStyle} to="/">
            Addis Music
          </Link>
        </Text>
      </Box>
      <Box css={searchBarStyle}>
        <Input
          type="text"
          placeholder="Search..."
          onChange={(e) => handleSearch(e.target.value)}
          sx={{
            backgroundColor: "white",
            color: "#000",
            border: "1px solid #fff",
            borderRadius: "5px",
            padding: "10px",
            width: "100%",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        />
      </Box>

      <Box css={avatarStyle}>
        <label
          style={{ margin: "0 1.2rem" }}
          onClick={() => dispatch(toggleDarkMode(!darkMode))}
        >
          {darkMode ? <FaSun size={37} /> : <FaMoon size={37} />}
        </label>

        <Link to={"/add"}>
          <Button
            css={css`
              padding: 0;
              background-color: ${darkMode ? "#404040" : "white"};
            `}
          >
            <FaPlusCircle
              css={css`
                color: ${darkMode ? "white" : "green"};
                border-radius: 50%;
              `}
              size={40}
            />
          </Button>
        </Link>
      </Box>
    </Flex>
  );
};

export default Header;
