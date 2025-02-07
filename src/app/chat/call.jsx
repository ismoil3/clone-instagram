"use client"

import { useState, useRef, useEffect } from "react"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material"
import VideocamIcon from "@mui/icons-material/Videocam"
import VideocamOffIcon from "@mui/icons-material/VideocamOff"
import CloseIcon from "@mui/icons-material/Close"

const LocalVideoCall = () => {
  const [isCallActive, setIsCallActive] = useState(false)
  const [stream, setStream] = useState(null)
  const videoRef = useRef(null)

  const startCall = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      setStream(mediaStream)
      setIsCallActive(true)
    } catch (error) {
      console.error("Error accessing media devices:", error)
    }
  }

  const endCall = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
    }
    setStream(null)
    setIsCallActive(false)
  }

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  return (
    <>
      <IconButton onClick={startCall} color="primary">
        <VideocamIcon />
      </IconButton>

      <Dialog open={isCallActive} onClose={endCall} maxWidth="md" fullWidth>
        <DialogTitle>
          Local Video Call
          <IconButton
            aria-label="close"
            onClick={endCall}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: "100%", maxHeight: "70vh", objectFit: "contain" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={endCall} color="secondary" variant="contained" startIcon={<VideocamOffIcon />}>
            End Call
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default LocalVideoCall

