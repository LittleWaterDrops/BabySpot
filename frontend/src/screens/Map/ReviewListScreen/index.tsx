/* eslint-disable react-hooks/exhaustive-deps */

import React, {useEffect, useState} from 'react';
import * as S from './styles';
import {RouteProp, useRoute, useFocusEffect} from '@react-navigation/native';
import {MapStackParamList} from '../../../navigation/MapStackNavigator';
import ReviewCard from '../StoreDetailScreen/components/Review/ReviewCard';
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native';
import {ThinDivider} from '../../../components/atoms/Divider';
import {IC_YELLOW_STAR, IC_COMMENT, IC_FILTER} from '../../../constants/icons';
import ReviewFilterModal from './ReviewFilterModal';
import {
  getStoreReviews,
  ReviewResponseType,
} from '../../../services/reviewService';
import {sortReview} from '../../../utils/sortReview';
type StoreDetailRouteProp = RouteProp<MapStackParamList, 'ReviewListScreen'>;

const ReviewListScreen = () => {
  const route = useRoute<StoreDetailRouteProp>();
  const {storeId} = route.params;
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedAges, setSelectedAges] = useState<number[]>([]);
  const [allReviews, setAllReviews] = useState<ReviewResponseType['content']>(
    [],
  );
  const [filteredReviews, setFilteredReviews] = useState<
    ReviewResponseType['content']
  >([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [sortedReviews, setSortedReviews] = useState<
    ReviewResponseType['content']
  >([]);

  const filteredAges = route.params.filterAges;
  const PAGE_SIZE = 10;

  const calculateFilteredReviews = (
    reviews: ReviewResponseType['content'],
    ages: number[],
  ) => {
    if (ages.length === 0) {
      return reviews;
    }
    return reviews.filter(review =>
      review.babyAges.some(age => ages.includes(age)),
    );
  };

  const calculateAverageRating = () => {
    if (filteredReviews.length === 0) return 0;
    const sum = filteredReviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / filteredReviews.length).toFixed(1);
  };

  const fetchReviews = async (pageNumber: number) => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const response = await getStoreReviews(storeId, pageNumber, PAGE_SIZE);

      if (pageNumber === 0) {
        setAllReviews(response.content);
        const filtered = calculateFilteredReviews(
          response.content,
          selectedAges,
        );
        setFilteredReviews(filtered);
      } else {
        setAllReviews(prev => [...prev, ...response.content]);
        const filtered = calculateFilteredReviews(
          response.content,
          selectedAges,
        );
        setFilteredReviews(prev => [...prev, ...filtered]);
      }

      setTotalElements(response.totalElements);
      setHasMore(!response.last);
      setPage(pageNumber);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setPage(0);
      setAllReviews([]);
      setFilteredReviews([]);
      fetchReviews(0);
    }, [storeId]),
  );

  useEffect(() => {
    fetchReviews(0);
  }, [storeId]);

  useEffect(() => {
    if (filteredAges) {
      setSelectedAges(filteredAges);
      setPage(0);
      setAllReviews([]);
      setFilteredReviews([]);
      fetchReviews(0);
    }
  }, [filteredAges]);

  useEffect(() => {
    const filtered = calculateFilteredReviews(allReviews, selectedAges);
    setFilteredReviews(filtered);
  }, [selectedAges, allReviews]);

  useEffect(() => {
    const sortedReviews = sortReview(filteredReviews);

    setSortedReviews(sortedReviews);
  }, [filteredReviews]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchReviews(page + 1);
    }
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={{padding: 20, alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  };

  const renderSeparator = () => (
    <S.DividerWrapper>
      <ThinDivider />
    </S.DividerWrapper>
  );

  const renderItem = ({item}: {item: ReviewResponseType['content'][0]}) => (
    <ReviewCard {...item} />
  );

  const ListHeaderComponent = () => (
    <S.TitleHeaderContainer>
      <S.TitleInformationContainer>
        <S.Title>{`리뷰`}</S.Title>
        <S.InformationListContainer>
          <S.InformationContainer>
            <S.InformationIconImage source={IC_YELLOW_STAR} />
            <S.InformationText
              $isStar>{`별점 ${calculateAverageRating()}`}</S.InformationText>
          </S.InformationContainer>
          <S.InformationContainer>
            <S.InformationIconImage source={IC_COMMENT} />
            <S.InformationText $isStar={false}>
              {`리뷰 ${totalElements}개`}
            </S.InformationText>
          </S.InformationContainer>
        </S.InformationListContainer>
      </S.TitleInformationContainer>
      <TouchableOpacity
        onPress={() => {
          setModalOpened(true);
        }}>
        <S.FilterIconImage source={IC_FILTER} />
      </TouchableOpacity>
    </S.TitleHeaderContainer>
  );

  return (
    <>
      <S.ReviewListScreenContainer>
        {sortedReviews.length > 0 ? (
          <FlatList
            data={sortedReviews}
            renderItem={renderItem}
            keyExtractor={item => item.reviewId.toString()}
            ItemSeparatorComponent={renderSeparator}
            ListHeaderComponent={ListHeaderComponent}
            ListFooterComponent={renderFooter}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            scrollEventThrottle={16}
            contentContainerStyle={{padding: 24}}
          />
        ) : (
          <S.NoReviewContainer>
            <ListHeaderComponent />
            <S.NoReviewText>등록된 리뷰가 없습니다.</S.NoReviewText>
          </S.NoReviewContainer>
        )}
      </S.ReviewListScreenContainer>
      <ReviewFilterModal
        modalOpened={modalOpened}
        setModalOpened={setModalOpened}
        selectedAge={selectedAges}
        setSelectedAge={setSelectedAges}
      />
    </>
  );
};

export default ReviewListScreen;
