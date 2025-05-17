import React from 'react';

import * as S from './styles';

import {formatDateToString} from '../../../../../utils/format';
import {IC_CLOSE, IC_SEARCH} from '../../../../../constants/icons';
import {GetRecentSearchPlacesResponse} from '../../../../../services/mapService';

interface SearchHistoryProps extends GetRecentSearchPlacesResponse {
  itemPressed: (id: number) => void;
  deletePressed: (id: number) => void;
}

const SearchHistory = ({
  itemPressed,
  deletePressed,
  id,
  searchTerm,
  createAt,
}: SearchHistoryProps) => {
  return (
    <S.SearchHistoryContainer onPress={() => itemPressed(id)}>
      <S.Icon source={IC_SEARCH} />
      <S.Address>{searchTerm}</S.Address>
      <S.DateCloseContainer>
        <S.SearchDate>{formatDateToString(new Date(createAt))}</S.SearchDate>
        <S.IconContainer onPress={() => deletePressed(id)}>
          <S.Icon source={IC_CLOSE} />
        </S.IconContainer>
      </S.DateCloseContainer>
    </S.SearchHistoryContainer>
  );
};

export default SearchHistory;
