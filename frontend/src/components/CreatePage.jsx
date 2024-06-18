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
    artistName: "",
    coverImage: null, // Initialize coverImage as null
    audioFile: null,
  });
  const [errors, setErrors] = useState({
    title: "",
    artistName: "",
    coverImage: "",
    audioFile: "",
  });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) {
      newErrors.title = "Title is required.";
    } else if (formData.title.length < 3) {
      newErrors.title = "Music title must be at least 3 characters long.";
    } else if (formData.title.length > 50) {
      newErrors.title = "Music title must be at most 50 charactes long";
    }

    if (!formData.artistName) {
      newErrors.artistName = "Artist name is required.";
    } else if (formData.artistName.length < 2) {
      newErrors.artistName = "Artist name must be at least 2 characters long.";
    } else if (formData.artistName.length > 15) {
      newErrors.artistName = "Artist name must be at most 15 characters long";
    }

    if (!formData.coverImage) {
      newErrors.coverImage = "Cover image is required.";
    } else if (
      !["image/jpeg", "image/png"].includes(formData.coverImage.type)
    ) {
      newErrors.coverImage = "Cover image must be a JPEG or PNG file.";
    } else if (formData.coverImage.size > 8 * 1024 * 1024) {
      newErrors.coverImage = "Cover image must be less than 8 MB.";
    }
    if (!formData.audioFile) {
      newErrors.audioFile = "Audio file is required.";
    } else if (formData.audioFile.type !== "audio/mpeg") {
      newErrors.audioFile = "Audio file must be an MP3 file.";
    } else if (formData.audioFile.size > 10 * 1024 * 1024) {
      newErrors.audioFile = "Audio file must be less than 10 MB.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("artistName", formData.artistName);
    formDataToSend.append("coverImage", formData.coverImage);
    formDataToSend.append("audioFile", formData.audioFile);
    dispatch(addMusic(formDataToSend));
    navigate("/");
  };

  const { darkMode } = useSelector((state) => state.general);
  const formStyle = css`
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    background: ${darkMode ? "#404040" : "white"};
    color: ${darkMode ? "white" : "black"};
  `;

  return (
    <form css={formStyle} onSubmit={handleSubmit} encType="multipart/form-data">
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
          id="artist"
          value={formData.artistName}
          onChange={handleInputChange}
        />
        {errors.artistName && (
          <span style={{ color: "red" }}>{errors.artistName}</span>
        )}
      </Box>
      <Box css={inputStyle}>
        <Label htmlFor="coverImage">Cover Image:</Label>
        <Input
          type="file"
          name="coverImage"
          id="coverImage"
          accept="image/jpeg, image/png"
          onChange={(e) => {
            setFormData({
              ...formData,
              coverImage: e.target.files[0],
            });
          }}
        />
        {errors.coverImage && (
          <span style={{ color: "red" }}>{errors.coverImage}</span>
        )}
      </Box>
      <Box css={inputStyle}>
        <Label htmlFor="audioFile">Audio File:</Label>
        <Input
          type="file"
          name="audioFile"
          id="audioFile"
          accept=".mp3"
          onChange={(e) => {
            setFormData({
              ...formData,
              audioFile: e.target.files[0],
            });
          }}
        />
        {errors.audioFile && (
          <span style={{ color: "red" }}>{errors.audioFile}</span>
        )}
      </Box>
      <Button type="submit" color={"white"} className="glow-on-hover">
        Save
      </Button>
    </form>
  );
};
export default CreatePage;
