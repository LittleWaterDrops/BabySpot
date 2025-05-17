/* eslint-disable react-hooks/exhaustive-deps */

import React, {useEffect, useRef, useState} from 'react';
import {Alert} from 'react-native';

import {RouteProp, useRoute} from '@react-navigation/native';
import {
  Camera,
  NaverMapMarkerOverlay,
  NaverMapViewRef,
  Region,
} from '@mj-studio/react-native-naver-map';
import BottomSheet from '@gorhom/bottom-sheet';

import useMapViewport from '../../../hooks/useMapViewport';
import useResearchButtonVisibility from '../../../hooks/useResearchButtonVisibility';
import useChips from '../../../hooks/useChips';
import {useGlobalStore} from '../../../stores/globalStore';
import {MapStackParamList} from '../../../navigation/MapStackNavigator';

import NearStoreListScreen from '../NearStoreListScreen';
import PlaceSearchButton from '../components/PlaceSearchButton';
import RecommendButton from './components/RecommendButton';
import Chip from './components/Chip';
import ResearchButton from './components/ResearchButton';
import StoreBasicScreen from '../StoreBasicScreen';
import {GetGeocodingByKeywordResponse} from '../../../services/mapService';
import {useMapStore} from '../../../stores/mapStore';
import LoadingIndicator from '../../../components/atoms/LoadingIndicator';

import scale from '../../../utils/scale';
import checkLocationPermission from '../../../utils/checkLocationPermission';
import getCurrentLocation from '../../../utils/getCurrentLocation';
import moveToCamera from '../../../utils/moveToCamera';
import {
  IC_RECOMMEND_MARKER,
  IC_RESTAURANT_MARKER,
} from '../../../constants/icons';
import {MAP_ZOOM_SCALE} from '../../../constants/constants';

import * as S from './styles';
import {GrayColors} from '../../../constants/colors';

type MapMainRouteProp = RouteProp<MapStackParamList, 'MapMain'>;

