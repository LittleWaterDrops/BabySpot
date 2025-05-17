import React, {useState} from 'react';
import * as S from './styles';
import {AGE_MARKERS} from '../../../../../../constants/constants';
import {IC_HEART} from '../../../../../../constants/icons';
import scale from '../../../../../../utils/scale';
import StarRating from '../../../../../../components/atoms/StarRating';
import {ReviewType} from '../../../../../../services/reviewService';
import {useGlobalStore} from '../../../../../../stores/globalStore';
import {useMapNavigation} from '../../../../../../hooks/useNavigationHooks';
import {TouchableOpacity} from 'react-native';
import GalleryViewer from '../../../../../../components/atoms/GalleryViewer';
import showToastMessage from '../../../../../../utils/showToastMessage';

export interface ReviewCardProps extends ReviewType {}

const ReviewCard = (props: ReviewCardProps) => {
  const {memberProfile} = useGlobalStore();
  const navigation = useMapNavigation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGalleryVisible, setIsGalleryVisible] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [showMoreText, setShowMoreText] = useState(false);

  const openGallery = (index: number) => {
    setGalleryIndex(index);
    setIsGalleryVisible(true);
  };

  const galleryImages = props.imgUrls.map(imgUrl => ({uri: imgUrl}));

  const handleTextLayout = (event: any) => {
    const {lines} = event.nativeEvent;
    setShowMoreText(lines.length > 2);
  };

  return (
    <S.ReviewCardContainer>
      <S.ProfileContainer>
        <S.ProfileImage
          source={{
            uri:
              props.memberId === memberProfile?.id
                ? memberProfile?.profile_img
                : props.profile,
          }}
          resizeMode="cover"
        />
        <S.InformationAndAgeContainer>
          <S.NameAndReviewContainer>
            <S.ProfileNameText numberOfLines={1} ellipsizeMode="tail">
              {props.memberNickname}
            </S.ProfileNameText>
            <S.ProfileReviewText>{`리뷰 ${props.reviewCount}`}</S.ProfileReviewText>
          </S.NameAndReviewContainer>
          <S.AgeMarkerContainer>
            {props.babyAges.map((age, idx) => (
              <S.AgeMarker
                key={idx}
                source={AGE_MARKERS[age]}
                $ageIndex={idx}
              />
            ))}
          </S.AgeMarkerContainer>
        </S.InformationAndAgeContainer>
        {props.memberId == memberProfile?.id && (
          <S.EditContainer
            onPress={() => {
              navigation.navigate('WriteReviewScreen', {review: props});
            }}>
            <S.EditText>{`수정`}</S.EditText>
          </S.EditContainer>
        )}
      </S.ProfileContainer>

      <S.RatingContainer>
        <StarRating rating={props.rating} starSize={scale(16)} isDisplay />
        <S.RatingText>{props.rating.toFixed(1)}</S.RatingText>
      </S.RatingContainer>

      <S.ReviewText
        numberOfLines={isExpanded ? undefined : 2}
        onTextLayout={handleTextLayout}>
        {props.content}
      </S.ReviewText>
      {showMoreText && (
        <S.MoreTextButton onPress={() => setIsExpanded(!isExpanded)}>
          <S.MoreText>더보기</S.MoreText>
        </S.MoreTextButton>
      )}

      <S.ImageContainer>
        {props.imgUrls.length > 4 ? (
          <>
            {props.imgUrls?.slice(0, 3).map((imageUrl, idx) => (
              <TouchableOpacity key={idx} onPress={() => openGallery(idx)}>
                <S.Images source={{uri: imageUrl}} />
              </TouchableOpacity>
            ))}
            <S.OverlayWrapper key="overlay">
              <S.Images source={{uri: props.imgUrls?.[3]}} />
              <S.OverlayText>+{props.imgUrls.length - 4}</S.OverlayText>
            </S.OverlayWrapper>
          </>
        ) : (
          <>
            {props.imgUrls?.map((imageUrl, idx) => (
              <TouchableOpacity key={idx} onPress={() => openGallery(idx)}>
                <S.Images source={{uri: imageUrl}} />
              </TouchableOpacity>
            ))}
            {props.imgUrls?.length != 0 &&
              Array.from({length: 4 - (props.imgUrls?.length || 0)}).map(
                (_, index) => <S.EmptyBox key={index} />,
              )}
          </>
        )}
      </S.ImageContainer>

      <S.LastRowContainer>
        <S.Date>{props.createdAt.slice(0, 10)}</S.Date>
      </S.LastRowContainer>

      <GalleryViewer
        visible={isGalleryVisible}
        images={galleryImages}
        initialIndex={galleryIndex}
        currentIndex={galleryIndex}
        onClose={() => setIsGalleryVisible(false)}
        onIndexChange={setGalleryIndex}
      />
    </S.ReviewCardContainer>
  );
};

export default ReviewCard;
