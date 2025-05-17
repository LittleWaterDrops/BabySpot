import {Image, Pressable, Text, View} from 'react-native';

import styled from 'styled-components/native';

import scale from '../../../../../utils/scale';
import {FontStyles} from '../../../../../constants/fonts';
import {GrayColors} from '../../../../../constants/colors';

export const SearchHistoryContainer = styled(Pressable)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: ${scale(8)}px;
  padding: ${scale(16)}px 0;
`;

export const Icon = styled(Image)`
  width: ${scale(24)}px;
  height: ${scale(24)}px;
`;

export const IconContainer = styled(Pressable)``;

export const Address = styled(Text).attrs({
  numberOfLines: 1,
  ellipsizeMode: 'tail',
})`
  flex: 1;
  ${FontStyles.bodyMedium}
  color: ${GrayColors[800]};
`;

export const SearchDate = styled(Text)`
  ${FontStyles.captionMedium}
  color: ${GrayColors[400]};
`;

export const DateCloseContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: ${scale(8)}px;
`;
