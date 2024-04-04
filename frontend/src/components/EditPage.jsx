/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import { Box, Button } from "rebass";
import { Input, Label } from "@rebass/forms";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { editMusic, getMusicsFetch } from "../state/musicState";

const EditPage = () => {
  const { id } = useParams();
  const { musics, isLoading } = useSelector((state) => state.musics);

  const music = musics.filter((music) => music.id == id)[0];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMusicsFetch());
  }, [dispatch]);

  const { darkMode } = useSelector((state) => state.general);

  const formStyle = css`
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    background: ${darkMode ? "black" : "white"};
    color: ${darkMode ? "white" : "black"};
  `;
  const inputStyle = css`
    width: 100%;
    margin-bottom: 20px;
  `;

  const [formData, setFormData] = useState({
    id: id,
    title: music ? music.title : "",
    artist: music ? music.artist : "",
    duration: music ? music.duration : "",
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
    dispatch(editMusic(formData));
  };

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

export default EditPage;
