import React, { ChangeEvent, EventHandler, ReactNode, SyntheticEvent, useCallback } from 'react';
import styled, { css, StyledComponentBase } from 'styled-components';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import debounce from 'lodash.debounce';
import { Div, Input as InputElement, TextArea } from '../../htmlElements';
import { SubcomponentPropsType } from '../commonTypes';
import { useColors } from '../../context';
import { disabledStyles } from '../../utils/color';

const Container = styled(Div)`
  ${({ disabled = false, isValid }: { disabled?: boolean; isValid?: boolean }) => {
    const { destructive, grayMedium, background } = useColors();
    return `
      border 2px solid ${isValid === false ? destructive : grayMedium};
      min-width: 10rem;
      position: relative;
      display: flex;
      flex-flow: row;
      border-radius: 0.25em;
      background-color: ${background};
      ${disabled ? disabledStyles() : ''}
  `;
  }}
`;

const TextInputContainer = styled(InputElement)`
  ${() => {
    const { transparent } = useColors();
    return `
      border: 0 none;
      flex-grow: 1;
      outline: 0 none;
      height: 2em;
      font-size: 1em;
      padding: 0.5rem;
      background-color: ${transparent};
  `;
  }}
`;

const TextAreaInputContainer = styled(TextArea)`
  ${({ multiLineIsResizable }: TextInputProps) => {
    const { transparent } = useColors();
    return `
      border: 0 none;
      flex-grow: 1;
      outline: 0 none;
      font-size: 1em;
      min-height: 2em;
      min-width: 0px;
      padding: .5rem;
      background-color: ${transparent};
      resize: ${multiLineIsResizable ? 'both' : 'none'};
    `;
  }}
`;

const IconContainer = styled(Div)`
  ${() => {
    const { grayMedium } = useColors();
    return `
      padding: 0.5em;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${grayMedium};
      cursor: pointer;
    `;
  }}
`;

const CharacterCounter = styled(Div)`
  ${({ textIsTooLong, isValid, errorMessage }) => {
    const { grayLight, destructive } = useColors();
    return css`
      position: absolute;
      top: calc(100% + ${isValid && errorMessage ? '0.25em' : '2em'});
      right: 0.25em;
      color: ${textIsTooLong ? destructive : grayLight};
    `;
  }}
`;

const ErrorContainer = styled(Div)`
  ${() => {
    const { destructive } = useColors();
    return css`
      position: absolute;
      top: calc(100% + 0.25em);
      color: ${destructive};
      font-size: 0.75rem;
    `;
  }}
`;

export type TextInputProps = {
  id?: string;
  placeholder?: string;
  iconPrefix?: string | ReactNode;
  onClear?: (event: SyntheticEvent) => void;
  onChange?: EventHandler<ChangeEvent<HTMLInputElement>>;
  debouncedOnChange?: EventHandler<ChangeEvent<HTMLInputElement>>;
  onKeyPress?: (event: SyntheticEvent) => void;
  onKeyDown?: (event: SyntheticEvent) => void;
  onKeyUp?: (event: SyntheticEvent) => void;
  onBlur?: (event: SyntheticEvent) => void;
  onInput?: (event: SyntheticEvent) => void;
  onFocus?: (event: SyntheticEvent) => void;
  onReset?: (event: SyntheticEvent) => void;
  cols?: number;
  rows?: number;
  value?: string;
  disabled?: boolean;
  defaultValue?: string;
  isValid?: boolean;
  isMultiline?: boolean;
  errorMessage?: string;
  ariaLabel?: string;
  type?: string;
  debounceInterval?: number;
  multiLineIsResizable?: boolean;
  maxLength?: number;
  allowTextBeyondMaxLength?: boolean;
  showCharacterCount?: boolean;

  StyledContainer?: string & StyledComponentBase<any, {}>;
  StyledInput?: string & StyledComponentBase<any, {}>;
  StyledIconContainer?: string & StyledComponentBase<any, {}>;
  StyledErrorContainer?: string & StyledComponentBase<any, {}>;
  containerProps?: SubcomponentPropsType;
  inputProps?: SubcomponentPropsType;
  iconContainerProps?: SubcomponentPropsType;
  errorContainerProps?: SubcomponentPropsType;
};

