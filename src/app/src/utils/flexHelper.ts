type JustifyContent =
  | 'flex-start'
  | 'center'
  | 'flex-end'
  | 'start'
  | 'end'
  | 'left'
  | 'right'
  | 'space-around'
  | 'space-between'
  | 'space-evenly'
  | 'stretch';

type AlignItems = 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'baseline' | 'stretch';
type FlexDirection = 'column' | 'row' | 'column-reverse' | 'row-reverse';

export type FlexProps = {
  justifyContent?: JustifyContent;
  alignItems?: AlignItems;
  flexDirection?: FlexDirection;
};

export const flexHelper = ({
  justifyContent = 'flex-start',
  alignItems = 'flex-start',
  flexDirection = 'row',
}: FlexProps) => ({
  display: 'flex',
  justifyContent,
  alignItems,
  flexDirection,
});
