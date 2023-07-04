import React, { useState, useEffect } from 'react';
import { TextField, Grid, Modal, Button } from '@mui/material';

const GiphySearch = ({ onSubmission }) => {
  const [searchText, setSearchText] = useState('');
  const [gifs, setGifs] = useState([]);
  const [selectedGif, setSelectedGif] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSelectGif = (gifUrl) => {
    setSelectedGif(gifUrl);
    setModalOpen(true);
  };

  const handleModalSubmit = () => {
    console.log('Submitted GIF:', selectedGif);
    onSubmission(selectedGif);
    setIsSubmitted(true);
    setModalOpen(false);
  };

  const handleModalCancel = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.giphy.com/v1/gifs/search?q=${searchText}&api_key=UxFeqSURyJ3ZOXCyuloJ4atDxRgtjFji`
        );
        const data = await response.json();
        setGifs(data.data);
      } catch (error) {
        console.error('Error fetching GIFs:', error);
      }
    };

    // Debounce the API call by waiting for 500ms after the user stops typing
    const debounceTimer = setTimeout(() => {
      if (searchText) {
        fetchData();
      } else {
        setGifs([]);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchText]);

  return (
    <div>
      {!isSubmitted && (
        <div>
          <TextField
            label='Search GIFs'
            value={searchText}
            onChange={handleSearchChange}
            variant='outlined'
            fullWidth
            sx={{ marginBottom: '16px' }}
          />
          <Grid container spacing={2}>
            {gifs.map((gif) => (
              <Grid item xs={6} sm={4} md={3} key={gif.id}>
                <img
                  src={gif.images.fixed_height.url}
                  alt={gif.title}
                  onClick={() => handleSelectGif(gif.images.fixed_height.url)}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </Grid>
            ))}
          </Grid>
        </div>
      )}
      <Modal open={modalOpen} onClose={handleModalCancel}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#fff',
            padding: '16px',
            borderRadius: '4px'
          }}
        >
          {selectedGif && !isSubmitted ? (
            <>
              <img
                src={selectedGif}
                alt='Selected GIF'
                style={{ width: '100%' }}
              />
              <Button
                onClick={handleModalSubmit}
                variant='contained'
                sx={{ marginRight: '8px' }}
              >
                Submit
              </Button>
              <Button onClick={handleModalCancel} variant='contained'>
                Cancel
              </Button>
            </>
          ) : (
            <p>
              Successfully submitted your answer. Let the judge decide the
              answer.
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default GiphySearch;
