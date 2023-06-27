import React, {
  useState, useRef, useEffect, KeyboardEvent, RefObject, ChangeEvent
} from 'react'

import { makeStyles } from '@mui/styles'

import SearchIcon from './static/searchIcon.svg'

import Close from '@mui/icons-material/Close';

import {
  Input,
  InputAdornment,
  Grid,
  List
} from "@mui/material"

import { suggestionType, AutocompleteResultType, PropsAutocomplete } from './types'

import SubListAutocomplete from './SubListAutocomplete'

const useStyles = makeStyles({
  root: {
    '& input.MuiInputBase-input.MuiInput-input.MuiInputBase-inputAdornedEnd.css-1x51dt5-MuiInputBase-input-MuiInput-input':{
      paddingTop: 0
    }
  },
  inputAutocomplete: {
    backgroundColor: '#fff',
    padding: 10,
    width: '100%',
    color: 'var( --dark-gray)',
    border:'1px solid #A2A2A2',
    borderRadius: 8,
    fontWeight: 'bold',
    [`& > div`]: {
      marginTop: '0 !important'
    },
    fontSize: 15,
    fontFamily: 'arial',
    height: 39,
    '& ::placeholder': {
      color: '#B8B8B8',
      opacity: 1,
      fontWeight: 'normal'
    }
  },
  containSuggestion: {
    [`& ul`]: {
      listStyleType: 'none',
      padding: 0,
      margin: 0,
      zIndex: 1
    }
  },
  seeMore: {
    color: '#A67F17',
    cursor: 'pointer'
  },
  noSuggestion: {
    cursor: 'auto',
    color: 'var( --dark-light-gray)'
  },
  title: {
    fontFamily: 'Futura LT Pro Bold'
  },
  searchValue: {
    fontFamily: 'Arial',
    marginLeft: '5px'
  },
  rootModal: {
    width: 596,
    height: 374,
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white'
  },
  containerModal: {
    margin: '25px 17px 33px 27px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  containerSuggestionModal: {
    marginLeft: '-10px',
    width: '100%',
    height: 290,
    overflowY: 'auto',
    overflowX: 'hidden',
    '& ul': {
      paddingLeft: 0
    }
  },
  containerHeaderModal: {
    marginBottom: 5,
    position: 'relative'
  },
  containerHeaderTitle: {
    width: '90%',
    color: 'var( --dark-gray)',
    fontSize: 24,
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  closeModal: {
    color: 'var( --dark-gray)',
    position: 'absolute',
    right: 6,
    cursor: 'pointer',
    top: 0
  },
  '@media screen and (max-width: 650px)': {
    rootModal: {
      width: '80%',
      height: 'auto'
    },
    containerHeaderTitle: {
      fontSize: '21px'
    }
  }
})

const Autocomplete = (props: PropsAutocomplete) => {
  const classes = useStyles()
  const [allSuggestions, setAllSuggestions] = useState<AutocompleteResultType>([])
  const [suggestions, setSuggestions] = useState<AutocompleteResultType>([])

  const [cursor, setCursor] = useState(0)
  const [valueInput, setValueInput] = useState('')
  const [display, setDisplay] = useState(false)
  const [open, setOpen] = useState(false)
  const [focus, setFocus] = useState(false)

  console.log('test')
  const inputRef: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const {
    t, // translation method
    handleClickAction,
    handleChangeAction,
    valueChoosed,
    color
  } = props

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const dataAutocomplete = (data: AutocompleteResultType) => {
    let result: AutocompleteResultType = []
    if (data.length !== 0) {
      setAllSuggestions(data)
      if (data.length > 5) {
        // show only 5 suggestion and "more"
        result = data.slice(0, 5)
        result.push({
          name: (
            <div
              className={classes.seeMore}
              onClick={() => handleOpen()}
              test-auto="map-list-autosuggest-item-seeMore"
              style={{
                color
              }}

            >
              {t ? t('view_all_results') : 'voir tous les résultats'}
            </div>
          ),
          technicalName: 'show all suggestion'
        })
        setSuggestions(result)
      } else {
        setSuggestions(data)
      }
    } else {
      // no suggestion
      result.push({
        name: (
          <div className={classes.noSuggestion}>
            {t ? '... ' + t('no_result') : '... aucun résultat'}
          </div >
        ),
        technicalName: 'no suggestion'
      })
      setSuggestions(result)
      setAllSuggestions([])
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {
      value
    } = e.target
    setValueInput(value)
    // show suggestion for 3 letter
    if (value.length >= 5) {
      setCursor(0)
      handleChangeAction(value).then((res: AutocompleteResultType) => {
        dataAutocomplete(res)
        setDisplay(true)
      })
    } else {
      setDisplay(false)
    }
  }

  const handleClick = (item: suggestionType) => {
    handleClickAction(item)
    if(typeof item.name == "string"){
      setValueInput(item.name)
    }
    setValueChoosed(item)
      setDisplay(false)
      handleClose()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // reset
    const inputValue = (e.target as HTMLInputElement).value
    if (e.key == 'Escape') {
      setDisplay(false)
      setSuggestions([])
      setValueInput(10)
    }
    // key enter
    if (inputValue.length >= 3 && (e.key === 'Enter')) {
      if (suggestions[cursor].technicalName === 'show all suggestion') {
        handleOpen()
      } else if (suggestions[cursor].technicalName !== 'no suggestion' && suggestions[cursor].name) {
        handleClick(suggestions[cursor])
      }
    }
    // key Arrow up/down
    if (e.key === 'ArrowUp' && cursor > 0) {
      setCursor(cursor - 1)
    } else if (e.key === 'ArrowDown' && cursor < suggestions.length - 1) {
      setCursor(cursor + 1)
    }
  }

    const onFocus = () => {
      setFocus(true)
    }
    const onBlur = () => {
      setFocus(false)
    }


  
  useEffect(() => {
    if (focus) {
      if (inputRef && inputRef.current) {
        inputRef.current.focus()
      }
    }
  }, [focus])

  useEffect(() => {
    valueChoosed && setValueInput(valueChoosed)
  }, [valueChoosed])

  const modalContent = (
    <div className={classes.rootModal}>
      <div className={classes.containerModal}>
        <div className={classes.containerHeaderModal} >
          <Close
            className={classes.closeModal}
            onClick={() => handleClose()}
          />
          <div className={classes.containerHeaderTitle} >
            <span className={classes.title}>
              {t ? `${t('results_for')} : `: 'résultats pour : '}
            </span>
            <span className={classes.searchValue}>
              {`${valueInput}`}
            </span>
          </div>
        </div>
        <div className={classes.containerSuggestionModal}>
          <SubListAutocomplete
            suggestions={allSuggestions}
            handleClick={handleClick}
            valueInput={valueInput}
            cursor={cursor}
          />
        </div>
      </div>
    </div>
  )
  return (
    <div className={classes.root} id="inputAdress">
      <div>
        <div className={classes.containSuggestion}>
          <Input
            className={`
              ${classes.inputAutocomplete} `}
            test-auto="map-input-autosuggest"
            onChange={handleChange}
            placeholder={t ? t('enter_an_address') : 'Saisissez une adresse'}
            disableUnderline
            onKeyDown={(e:KeyboardEvent<HTMLInputElement>) => handleKeyDown(e)}
            inputRef={inputRef}
            onBlur={onBlur}
            onFocus={onFocus}
            endAdornment={
              <InputAdornment
                position="end"
                disablePointerEvents
              >
                <img
                  src={SearchIcon}
                  alt="search"
                />
              </InputAdornment>
            }
            value={valueInput}
          />
          {display ? (
            <Grid
              container
            >
              <Grid item xs={12}>
                <List>
                  <SubListAutocomplete
                    suggestions={suggestions}
                    handleClick={handleClick}
                    valueInput={valueInput}
                  />
                </List>
              </Grid>
            </Grid>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default Autocomplete
