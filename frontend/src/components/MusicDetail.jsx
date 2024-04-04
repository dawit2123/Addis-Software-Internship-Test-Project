import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Box, Button, Flex, Heading, Text } from "rebass";
import { css } from "@emotion/react";
import {
  FaPlay,
  FaPause,
  FaArrowAltCircleLeft,
  FaArrowCircleRight,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "react-spinner";
import { deleteMusic, editMusic, getMusicsFetch } from "../state/musicState";

const MusicDetail = () => {
  const { id } = useParams();

  const [isPlaying, setPlaying] = useState(true);

  const { musics, isLoading } = useSelector((state) => state.musics);

  const { darkMode } = useSelector((state) => state.general);

  const music = musics.filter((music) => music.id == id)[0];

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    if (!music) {
      dispatch(getMusicsFetch());
    }
  }, [dispatch, music]);

  const handleDelete = () => {
    dispatch(deleteMusic(id));
    navigate("/");
  };

  const backgroundImageUrl = "url(/album-cover.jpg)";

  const gradientBackground = `
    linear-gradient(
      to bottom, 
      rgba(0, 0, 0, 0.2), 
      rgba(0, 0, 0, 1)
    ), 
    ${backgroundImageUrl}`;

  const styles = css`
    background: ${gradientBackground};
    background-size: 100% auto;
    background-position: center;
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    position: relative;
  `;

  const boardStyle = css`
    position: absolute;
    background-color: ${darkMode ? "black" : "white"};
    bottom: 0;
    right: 0;
    left: 0;
    height: 200px;
    padding: 20px;
    opacity: 1;
  `;

  const firstBox = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: ${darkMode ? "white" : "#000"};
    gap: 20px;
  `;

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {music && (
            <Box css={styles}>
              <Flex flexDirection="column" alignItems="center">
                <Button
                  onClick={() => handleDelete()}
                  color={"red"}
                  fontWeight={"bold"}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    width: "5em",
                  }}
                >
                  Delete
                </Button>
                <Link to={`/${id}/edit`}>
                  <Button
                    color={"green"}
                    fontWeight={"bold"}
                    style={{
                      position: "absolute",
                      top: "50px",
                      right: "10px",
                      width: "5em",
                    }}
                  >
                    Edit
                  </Button>
                </Link>

                <Box css={boardStyle}>
                  <Flex flex={[1, 1]} justifyContent={"space-between"}>
                    <Box css={firstBox}>
                      <img
                        style={{ borderRadius: "10px" }}
                        // src={"/album-cover.jpg"}
                        width={50}
                      />
                      <Box>
                        <Heading>{music.title}</Heading>
                        <Text>{music.artist}</Text>
                      </Box>
                    </Box>

                    <Box css={firstBox}>{music.duration}</Box>
                  </Flex>

                  <Flex
                    justifyContent={"space-around"}
                    style={{ marginTop: "30px" }}
                  >
                    <Link to={id - 1 > 0 ? `/${parseInt(id) - 1}` : `/${id}`}>
                      <FaArrowAltCircleLeft
                        style={{ color: `${darkMode ? "white" : "black"}` }}
                        size={50}
                      />
                    </Link>
                    {isPlaying ? (
                      <FaPlay
                        style={{ color: `${darkMode ? "white" : "black"}` }}
                        size={50}
                        onClick={() => setPlaying(!isPlaying)}
                      />
                    ) : (
                      <FaPause
                        style={{ color: `${darkMode ? "white" : "black"}` }}
                        size={50}
                        onClick={() => setPlaying(!isPlaying)}
                      />
                    )}
                    <Link
                      to={
                        id < musics.length ? `/${parseInt(id) + 1}` : `/${id}`
                      }
                    >
                      <FaArrowCircleRight
                        size={50}
                        style={{ color: `${darkMode ? "white" : "black"}` }}
                      />
                    </Link>
                  </Flex>
                </Box>
              </Flex>
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default MusicDetail;
