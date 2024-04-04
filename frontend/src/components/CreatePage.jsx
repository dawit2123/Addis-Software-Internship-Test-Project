/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState } from "react";
import { Box, Button } from "rebass";
import { Input, Label } from "@rebass/forms";
import { useDispatch, useSelector } from "react-redux";
import { addMusic } from "../state/musicState";
import { useNavigate } from "react-router-dom";

const inputStyle = css`
  width: 100%;
  margin-bottom: 20px;
`;

const CreatePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    duration: "",
    // coverImage: "/album-cover.jpg",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addMusic(formData));
    navigate("/");
  };

  const { darkMode } = useSelector((state) => state.general);
  const formStyle = css`
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    background: ${darkMode ? "black" : "white"};
    color: ${darkMode ? "white" : "black"};
  `;

  return (
    <Box as="form" css={formStyle} onSubmit={handleSubmit}>
      <Box css={inputStyle}>
        <Label htmlFor="title">Title:</Label>
        <Input
          type="text"
          name="title"
          id="title"
          value={formData.title}
          onChange={handleInputChange}
        />
      </Box>
      <Box css={inputStyle}>
        <Label htmlFor="artist">Artist:</Label>
        <Input
          type="text"
          name="artist"
          id="artist"
          value={formData.artist}
          onChange={handleInputChange}
        />
      </Box>
      <Box css={inputStyle}>
        <Label htmlFor="duration">Duration:</Label>
        <Input
          type="text"
          name="duration"
          id="duration"
          value={formData.duration}
          onChange={handleInputChange}
        />
      </Box>
      <Button type="submit" color={"white"} backgroundColor={"green"}>
        Save
      </Button>
    </Box>
  );
};

export default CreatePage;
