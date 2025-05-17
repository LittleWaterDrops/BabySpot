import {GrayColors, PrimaryColors} from './../../../constants/colors';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import styled from 'styled-components';
import scale from '../../../utils/scale';
import {FontStyles} from '../../../constants/fonts';

export const ScrollViewContainer = styled(ScrollView)`
  flex: 1;
  background-color: ${GrayColors[0]};
`;

export const KeywordReviewContainer = styled(View)`
  flex: 1;
  padding: ${scale(32)}px ${scale(24)}px;
`;

export const Wrapper = styled(View)`
  flex-direction: row;
  gap: ${scale(8)}px;
`;

export const TextContainer = styled(View)`
  flex-direction: row;
  gap: ${scale(8)}px;
  align-items: center;
  margin-bottom: ${scale(8)}px;
`;

export const Title = styled(Text)`
  ${FontStyles.headingMedium};
  color: ${GrayColors[800]};
`;

export const CountText = styled(Text)`
  ${FontStyles.bodyMedium};
  color: ${GrayColors[300]};
`;

export const DescriptionText = styled(Text)`
  ${FontStyles.captionMedium};
  color: ${GrayColors[400]};
  padding-bottom: ${scale(8)}px;
`;

export const ReviewListContainer = styled(View)`
  gap: ${scale(8)}px;
  flex: 1;
`;

export const ReviewContainer = styled(TouchableOpacity)`
  gap: ${scale(8)}px;
  padding: ${scale(8)}px 0px;
`;

export const ReviewContainerDisabled = styled(View)`
  gap: ${scale(8)}px;
  padding: ${scale(8)}px 0px;
`;

export const IconImage = styled(Image)`
  width: ${scale(26)}px;
  height: ${scale(26)}px;
  border-radius: ${scale(5)}px;
`;
export const ContentText = styled(Text)`
  flex: 1;
  ${FontStyles.bodyMedium}
  color:${GrayColors[800]}
`;

export const MoreTextButton = styled(TouchableOpacity)``;
export const MoreText = styled(Text)`
  ${FontStyles.captionMedium};
  color: ${GrayColors[800]};
  margin-left: auto;
`;

export const HighlightedText = styled(Text)`
  ${FontStyles.bodyMedium};
  color: ${PrimaryColors[500]};
`;
