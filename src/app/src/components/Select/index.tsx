import { useRef, useState } from 'react';
import styled from '@emotion/styled';
import { useOutsideClick } from '../../hooks';

const DropDownContainer = styled('div')`
  width: 240px;
  margin: 0 auto;
`;

const DropDownHeader = styled('div')`
  margin-bottom: 0.8em;
  padding: 10px;
  padding-left: 30px;
  background-color: rgba(255, 255, 255, 0.29);
  border-radius: 10px;
  font-weight: 500;
  font-size: 1.3rem;
  color: #ffffff;
  cursor: pointer;
  user-select: none;
`;

const HeaderInner = styled('div')`
  display: flex;
  justify-content: space-between;
`;

const DropDownListContainer = styled('div')`
  position: absolute;
  z-index: 100;
  width: 240px;
`;

const DropDownList = styled('ul')`
  padding: 10px;
  padding-bottom: 0;
  margin: 0;
  padding-left: 1em;
  background: #e871eb;
  box-sizing: border-box;
  border-radius: 10px;
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid #ffffff;
`;

const ListItem = styled('li')`
  list-style: none;
  margin-bottom: 0.8em;
  &:hover {
    color: #fd9e46;
  }
`;

interface SelectProps {
  value: string;
  options: string[];
  onChange: (option: string) => void;
}

export const Select = ({ value, options, onChange }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownContainerRef = useRef(null);

  const onClose = () => {
    setIsOpen(false);
  };

  useOutsideClick({ ref: dropdownContainerRef, fn: onClose });

  const toggling = () => setIsOpen(!isOpen);

  const onOptionClicked = (value: string) => () => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <DropDownContainer ref={dropdownContainerRef}>
      <DropDownHeader onClick={toggling}>
        <HeaderInner>
          <span>{value}</span>
          <span>{isOpen ? '▲' : '▼ '}</span>
        </HeaderInner>
      </DropDownHeader>
      {isOpen && (
        <DropDownListContainer>
          <DropDownList>
            {options.map((option) => (
              <ListItem onClick={onOptionClicked(option)} key={Math.random()}>
                {option}
              </ListItem>
            ))}
          </DropDownList>
        </DropDownListContainer>
      )}
    </DropDownContainer>
  );
};
