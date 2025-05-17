import {Image, Text, TouchableOpacity, View} from 'react-native';
import styled from 'styled-components/native';
import {GrayColors, SecondaryColors} from '../../../../../../constants/colors';
import {FontStyles} from '../../../../../../constants/fonts';
import scale from '../../../../../../utils/scale';

export const ReviewCardContainer = styled(View)`
  gap: ${scale(8)}px;
`;

export const ProfileContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: ${scale(8)}px;
`;

export const ProfileImage = styled(Image)`
  width: ${scale(36)}px;
  height: ${scale(36)}px;
  border-radius: 1000px;
  border: 1px solid ${GrayColors[200]};
`;

export const InformationAndAgeContainer = styled(View)`
  flex: 1;
  flex-direction: row;
  gap: ${scale(8)}px;
  align-items: center;
`;

export const NameAndReviewContainer = styled(View)`
  max-width: 40%;
`;

export const ProfileNameText = styled(Text)`
  ${FontStyles.bodyMedium};
  color: ${GrayColors[800]};
`;

export const ProfileReviewText = styled(Text)`
  ${FontStyles.captionSmall};
  color: ${GrayColors[500]};
`;

export const AgeMarkerContainer = styled(View)`
  flex-direction: row;
`;

export const AgeMarker = styled(Image)<{$ageIndex: number}>`
  margin-left: ${({$ageIndex}) => ($ageIndex > 0 ? `-${scale(8)}px` : 0)};
  width: ${scale(24)}px;
  height: ${scale(24)}px;
`;

export const RatingContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: ${scale(8)}px;
`;

export const RatingText = styled(Text)`
  ${FontStyles.captionSmall};
  color: ${GrayColors[800]};
`;

export const SmallIcon = styled(Image)`
  width: ${scale(16)}px;
  height: ${scale(16)}px;
`;

export const ReviewText = styled(Text)`
  ${FontStyles.captionMedium};
  color: ${GrayColors[800]};
`;

export const ImageContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
export const Images = styled(Image)`
  width: ${scale(66)}px;
  height: ${scale(66)}px;
  border-radius: 10px;
  border: 1px solid ${GrayColors[200]};
`;

export const EmptyBox = styled(View)`
  width: ${scale(66)}px;
  height: ${scale(66)}px;
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
  vertical-align: middle;
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

export const EditContainer = styled(TouchableOpacity)`
  width: ${scale(24)}px;
  height: ${scale(24)}px;
  align-items: center;
  justify-content: center;
`;

export const EditText = styled(Text)`
  ${FontStyles.captionMedium};
  color: ${GrayColors[700]};
`;

export const MoreTextButton = styled(TouchableOpacity)``;
export const MoreText = styled(Text)`
  ${FontStyles.captionMedium};
  color: ${GrayColors[800]};
  margin-left: auto;
`;
