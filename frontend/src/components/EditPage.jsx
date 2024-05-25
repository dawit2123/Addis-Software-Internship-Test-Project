/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import { Box, Button } from "rebass";
import { Input, Label } from "@rebass/forms";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { editMusic, getMusicsFetch } from "../state/musicState";
import { useNavigate } from "react-router-dom";

const EditPage = () => {
  const navigate = useNavigate();
  const { _id } = useParams();
  const { musics } = useSelector((state) => state.musics);

  const music = musics.filter((music) => music._id == _id)[0];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMusicsFetch());
  }, [dispatch]);

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
  const [formData, setFormData] = useState({
    id: _id,
    title: music ? music.title : "",
    artistName: music ? music.artistName : "",
  });
  const [errors, setErrors] = useState({
    title: "",
    artistName: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) {
      newErrors.title = "Title is required.";
    } else if (formData.title.length < 3) {
      newErrors.title = "Music title must be at least 3 characters long.";
    } else if (formData.title.length > 20) {
      newErrors.title = "Music title must be at most 20 charactes long";
    }

    if (!formData.artistName) {
      newErrors.artistName = "Artist name is required.";
    } else if (formData.artistName.length < 2) {
      newErrors.artistName = "Artist name must be at least 2 characters long.";
    } else if (formData.artistName.length > 15) {
      newErrors.artistName = "Artist name must be at most 15 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    dispatch(editMusic(formData));
    navigate("/");
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
        {errors.title && <span style={{ color: "red" }}>{errors.title}</span>}
      </Box>
      <Box css={inputStyle}>
        <Label htmlFor="artist">Artist:</Label>
        <Input
          type="text"
          name="artistName"
          id="artistName"
          value={formData.artistName}
          onChange={handleInputChange}
        />
        {errors.artistName && (
          <span style={{ color: "red" }}>{errors.artistName}</span>
        )}
      </Box>

      <Button
        type="submit"
        color={"white"}
        backgroundColor={"green"}
        css={buttonStyle}
      >
        Save
      </Button>
    </Box>
  );
};

export default EditPage;
