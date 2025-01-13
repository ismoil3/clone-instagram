'use client'
import React, { useState, useRef } from "react";
import { IconButton } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SendIcon from "@mui/icons-material/Send";

const Audio = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioPlayerRef = useRef(null);

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        const chunks = [];
        mediaRecorderRef.current.ondataavailable = (event) => {
          chunks.push(event.data);
        };
        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/wav" });
          const url = URL.createObjectURL(blob);
          setAudioBlob(blob);
          setAudioUrl(url);
        };
        mediaRecorderRef.current.start();
        setIsRecording(true);
      })
      .catch((err) => console.log("Error accessing microphone", err));
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const togglePlayback = () => {
    if (isPlaying) {
      audioPlayerRef.current.pause();
    } else {
      audioPlayerRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const sendAudioMessage = () => {
    // Handle sending the audio (e.g., uploading to a server)
    console.log("Sending audio message...");
  };

  return (
    <div className="">
      <div className="flex items-center ">
        {/* Voice Message Controls */}
        {!isRecording ? (
          <IconButton onClick={startRecording}>
            <MicIcon />
          </IconButton>
        ) : (
          <IconButton onClick={stopRecording}>
            <StopIcon />
          </IconButton>
        )}

        {/* Playback Button */}
        {audioUrl && (
          <IconButton onClick={togglePlayback}>
            {isPlaying ? <StopIcon /> : <PlayArrowIcon />}
          </IconButton>
        )}

       

        {/* Hidden audio element for playback */}
        <audio ref={audioPlayerRef} src={audioUrl} />
      </div>
    </div>
  );
};

export default Audio;
