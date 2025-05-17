import React, {useMemo, useRef, useState} from 'react';
import * as S from './styles';
import {RouteProp, useRoute} from '@react-navigation/native';
import {MapStackParamList} from '../../../navigation/MapStackNavigator';
import {IC_NAVER_BLOG, IC_NAVER_PLACE} from '../../../constants/icons';
import {ReviewFromTypes} from '../StoreDetailScreen/components/Keyword';
import {withDivider} from '../../../utils/withDivider';
import {ThinDivider} from '../../../components/atoms/Divider';
import NoDataContainer from '../../../components/atoms/NoDataContainer';
import {ScrollView} from 'react-native';
import {
  IMG_DINING_CODE,
  IMG_GOOGLE,
  IMG_KAKAO_MAP,
} from '../../../constants/images';

type KeywordReviewScreenRouteProp = RouteProp<
  MapStackParamList,
  'KeywordReview'
>;

const KeywordReviewScreen = () => {
  const route = useRoute<KeywordReviewScreenRouteProp>();
  const {keywordInformation} = route.params;
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMoreTexts, setShowMoreTexts] = useState<boolean[]>([]);

  const scrollRef = useRef<ScrollView>(null);

  const handleTextLayout = (index: number) => (event: any) => {
    const {lines} = event.nativeEvent;
    setShowMoreTexts(prev => {
      const newShowMoreTexts = [...prev];
      newShowMoreTexts[index] = lines.length > 2;
      return newShowMoreTexts;
    });
  };

  return (
    <S.ScrollViewContainer ref={scrollRef}>
      <S.KeywordReviewContainer>
        <S.TextContainer>
          <S.Title>{keywordInformation.keyword}</S.Title>
          <S.CountText>{keywordInformation.count}</S.CountText>
        </S.TextContainer>

        <S.DescriptionText>상위 약 20개의 리뷰를 보여드려요.</S.DescriptionText>

        <S.ReviewListContainer>
          {keywordInformation.keywordReviews.length === 0 ? (
            <NoDataContainer text="키워드에 대한 리뷰를 수집 중입니다." />
          ) : (
            withDivider(
              keywordInformation.keywordReviews.map((review, index) => {
                const [isFold, setIsFold] = useState(true);
                const keyword = keywordInformation.keyword;

                let iconImage;
                switch (review.reviewFrom) {
                  case ReviewFromTypes.Blog:
                    iconImage = IC_NAVER_BLOG;
                    break;
                  case ReviewFromTypes.Place:
                    iconImage = IC_NAVER_PLACE;
                    break;
                  case ReviewFromTypes.DINING_CODE:
                    iconImage = IMG_DINING_CODE;
                    break;
                  case ReviewFromTypes.GOOGLE:
                    iconImage = IMG_GOOGLE;
                    break;
                  case ReviewFromTypes.KAKAO:
                    iconImage = IMG_KAKAO_MAP;
                    break;
                }

                const parsedContent = useMemo(() => {
                  const parts = review.content.split(
                    new RegExp(`(${keyword})`, 'gi'),
                  );
                  return parts.map((part, i) => {
                    if (part.toLowerCase() === keyword.toLowerCase()) {
                      return (
                        <S.HighlightedText key={`highlight-${index}-${i}`}>
                          {part}
                        </S.HighlightedText>
                      );
                    }
                    return (
                      <S.ContentText key={`normal-${index}-${i}`}>
                        {part}
                      </S.ContentText>
                    );
                  });
                }, [review.content, keyword, index]);

                const handlePress = () => {
                  setIsFold(!isFold);

                  if (
                    isFold &&
                    index === keywordInformation.keywordReviews.length - 1
                  ) {
                    setTimeout(() => {
                      scrollRef.current?.scrollToEnd({animated: true});
                    }, 0);
                  }
                };

                return (
                  <>
                    {showMoreTexts[index] ? (
                      <S.ReviewContainer
                        key={index}
                        onPress={() => setIsFold(!isFold)}>
                        <S.Wrapper>
                          <S.IconImage
                            source={iconImage}
                            resizeMode="contain"
                          />
                          <S.ContentText
                            numberOfLines={isFold ? 2 : undefined}
                            onTextLayout={handleTextLayout(index)}>
                            {parsedContent}
                          </S.ContentText>
                        </S.Wrapper>
                        {showMoreTexts[index] && (
                          <S.MoreText>{isFold ? '더보기' : '접기'}</S.MoreText>
                        )}
                      </S.ReviewContainer>
                    ) : (
                      <S.ReviewContainerDisabled key={index}>
                        <S.Wrapper>
                          <S.IconImage
                            source={iconImage}
                            resizeMode="contain"
                          />
                          <S.ContentText
                            numberOfLines={isFold ? 2 : undefined}
                            onTextLayout={handleTextLayout(index)}>
                            {parsedContent}
                          </S.ContentText>
                        </S.Wrapper>
                        {showMoreTexts[index] && (
                          <S.MoreText>{isFold ? '더보기' : '접기'}</S.MoreText>
                        )}
                      </S.ReviewContainerDisabled>
                    )}
                  </>
                );
              }),
              <ThinDivider />,
            )
          )}
        </S.ReviewListContainer>
      </S.KeywordReviewContainer>
    </S.ScrollViewContainer>
  );
};

export default KeywordReviewScreen;
