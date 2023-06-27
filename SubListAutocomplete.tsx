import React from 'react';
import { makeStyles } from '@mui/styles';
import keyGen from 'react-id-generator';
import { Typography } from '@mui/material';

import { removeDiacritics } from './utils';
import { SuggestionType, PropsSubListAutocomplete } from './types';

const useStyles = makeStyles({
  root: {
    backgroundColor: 'white',
    paddingTop: 10,
    paddingBottom: 10,
  },
  myTitleSuggestion: {
    marginLeft: '40px',
    marginTop: '20px',
  },
  myLiSuggestion: {
    color: 'var( --dark-gray)',
    paddingLeft: 10,
    fontFamily: 'arial',
    fontSize: 18,
    listStyleType: 'none',
  },
  fullSuggestion: {
    textAlign: 'start',
    display: 'flex',
    whiteSpace: 'break-spaces',
    flexWrap: 'wrap',
  },
  entityName: {
    color: 'var( --dark-light-gray)',
    marginLeft: 5,
    textDecoration: 'none',
  },
  suggestion: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'var( --medium-light-gray)',
    },
  },
  value: {
    fontFamily: 'Arial',
    fontSize: 18,
    color: 'var( --dark-gray)',
  },
  code: {
    color: 'var(--gray-text)',
    fontSize: 18,
    whiteSpace: 'pre',
  },
  active: {
    backgroundColor: '#D9D9D9',
  },
  '@media screen and (max-width: 650px)': {
    value: {
      fontSize: 16,
    },
    code: {
      fontSize: 16,
    },
  },
});

const SubListAutocomplete = (props: PropsSubListAutocomplete) => {
  const { suggestions, handleClick, valueInput, cursor } = props;
  const classes = useStyles();
  const partAutocomplete = (value: string, text: string) => {
    if (typeof text === 'object') {
      return text;
    }
    const pos = removeDiacritics(text)
      .toLowerCase()
      .indexOf(removeDiacritics(value).toLowerCase());
    const firstPart = text.substring(0, pos);
    const goal = text.substring(pos, pos + value.length);
    const secondPart = text.substring(pos + value.length);

    return (
      <div>
        <span>{firstPart}</span>
        <span>
          <b>{goal}</b>
        </span>
        <span>{secondPart}</span>
      </div>
    );
  };
  return (
    <div className={classes.root}>
      <ul test-auto="map-list-autosuggest-items">
        {suggestions.map(
          (item: SuggestionType) =>
            !(item.technicalName === 'show all suggestion') && (
              // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
              <li
                key={keyGen()}
                className={`
                ${classes.myLiSuggestion}
                ${item.technicalName !== 'no suggestion' && classes.suggestion}
                ${suggestions[cursor] === item ? classes.active : null}
              `}
                onMouseDown={() =>
                  item.name &&
                  typeof item.name === 'string' &&
                  handleClick(item)
                }
              >
                <div className={classes.fullSuggestion}>
                  <Typography className={classes.value} component="span">
                    {typeof item.name === 'string'
                      ? partAutocomplete(valueInput, item.name)
                      : item.name}
                  </Typography>
                </div>
              </li>
            )
        )}
      </ul>
    </div>
  );
};

export default SubListAutocomplete;
