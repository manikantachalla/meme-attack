import React, { useState, useRef } from 'react';
import { Button, Modal, Box, Typography } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import { filter } from 'lodash';

const GifSelector = ({ gifUrls, onGifJudgement }) => {
  const gifUrlsNotNull = filter(gifUrls, function (o) {
    return o !== null;
  });
  const [currentGifIndex, setCurrentGifIndex] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const carouselRef = useRef(null);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleModalSubmit = () => {
    const selectedGif = gifUrlsNotNull[currentGifIndex];
    console.log('Selected GIF:', selectedGif);
    handleModalClose();
    onGifJudgement(selectedGif);
  };

  const handlePrevClick = () => {
    if (currentGifIndex > 0) {
      setCurrentGifIndex(currentGifIndex - 1);
    }
  };

  const handleNextClick = () => {
    if (currentGifIndex < gifUrlsNotNull.length - 1) {
      setCurrentGifIndex(currentGifIndex + 1);
    }
  };

  return (
    <div>
      <Carousel
        showThumbs={false}
        showStatus={false}
        renderArrowPrev={() => null}
        renderArrowNext={() => null}
        ref={carouselRef}
        selectedItem={currentGifIndex}
        onChange={setCurrentGifIndex}
      >
        {gifUrlsNotNull.map(
          (gif, index) =>
            gif && (
              <div key={index}>
                <img src={gif} alt={`GIF ${index}`} />
              </div>
            )
        )}
      </Carousel>
      <Box
        sx={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}
      >
        <Button
          onClick={handlePrevClick}
          disabled={currentGifIndex === 0}
          sx={{
            backgroundColor: '#ff9800',
            color: '#ffffff',
            marginRight: '8px'
          }}
        >
          Previous
        </Button>
        <Button
          onClick={handleModalOpen}
          disabled={!gifUrlsNotNull[currentGifIndex]}
          sx={{
            backgroundColor: '#ff9800',
            color: '#ffffff',
            marginRight: '8px'
          }}
        >
          Submit
        </Button>
        <Button
          onClick={handleNextClick}
          disabled={currentGifIndex === gifUrlsNotNull.length - 1}
          sx={{
            backgroundColor: '#ff9800',
            color: '#ffffff'
          }}
        >
          Next
        </Button>
      </Box>

      <Modal open={isModalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4
          }}
        >
          <Typography variant='h6' component='h2' align='center'>
            Are you sure you want to select this GIF?
          </Typography>
          <img src={gifUrlsNotNull[currentGifIndex]} alt='Selected GIF' />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '16px'
            }}
          >
            <Button
              onClick={handleModalSubmit}
              sx={{
                backgroundColor: '#ff9800',
                color: '#ffffff',
                marginRight: '8px'
              }}
            >
              OK
            </Button>
            <Button
              onClick={handleModalClose}
              sx={{
                backgroundColor: '#ff9800',
                color: '#ffffff',
                marginLeft: '8px'
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default GifSelector;
