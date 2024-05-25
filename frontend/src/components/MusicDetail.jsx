import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Box, Button, Flex, Heading, Text } from "rebass";
import { css } from "@emotion/react";
import {
  FaPlay,
  FaPause,
  FaArrowCircleRight,
  FaArrowAltCircleLeft,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { deleteMusic, getMusicsFetch } from "../state/musicState";
import ReactPlayer from "react-player";

const MusicDetail = () => {
  const player = useRef(null); // Define player ref
  const { _id } = useParams();
  const [isPlaying, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // State to store progress of the music
  const [duration, setDuration] = useState(0); // State to store duration of the music
  const [seeking, setSeeking] = useState(false); // State to track seeking state
  const [musicUrl, setMusicUrl] = useState(""); // State to store music URL

  const { musics, isLoadingState } = useSelector((state) => state.musics);
  const { darkMode } = useSelector((state) => state.general);

  const music = musics.find((music) => music._id === _id);
  const musicIndex = musics.indexOf(music);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!music) {
      dispatch(getMusicsFetch());
    } else {
      setMusicUrl(
        `${import.meta.env.VITE_BACKEND_URL}/audio/music/${music.audioFile}`
      );
    }

    return () => {
      setMusicUrl(""); // Reset music URL
    };
  }, [dispatch, music]);

  const handleDelete = () => {
    dispatch(deleteMusic(_id));
    navigate("/");
  };

  const backgroundImagePosition = `${
    import.meta.env.VITE_BACKEND_URL
  }/img/music/${music.coverImage}.jpeg`;
  const backgroundImageUrl = `url(${backgroundImagePosition})`;

  const gradientBackground = `
    linear-gradient(
      to bottom, 
      rgba(0, 0, 0, 0.2), 
      rgba(0, 0, 0, 1)
    ), 
    ${backgroundImageUrl}`;

  const styles = css`
    background: ${gradientBackground};
    background-size: 100% 100%;
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

  // Function to format time in seconds to mm:ss format
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };
  const handleSeek = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / e.target.offsetWidth;
    setProgress(percentage);
    const newTime = percentage * duration;
    player.current.seekTo(newTime);
  };

  return (
    <>
      {isLoadingState ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 50,
          }}
        >
          <img src={loaderGif} />
        </div>
      ) : (
        <>
          {music && (
            <Box css={styles}>
              <Flex flexDirection="column" alignItems="center">
                <Button
                  onClick={handleDelete}
                  color={"red"}
                  fontWeight={"bold"}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    width: "5em",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </Button>
                <Link to={`/${_id}/edit`}>
                  <Button
                    color={"green"}
                    fontWeight={"bold"}
                    style={{
                      position: "absolute",
                      top: "50px",
                      right: "10px",
                      width: "5em",
                      cursor: "pointer",
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
                        <Text>{music.artistName}</Text>
                      </Box>
                    </Box>

                    <Box css={firstBox}>
                      <span>Total Duration:</span>
                      {music.duration}
                    </Box>
                  </Flex>
                  {/* Progress Bar with Time Showing */}
                  <div
                    style={{
                      width: "100%",
                      position: "relative",
                      marginTop: "20px",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: "20px",
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100px", // Adjust width for the time spans
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: 0,
                          backgroundColor: "black",
                        }}
                      >
                        00:00
                      </span>
                    </div>
                    {/* Starting time */}

                    <input
                      type="range"
                      value={progress}
                      max={1}
                      style={{
                        width: "calc(100% - 112px)",
                        cursor: "pointer",
                        marginLeft: "70px",
                        marginRight: "3px",
                        height: "25px",
                      }}
                      onClick={handleSeek}
                      onChange={() => {}}
                    />
                    <div
                      style={{
                        position: "absolute",
                        right: "0",
                        display: "flex",
                        justifyContent: "space-between",
                        width: "65px", // Adjust width for the time spans
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: 30,
                          backgroundColor: "black",
                          marginTop: "-26px",
                        }}
                      >
                        {formatTime(progress * duration)}
                      </span>
                    </div>
                  </div>
                  <Flex
                    justifyContent={"space-around"}
                    style={{ marginTop: "30px" }}
                  >
                    {musicIndex == 0 ? (
                      <FaArrowAltCircleLeft
                        style={{
                          color: `${
                            darkMode
                              ? "rgba(255, 255, 255, 0.2)"
                              : "rgba(0, 0, 0, 0.2)"
                          }`,
                        }}
                        size={50}
                      />
                    ) : (
                      <FaArrowAltCircleLeft
                        style={{
                          color: `${darkMode ? "white" : "black"}`,
                          cursor: "pointer",
                        }}
                        size={50}
                        onClick={() => {
                          navigate(`/${musics[musicIndex - 1]._id}`);
                        }}
                      />
                    )}

                    {isPlaying ? (
                      <FaPause
                        style={{
                          color: `${darkMode ? "white" : "black"}`,
                          cursor: "pointer",
                        }}
                        size={50}
                        onClick={() => setPlaying(false)}
                      />
                    ) : (
                      <FaPlay
                        style={{
                          color: `${darkMode ? "white" : "black"}`,
                          cursor: "pointer",
                        }}
                        size={50}
                        onClick={() => setPlaying(true)}
                      />
                    )}
                    {musicIndex < musics.length - 1 ? (
                      <FaArrowCircleRight
                        size={50}
                        style={{
                          color: `${darkMode ? "white" : "black"}`,
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          navigate(`/${musics[musicIndex + 1]._id}`);
                        }}
                      />
                    ) : (
                      <FaArrowCircleRight
                        size={50}
                        style={{
                          color: `${
                            darkMode
                              ? "rgba(255, 255, 255, 0.2)"
                              : "rgba(0, 0, 0, 0.2)"
                          }`,
                        }}
                      />
                    )}
                  </Flex>
                </Box>
              </Flex>
            </Box>
          )}
        </>
      )}
      {musicUrl && (
        <ReactPlayer
          ref={player}
          url={musicUrl}
          playing={isPlaying}
          controls={false}
          width="0"
          height="0"
          volume={1}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onProgress={(state) => {
            if (!seeking) {
              setProgress(state.played);
            }
          }}
          onDuration={(duration) => {
            setDuration(duration);
          }}
        />
      )}
    </>
  );
};

export default MusicDetail;
