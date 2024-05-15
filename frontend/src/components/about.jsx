/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Text } from "rebass";
import { Label } from "@rebass/forms";

const AboutPage = () => {
  const navigate = useNavigate();
  const { darkMode } = useSelector((state) => state.general);

  const formStyle = css`
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    background: ${darkMode ? "#404040" : "white"};
    color: ${darkMode ? "white" : "black"};
  `;
  const inputStyle = css`
    width: 100%;
    margin-bottom: 20px;
  `;
  const buttonStyle = css`
    cursor: pointer;
    background-image: linear-gradient(to right, #12c2e9, #c471ed, #f64f59);
  `;
  const handleSubmit = () => {
    navigate("/");
  };
  return (
    <Box as="form" css={formStyle} onSubmit={handleSubmit}>
      <Box css={inputStyle}>
        <h1 htmlFor="artist">Dawit Zewdu</h1>
        <h2>
          This is a basic CRUD Addis Music project made by Dawit for the Addis
          Internship Test Project
        </h2>
      </Box>

      <Button
        type="submit"
        color={"white"}
        backgroundColor={"green"}
        css={buttonStyle}
      >
        Go To Home
      </Button>
    </Box>
  );
};

export default AboutPage;