const createIcon = (
  StyledIconContainer: string & StyledComponentBase<any, {}>,
  iconPrefix: ReactNode,
) => {
  if (typeof iconPrefix === 'string') {
    return (
      <StyledIconContainer>
        <Icon size="1rem" path={iconPrefix} />
      </StyledIconContainer>
    );
  }

  return <StyledIconContainer>{iconPrefix}</StyledIconContainer>;
};

const defaultCallback = () => {}; // eslint-disable-line @typescript-eslint/no-empty-function

const TextInput = ({
  id,
  placeholder,
  iconPrefix,
  onClear,
  onChange = defaultCallback,
  debouncedOnChange = defaultCallback,
  onKeyPress,
  onKeyDown,
  onKeyUp,
  onBlur,
  onInput,
  onFocus,
  onReset,
  cols = 10,
  rows = 10,
  value,
  defaultValue = '',
  isValid = true,
  isMultiline,
  errorMessage,
  ariaLabel,
  type = 'text',
  disabled = false,
  debounceInterval = 8,
  multiLineIsResizable,
  maxLength,
  allowTextBeyondMaxLength = false,
  showCharacterCount = false,

  StyledContainer = Container,
  StyledInput, // Not defaulting here due to the issue with <input as="textarea" />
  StyledIconContainer = IconContainer,
  StyledErrorContainer = ErrorContainer,
  containerProps = {},
  inputProps = {},
  iconContainerProps = {},
  errorContainerProps = {},
}: TextInputProps) => {
  // Debounce the change function using useCallback so that the function is not initialized each time it renders
  const debouncedChange = useCallback(debounce(debouncedOnChange, debounceInterval), [
    debouncedOnChange,
    debounceInterval,
  ]);

  // Determine the correct input type. Using a single input and the 'as' keyword
  // to display as a text area disables the ability to set cols/rows
  let InputComponent: string & StyledComponentBase<any, {}> = TextInputContainer;
  if (StyledInput) {
    InputComponent = StyledInput;
  } else if (isMultiline) {
    InputComponent = TextAreaInputContainer;
  }
  const displayValue = value || defaultValue;

  return (
    <StyledContainer disabled={disabled} isValid={isValid} {...containerProps}>
      {iconPrefix && createIcon(StyledIconContainer, iconPrefix)}
      {/*
        // @ts-ignore */}
      <InputComponent
        cols={cols}
        rows={rows}
        aria-label={ariaLabel}
        placeholder={placeholder}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          e.persist();
          if (maxLength && maxLength >= 0) {
            e.target.value = allowTextBeyondMaxLength
              ? e.target.value
              : e.target.value.slice(0, maxLength);
          }
          onChange(e);
          debouncedChange(e);
        }}
        onKeyPress={onKeyPress}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onFocus={onFocus}
        onBlur={onBlur}
        onReset={onReset}
        onInput={onInput}
        value={displayValue}
        id={id}
        type={type}
        multiLineIsResizable={multiLineIsResizable}
        {...inputProps}
      />
      {onClear && (
        <StyledIconContainer onClick={onClear} {...iconContainerProps}>
          <Icon path={mdiClose} size="1em" />
        </StyledIconContainer>
      )}
      {showCharacterCount && maxLength && (
        <CharacterCounter
          errorMessage={errorMessage}
          isValid={isValid}
          textIsTooLong={displayValue.length > maxLength}
        >
          {displayValue.length} / {maxLength}
        </CharacterCounter>
      )}
      {isValid === false && errorMessage && (
        <StyledErrorContainer {...errorContainerProps}>{errorMessage}</StyledErrorContainer>
      )}
    </StyledContainer>
  );
};

TextInput.Container = Container;
TextInput.ErrorContainer = ErrorContainer;
TextInput.Input = TextInputContainer;
TextInput.IconContainer = IconContainer;
TextInput.TextArea = TextAreaInputContainer;

export default TextInput;
