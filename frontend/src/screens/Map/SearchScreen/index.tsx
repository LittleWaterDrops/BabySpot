import React, {useEffect, useState} from 'react';
import SearchHistory from './components/SearchHistory';
import * as S from './styles';
import NoDataContainer from '../../../components/atoms/NoDataContainer';
import {withDivider} from '../../../utils/withDivider';
import {
  FlatList,
  Keyboard,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import {PrimaryColors, GrayColors} from '../../../constants/colors';
import {IC_LEFT_ARROW} from '../../../constants/icons';
import {useMapNavigation} from '../../../hooks/useNavigationHooks';
import scale, {scaleLetterSpacing} from '../../../utils/scale';
import {
  GetGeocodingByKeywordResponse,
  GetRecentSearchPlacesResponse,
  deleteRecentSearchPlace,
  getGeocodingByKeyword,
  getRecentSearchPlaces,
  postRecentSearchPlace,
} from '../../../services/mapService';
import {useMapStore} from '../../../stores/mapStore';
import {ThinDivider} from '../../../components/atoms/Divider';
import LoadingIndicator from '../../../components/atoms/LoadingIndicator';

const SearchScreen = () => {
  const navigation = useMapNavigation();
  const {centerCoordinate, setSelectedPlace} = useMapStore();

  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState<GetGeocodingByKeywordResponse[]>([]);
  const [recentSearchPlaces, setRecentSearchPlaces] = useState<
    GetRecentSearchPlacesResponse[]
  >([]);

  const searchPlaces = async (text: string) => {
    setSearchText(text);

    if (!text.trim()) {
      setResults([]);
      return;
    }

    try {
      const response = await getGeocodingByKeyword(
        text,
        centerCoordinate.longitude,
        centerCoordinate.latitude,
      );

      setResults(response);
    } catch (error) {
      console.error('장소 검색 오류:', error);
    }
  };

  const handleSelect = async (item: GetGeocodingByKeywordResponse) => {
    setIsLoading(true);
    setSelectedPlace(item);

    navigation.navigate('MapMain', {searchedPlace: item});

    await postRecentSearchPlace({term: item.place_name});

    setIsLoading(false);
  };

  const renderHighlightedName = (
    placeName: string,
    keyword: string,
    index: number,
  ) => {
    const parts = placeName.split(new RegExp(`(${keyword})`, 'gi'));

    return parts.map((part, i) => {
      const key = `${index}-${i}`;
      const isMatch =
        part.toLowerCase() === keyword.toLowerCase() && keyword !== '';

      return isMatch ? (
        <S.HighlightedText key={`highlight-${key}`}>{part}</S.HighlightedText>
      ) : part ? (
        <S.PlaceNameRawText key={`normal-${key}`}>{part}</S.PlaceNameRawText>
      ) : null;
    });
  };

  const handleRecentSearchPlace = async () => {
    const response = await getRecentSearchPlaces();

    setRecentSearchPlaces(response);
  };

  const handleItemPressed = async (searchId: number) => {
    setIsLoading(true);

    const itemPlaceName = recentSearchPlaces.find(
      recentSearchPlace => recentSearchPlace.id === searchId,
    )?.searchTerm;

    if (itemPlaceName) {
      try {
        const response = await getGeocodingByKeyword(
          itemPlaceName,
          centerCoordinate.longitude,
          centerCoordinate.latitude,
        );

        handleSelect(response[0]);
      } catch (error) {
        console.error('장소 검색 오류:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  const handleDeletePressed = async (searchId: number) => {
    await deleteRecentSearchPlace({searchId});
    await handleRecentSearchPlace();
    setSearchText('');
  };

  useEffect(() => {
    handleRecentSearchPlace();
  }, []);

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <S.SearchScreenContainer>
          <S.PlaceSearchButton>
            <S.LeftArrowIconContainer
              onPress={() => {
                navigation.goBack();
              }}>
              <S.LeftArrowIcon source={IC_LEFT_ARROW} />
            </S.LeftArrowIconContainer>

            <TextInput
              value={searchText}
              placeholder={'검색할 장소를 입력해주세요'}
              selectionColor={PrimaryColors[500]}
              placeholderTextColor={GrayColors[300]}
              style={{
                flex: 1,
                padding: scale(8),
                margin: 0,
                fontSize: scale(16),
                fontFamily: 'Pretendard-Regular',
                lineHeight: scale(24),
                fontWeight: 400,
                letterSpacing: scaleLetterSpacing(16, -2),
                includeFontPadding: false,
                textDecorationColor: GrayColors[800],
              }}
              autoFocus={true}
              onChangeText={text => {
                searchPlaces(text);
              }}
            />
          </S.PlaceSearchButton>

          {searchText.trim().length != 0 ? (
            <FlatList
              data={results}
              keyExtractor={item => item.id.toString()}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <NoDataContainer text={'검색 결과가 없습니다.'} />
              }
              renderItem={({item, index}) => (
                <S.PlaceButtonTile
                  $showLine={index != results.length - 1}
                  onPress={() => handleSelect(item)}>
                  <S.PlaceNameText>
                    {renderHighlightedName(item.place_name, searchText, index)}
                  </S.PlaceNameText>
                  <S.PlaceAddressText>
                    {item.road_address_name || item.address_name}
                  </S.PlaceAddressText>
                </S.PlaceButtonTile>
              )}
              keyboardShouldPersistTaps="handled"
            />
          ) : (
            <S.SearchHistoryListContainer>
              <S.SearchHistoryListTitle>최근 검색</S.SearchHistoryListTitle>
              <S.SearchHistoryList>
                {recentSearchPlaces.length == 0 ? (
                  <NoDataContainer text="검색 결과가 없습니다." />
                ) : (
                  withDivider(
                    recentSearchPlaces.map((recentSearchPlace, index) => (
                      <SearchHistory
                        key={index}
                        {...recentSearchPlace}
                        itemPressed={handleItemPressed}
                        deletePressed={handleDeletePressed}
                      />
                    )),

                    <ThinDivider />,
                  )
                )}
              </S.SearchHistoryList>
            </S.SearchHistoryListContainer>
          )}
        </S.SearchScreenContainer>
      </TouchableWithoutFeedback>
      {isLoading && <LoadingIndicator />}
    </>
  );
};

export default SearchScreen;
