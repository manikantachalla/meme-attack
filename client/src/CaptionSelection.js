import React, { useState } from 'react';
import {
  Button,
  Chip,
  Container,
  Typography,
  useMediaQuery
} from '@mui/material';
import { makeStyles } from '@mui/styles';

const options = ['Option 1', 'Option 2', 'Option 3'];

const useStyles = makeStyles((theme) => ({
  chipContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginTop: '1rem',
    marginBottom: '1rem',
    '& .MuiChip-root': {
      whiteSpace: 'normal',
      [theme.breakpoints.down('sm')]: {
        fontSize: '0.875rem'
      }
    }
  }
}));

const TagSelection = ({ onSubmission, captionOptions }) => {
  const [selectedTag, setSelectedTag] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const classes = useStyles();
  const isMobile = useMediaQuery('(max-width: 600px)');

  const handleTagClick = (tag) => {
    if (selectedTag === tag) {
      setSelectedTag('');
    } else {
      setSelectedTag(tag);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    onSubmission(selectedTag);
  };

  const handleReset = () => {
    setSelectedTag('');
    setIsSubmitted(false);
  };

  return (
    <Container>
      <Typography variant='h6'>Select a Tag:</Typography>
      <div className={classes.chipContainer}>
        {captionOptions.map((option) => (
          <Chip
            key={option}
            label={option}
            color={selectedTag === option ? 'primary' : 'default'}
            onClick={() => handleTagClick(option)}
            style={{ marginRight: '0.5rem' }}
            size={isMobile ? 'small' : 'medium'}
          />
        ))}
      </div>
      <div>
        {!isSubmitted && (
          <div>
            <Button variant='contained' onClick={handleReset}>
              Reset
            </Button>
            <Button
              variant='contained'
              color='primary'
              onClick={handleSubmit}
              style={{ marginLeft: '1rem' }}
            >
              Submit
            </Button>
          </div>
        )}
        {isSubmitted && (
          <Typography variant='subtitle1' color='textSecondary'>
            Submitted: {selectedTag}
          </Typography>
        )}
      </div>
    </Container>
  );
};

export default TagSelection;