const MapScreen = () => {
  const mapRef = useRef<NaverMapViewRef>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [selectedMarker, setSelectedMarker] = useState(-1);

  const [isReadyToFirstSearch, setIsReadyToFirstSearch] = useState(true);
  const [isPendingResearch, setIsPendingResearch] = useState(false);
  const [isResearchButtonPressed, setIsResearchButtonPressed] = useState(false);

  const {
    selectedAges,
    selectedChips,
    centerCoordinate,
    zoom,
    storeBasicInformation,
    filteredStoreBasicInformation,
    isLoading,
    setSelectedAges,
    fetchStoreBasicInformation,
    setFilteredStoreBasicInformation,
    setSelectedStoreIndex,
  } = useMapStore();
  const {onCameraIdle} = useMapViewport();
  const {isVisible, updateLastSearchedCoordinate} = useResearchButtonVisibility(
    {centerCoordinate, zoom},
  );
  const {chips, handleChipPressed} = useChips();

  const clearSelectedPlace = useMapStore(state => state.clearSelectedPlace);
  const {hasLocationPermission, setHasLocationPermission} = useGlobalStore();

  const route = useRoute<MapMainRouteProp>();
  const searchedPlace = route.params?.searchedPlace;

  const changeMarkerSize = (idx: number, defaultSize: number) => {
    if (selectedMarker === -1) {
      return defaultSize;
    }

    if (idx !== selectedMarker) {
      return defaultSize * 0.7;
    }

    return defaultSize * 1.3;
  };

  const initMapToCurrentLocation = async () => {
    const hasPermission = await checkLocationPermission();
    setHasLocationPermission(hasPermission);

    if (!hasPermission) {
      const {latitude, longitude} = centerCoordinate;

      moveToCamera({latitude, longitude, mapRef});

      return;
    }

    try {
      const {latitude, longitude} = await getCurrentLocation();

      moveToCamera({latitude, longitude, mapRef});
    } catch (e) {
      throw new Error('위치 정보 가져오기 실패');
    }
  };

  const handleCameraIdle = (e: Camera & {region: Region}) => {
    onCameraIdle(e);

    if (!isReadyToFirstSearch) {
      return;
    }

    setIsReadyToFirstSearch(false);
    setIsPendingResearch(true);
  };

  const modifyZoomForSearch = () => {
    if (!mapRef.current || !zoom) {
      return;
    }

    if (zoom < MAP_ZOOM_SCALE.basic) {
      moveToCamera({
        latitude: centerCoordinate.latitude,
        longitude: centerCoordinate.longitude,
        mapRef: mapRef,
      });
    }
  };

  const handleResearchButtonPress = () => {
    clearSelectedPlace();
    setSelectedAges([]);
    modifyZoomForSearch();
    setIsResearchButtonPressed(true);
    setIsPendingResearch(true);

    setTimeout(() => {
      setIsResearchButtonPressed(false);
    }, 1000);
  };

  const modifyZoomForRecommend = () => {
    if (!mapRef.current) {
      return;
    }

    moveToCamera({
      latitude: centerCoordinate.latitude,
      longitude: centerCoordinate.longitude,
      mapRef: mapRef,
      zoom: MAP_ZOOM_SCALE.recommend,
    });

    setIsPendingResearch(true);
  };

  const searchStoresInRegion = async () => {
    try {
      fetchStoreBasicInformation();

      updateLastSearchedCoordinate();
    } catch (e) {
      throw new Error('주변 가게 검색 중 문제가 발생하였습니다.');
    } finally {
      bottomSheetRef.current?.snapToIndex(1);

      setIsPendingResearch(false);
    }
  };

  const searchStoresByAge = async () => {
    try {
      fetchStoreBasicInformation();

      updateLastSearchedCoordinate();
    } catch (error) {
      throw new Error('주변 음식점 추천 중 문제가 발생하였습니다.');
    } finally {
      bottomSheetRef.current?.snapToIndex(1);

      setIsPendingResearch(false);
    }
  };

  const handleMarkerTab = (idx: number) => {
    setSelectedMarker(idx);
    setSelectedStoreIndex(idx);
  };

  const handleNaverMapTab = () => {
    bottomSheetRef.current?.snapToIndex(0);

    setSelectedMarker(-1);
    setSelectedStoreIndex(-1);
  };

  const moveToAddress = async (place: GetGeocodingByKeywordResponse) => {
    try {
      const latitude = parseFloat(place.y);
      const longitude = parseFloat(place.x);

      moveToCamera({
        latitude: latitude,
        longitude: longitude,
        mapRef: mapRef,
      });

      setIsReadyToFirstSearch(true);
    } catch (error) {
      Alert.alert('위치 이동 중 오류 발생');
    }
  };

  useEffect(() => {
    if (route.params?.searchedPlace) {
      return;
    }

    initMapToCurrentLocation();
  }, []);

  useEffect(() => {
    if (!searchedPlace) {
      return;
    }

    moveToAddress(searchedPlace);
  }, [searchedPlace]);

  useEffect(() => {
    if (!isPendingResearch || !zoom) {
      return;
    }

    // 추천 검색
    if (selectedAges.length > 0 && zoom === MAP_ZOOM_SCALE.recommend) {
      searchStoresByAge();
      return;
    }

    if (selectedAges.length === 0) {
      // zoom > 13 일 때 검색
      if (isResearchButtonPressed && zoom >= MAP_ZOOM_SCALE.basic) {
        searchStoresInRegion();
        setIsReadyToFirstSearch(false);
        return;
      }

      // zoom <= 13 일 때 검색
      else if (zoom === MAP_ZOOM_SCALE.basic) {
        searchStoresInRegion();
        return;
      }
    }
  }, [isPendingResearch, zoom, isResearchButtonPressed]);

  useEffect(() => {
    if (selectedAges.length === 0) {
      if (!isReadyToFirstSearch) {
        modifyZoomForSearch();

        setIsResearchButtonPressed(true);
        setIsPendingResearch(true);
      }

      return;
    }

    requestAnimationFrame(() => {
      modifyZoomForRecommend();
    });
  }, [selectedAges]);

  useEffect(() => {
    setFilteredStoreBasicInformation();
  }, [selectedChips, storeBasicInformation]);

  return (
    <>
      <S.MapScreenContainer>
        <S.NaverMap
          isShowLocationButton={hasLocationPermission}
          ref={mapRef}
          onCameraIdle={handleCameraIdle}
          onTapMap={handleNaverMapTab}
          isIndoorEnabled={true}
          isShowCompass={false}
          isShowZoomControls={false}
          isExtentBoundedInKorea={true}
          isTiltGesturesEnabled={false}>
          {filteredStoreBasicInformation.map((data, idx) => (
            <NaverMapMarkerOverlay
              key={idx}
              latitude={data.latitude}
              longitude={data.longitude}
              width={changeMarkerSize(idx, 30)}
              height={changeMarkerSize(idx, 40)}
              image={
                selectedAges.length > 0 && !isPendingResearch
                  ? IC_RECOMMEND_MARKER
                  : IC_RESTAURANT_MARKER
              }
              caption={{
                text: data.title,
                haloColor: GrayColors[0],
              }}
              onTap={() => handleMarkerTab(idx)}
            />
          ))}
        </S.NaverMap>

        <S.FloatingContainer>
          <S.SearchAndRecommendContainer>
            <PlaceSearchButton />
            <RecommendButton />
          </S.SearchAndRecommendContainer>
          <S.ChipContainer
            horizontal
            contentContainerStyle={{
              columnGap: scale(8),
              paddingHorizontal: scale(24),
            }}
            showsHorizontalScrollIndicator={false}>
            {chips.map((chip, index) => {
              return (
                <Chip
                  key={index}
                  isSelected={chip.isSelected}
                  label={chip.label}
                  onPressed={() => {
                    if (selectedMarker >= 0) {
                      setSelectedMarker(-1);
                    }

                    handleChipPressed(index);
                  }}
                />
              );
            })}
          </S.ChipContainer>
        </S.FloatingContainer>

        {isVisible && <ResearchButton onPress={handleResearchButtonPress} />}

        {selectedMarker >= 0 ? (
          <StoreBasicScreen />
        ) : (
          <NearStoreListScreen bottomSheetRef={bottomSheetRef} />
        )}
      </S.MapScreenContainer>
      {isLoading ? <LoadingIndicator /> : null}

      {/* 이미지 pre-load */}
      <S.InvisibleImage source={IC_RECOMMEND_MARKER} />
      <S.InvisibleImage source={IC_RESTAURANT_MARKER} />
    </>
  );
};

export default MapScreen;
