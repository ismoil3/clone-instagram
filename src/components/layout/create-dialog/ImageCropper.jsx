import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button, Slider, Box } from '@mui/material';
import getCroppedImg from './cropImage'; // Утилита для получения обрезанного изображения

const ImageCropper = ({ imageSrc, onComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedArea);
      onComplete(croppedImage); // Передача результата обрезки обратно родительскому компоненту
    } catch (error) {
      console.log('Ошибка при обрезке изображения:', error);
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: 400 }}>
      <Cropper
        image={imageSrc}
        crop={crop}
        zoom={zoom}
        aspect={1} // Соотношение сторон 1:1 (например, для аватарки)
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
      />
      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          onChange={(e, newZoom) => setZoom(newZoom)}
          sx={{ width: '80%' }}
        />
        <Button variant="contained" onClick={handleCrop} sx={{ mt: 2 }}>
          Обрезать
        </Button>
      </Box>
    </Box>
  );
};

export default ImageCropper;
