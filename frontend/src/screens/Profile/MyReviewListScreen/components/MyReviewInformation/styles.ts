import {Image, Text, TouchableOpacity, View} from 'react-native';

import styled from 'styled-components/native';

import scale from '../../../../../utils/scale';
import {FontStyles} from '../../../../../constants/fonts';
import {GrayColors, SecondaryColors} from '../../../../../constants/colors';

export const MyReviewInformationContainer = styled(View)`
  display: flex;
  flex-direction: column;
  gap: ${scale(8)}px;
  padding-top: ${scale(8)}px;
  width: 100%;
`;

export const DetailContainer = styled(View)`
  display: flex;
  flex-direction: column;
  gap: ${scale(8)}px;
`;

export const TitleContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
export const FirstRowContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: ${scale(8)}px;
  height: ${scale(24)}px;
`;
export const StoreName = styled(Text).attrs({
  numberOfLines: 1,
  ellipsizeMode: 'tail',
})`
  ${FontStyles.bodyMedium}
  font-weight: bold;
  color: ${GrayColors[800]};
  line-height: ${scale(24)}px;
  max-width: 60%;
  flex-shrink: 1;
`;

export const StoreCategory = styled(Text)`
  ${FontStyles.captionMedium}
  color: ${GrayColors[700]};
  line-height: ${scale(26)}px;
  flex-shrink: 0;
`;

export const OKZoneMarker = styled(View)`
  padding: ${scale(4)}px;
  border-radius: 15px;
  border-width: 1px;
  border-color: ${SecondaryColors[500]};
  background-color: ${GrayColors[0]};
  height: ${scale(24)}px;
  justify-content: center;
  flex-shrink: 0;
`;
export const OKZoneText = styled(Text)`
  ${FontStyles.captionSmall}
  color: ${SecondaryColors[500]};
`;
export const EditTextContainer = styled(TouchableOpacity)``;
export const EditText = styled(Text)`
  ${FontStyles.captionMedium};
  color: ${GrayColors[700]};
`;

export const SecondRowContainer = styled(View)`
  flex-direction: row;
  align-items: center;
`;
export const RatingText = styled(Text)`
  ${FontStyles.captionSmall};
  color: ${GrayColors[700]};
  font-weight: bold;
  padding-top: ${scale(2)}px;
`;
export const Rating = styled(Text)`
  ${FontStyles.captionSmall};
  color: ${GrayColors[800]};
  padding-left: ${scale(4)}px;
  padding-right: ${scale(4)}px;
  padding-top: ${scale(2)}px;
`;
export const RatingContainer = styled(View)`
  display: flex;
  flex-direction: row;
`;
export const SmallIcon = styled(Image)`
  width: ${scale(16)}px;
  height: ${scale(16)}px;
`;

export const ReviewText = styled(Text)`
  ${FontStyles.captionMedium};
  color: ${GrayColors[800]};
`;
export const Wrapper = styled(TouchableOpacity)`
  ${FontStyles.captionMedium};
  color: ${GrayColors[800]};
`;
export const MoreTextButton = styled(TouchableOpacity)``;
export const MoreText = styled(Text)`
  ${FontStyles.captionMedium};
  color: ${GrayColors[800]};
  margin-left: auto;
`;

export const ImageContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: ${scale(16)}px;
`;
export const Images = styled(Image)`
  width: ${scale(66)}px;
  height: ${scale(66)}px;
  border-radius: 10px;
  border: 1px solid ${GrayColors[200]};
`;
export const OverlayWrapper = styled(View)`
  position: relative;
  align-items: center;
  justify-items: center;
`;
export const OverlayText = styled(Text)`
  position: absolute;
  width: ${scale(66)}px;
  height: ${scale(66)}px;
  border-radius: 10px;
  ${FontStyles.bodyMedium};
  color: ${GrayColors[0]};
  text-align: center;
  text-align-vertical: center;
  background-color: rgba(0, 0, 0, 0.6);
`;

export const LastRowContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  padding-top: ${scale(6)}px;
`;

export const Date = styled(Text)`
  ${FontStyles.captionSmall};
  color: ${GrayColors[300]};
  margin-left: auto;
`;
