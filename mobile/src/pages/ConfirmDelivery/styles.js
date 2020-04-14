import styled from 'styled-components/native';

import Button from '~/components/Button';
import { colors } from '~/styles/colors';

export const Container = styled.View`
  flex: 1;
  background-color: white;
`;

export const Background = styled.View`
  height: 20%;
  background-color: ${colors.primary};
`;

export const Preview = styled.Image`
  /* margin-top: 40px; */
  position: absolute;
  top: 15px;
  align-self: center;
  height: 80%;
  width: 90%;
  background-color: black;
`;

export const CameraButton = styled.TouchableOpacity`
  border-radius: 180px;
  background-color: rgba(0, 0, 0, 0.2);
  position: absolute;
  top: 70%;
  align-self: center;
  padding: 10px;
`;

export const SendButton = styled(Button)`
  margin-left: 20px;
  margin-right: 20px;
  top: 65%;
  background: ${colors.primary};
`;
