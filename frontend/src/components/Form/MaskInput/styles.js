import ReactInputMask from 'react-input-mask';

import styled from 'styled-components';

import { colors } from '~/styles/colors';

export const InputMask = styled(ReactInputMask)`
  height: 45px;
  padding: 12px 15px;
  font-size: 16px;
  color: ${colors.title};
  border: 1px solid ${colors.border};
  border-radius: 4px;

  &::placeholder {
    color: ${colors.input};
  }
`;

export const Error = styled.span`
  color: ${colors.danger};
  margin-top: 8px;

  & + label {
    margin-top: 8px;
  }
`;

export const Label = styled.label`
  display: flex;
  flex-direction: column;

  strong {
    text-align: left;
    color: ${colors.label};
    font-weight: bold;
    margin-bottom: 9px;
  }

  & + label {
    margin-top: 18px;
  }
`;
