export type SuggestionType = {
  name: JSX.Element | string;
  technicalName?: string;
  buildingsList?: any[];
};

export type AutocompleteResultType = Array<SuggestionType>;

export type PropsAutocomplete = {
  t?: (key: string) => string | undefined;
  handleChangeAction: (value: string) => Promise<AutocompleteResultType>;
  handleClickAction: (item: SuggestionType) => void;
  setValueChoosed: (SuggestionType: SuggestionType) => void;
  valueChoosed?: string;
  color: string;
};

export type PropsSubListAutocomplete = {
  suggestions: AutocompleteResultType;
  handleClick: (SuggestionType: SuggestionType) => void;
  valueInput: string;
  cursor: number;
};
