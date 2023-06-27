export type suggestionType = {
  name: JSX.Element | string;
  technicalName?: string;
  buildingsList?: any[];
}

export type AutocompleteResultType = Array<suggestionType>;

export type PropsAutocomplete = {
  t?: (key: string) => string | undefined;
  handleChangeAction: (value: string) => Promise<AutocompleteResultType>;
  handleClickAction: (item: suggestionType) => void;
  setValueChoosed: (suggestionType: suggestionType) => void;
  valueChoosed?:string;
  color: string;
  
}

export type PropsSubListAutocomplete = {
  suggestions: AutocompleteResultType;
  handleClick: (suggestionType: suggestionType) => void;
  valueInput: string;
  cursor: number;
}