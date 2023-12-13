import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useSearchParams } from 'react-router-dom';
import searchButtonImage from '../../asset/image/ico_search.png';
import arrDownImage from '../../asset/image/arr_down.png';
import { createStyles, Group, Pagination, Select, Table, TextInput } from '@mantine/core';
import { APIUserList } from '../../api/UserAPI';
import { TUserDetails } from '../user/Profile';
import dayjs from 'dayjs';

import { LevelObject, UserTypeObject, LevelList } from '../../util/GlobalValues';

const USERSTATELIST = [
  { value: 'all', label: '회원상태' },
  { value: 'active', label: '가입회원' },
  { value: 'deleted', label: '탈퇴회원' },
  { value: 'suspended', label: '휴면회원' },
];

const useStyles = createStyles((theme) => ({
  header: {},
  table: {
    '& thead tr th': { borderBottom: '1px solid #121212 ', padding: '27px 0', textAlign: 'center' },
    '& tbody tr td': { borderBottom: '1px solid #121212 !important', padding: '27px 0', textAlign: 'center', fontSize: 14 },
  },
  tr: {},
}));

const CATEGORYLIST = [
  { value: 'all', label: '통합검색' },
  { value: 'user_id', label: '이메일' },
  { value: 'name', label: '이름' },
  { value: 'nickname', label: '닉네임' },
];

function UserList() {
  let [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { classes } = useStyles();
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [status, setStatus] = useState<string>('active');
  const [keyword, setKeyword] = useState<string>('');
  const [searchType, setSearchType] = useState<string>('all');
  const [userList, setUserList] = useState<TUserDetails[]>([]);
  const [level, setLevel] = useState<string>('');

  const getUserList = async (page: number, status: string, searchType: string, keyword: string, level: string) => {
    const data = {
      page: page,
      status: status,
      search_type: searchType,
      keyword: keyword,
      level: level,
    };

    console.log('ddd', data);
    const { list, total } = await APIUserList(data);
    console.log(list, total);
    setUserList(list);
    setTotal(total);
  };

  const rows = userList.map((element) => (
    <tr key={element.idx}>
      <td>{LevelObject[element.level]}</td>
      <td>{element.user_id}</td>
      <td>{element.name}</td>
      <td>{element.nickname}</td>
      <td>{element.phone}</td>
      <td>{dayjs(element.created_time).format('YYYY-MM-DD')}</td>
      <td>{UserTypeObject[element.type]}</td>
      {/*<td>{element.deleted_time ? '탈퇴회원' : element.suspended_time ? '휴면회원' : '가입회원'}</td>*/}
      <td>
        <UnderlinedTextButton onClick={() => navigate(`../userdetails/${element.idx}`)}>상세보기</UnderlinedTextButton>
      </td>
    </tr>
  ));

  const handlePage = (page: number) => {
    const status = searchParams.get('status') ?? 'active';
    const searchType = searchParams.get('searchType') ?? 'all';
    const keyword = searchParams.get('keyword') ?? '';
    const level = searchParams.get('level') ?? '';
    setSearchParams({ page: String(page), searchType, status, keyword, level });
  };

  useEffect(() => {
    const page = searchParams.get('page') ?? 1;
    const status = searchParams.get('status') ?? 'active';
    const searchType = searchParams.get('searchType') ?? 'all';
    const keyword = searchParams.get('keyword') ?? '';
    const level = searchParams.get('level') ?? '';

    setPage(Number(page));
    setStatus(status);
    setSearchType(searchType);
    setKeyword(keyword);
    setLevel(level);

    getUserList(Number(page), status, searchType, keyword, level);
  }, [searchParams]);

  return (
    <>
      <TopBox>
        <Group>
          <UnderLineBox>
            <Select
                rightSection={<DownIcon src={arrDownImage} />}
                styles={(theme) => ({
                    rightSection: { pointerEvents: 'none' },
                    label: { fontSize: 12, color: '#777' },
                    item: {
                        '&[data-selected]': {
                            '&, &:hover': {
                                backgroundColor: '#121212',
                                color: '#fff',
                            },
                        },
                    },
                })}
                variant="unstyled"
                value={level}
                data={LevelList}
                onChange={(value: string) => setLevel(value)}
            />
          </UnderLineBox>
          <UnderLineBox>
            <Select
              rightSection={<DownIcon src={arrDownImage} />}
              styles={(theme) => ({
                rightSection: { pointerEvents: 'none' },
                label: { fontSize: 12, color: '#777' },
                item: {
                  '&[data-selected]': {
                    '&, &:hover': {
                      backgroundColor: '#121212',
                      color: '#fff',
                    },
                  },
                },
              })}
              variant="unstyled"
              value={status}
              data={USERSTATELIST}
              onChange={(value: 'all' | 'active' | 'deleted' | 'suspended') => setStatus(value)}
            />
          </UnderLineBox>
          <UnderLineBox>
            <Select
              rightSection={<DownIcon src={arrDownImage} />}
              variant="unstyled"
              value={searchType}
              styles={(theme) => ({
                rightSection: { pointerEvents: 'none' },
                label: { fontSize: 12, color: '#777' },
                item: {
                  '&[data-selected]': {
                    '&, &:hover': {
                      backgroundColor: '#121212',
                      color: '#fff',
                    },
                  },
                },
              })}
              data={CATEGORYLIST}
              onChange={(value: 'all' | 'user_id' | 'name' | 'nickname') => setSearchType(value)}
            />
          </UnderLineBox>
          <SearchUnderLineBox>
            <TextInput
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              variant="unstyled"
              placeholder="검색"
              styles={(tehme) => ({
                label: { fontSize: 12, color: '#777' },
              })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setSearchParams({ page: String(page), searchType, status, keyword, level });
                }
              }}
              rightSection={
                <SearchButton onClick={() => setSearchParams({ page: String(page), searchType, status, keyword, level })} src={searchButtonImage} />
              }
            />
          </SearchUnderLineBox>
        </Group>

        <WhiteButton onClick={() => setSearchParams({})}>
          <WhiteButtonText>초기화</WhiteButtonText>
        </WhiteButton>
      </TopBox>
      <div >
        <Table verticalSpacing="xs" className={classes.table}>
          <thead className={classes.header}>
            <tr>
              <th>회원구분</th>
              <th>아이디(이메일)</th>
              <th>이름</th>
              <th>닉네임</th>
              <th>휴대폰</th>
              <th>가입일시</th>
              <th>가입구분</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </div>
      <PaginationBox>
        <Pagination
          page={page}
          total={Math.ceil(total / 20)}
          position="center"
          onChange={handlePage}
          styles={(theme) => ({
            item: {
              border: 'none',
              color: '#ccc',
              '&[data-active]': {
                backgroundColor: 'transparent',
                fontWeight: 'bold',
                color: 'black',
              },
            },
          })}
        />
      </PaginationBox>
    </>
  );
}

const UnderLineBox = styled.div`
  width: 120px;
  padding: 0px 5px;
  border-bottom: 1px solid #121212;
  text-align: left;
`;

const SearchUnderLineBox = styled(UnderLineBox)`
  width: 220px;
`;

const TopBox = styled.div`
  border-bottom: 1px solid #121212;
  height: 105px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 30px;
`;

const DownIcon = styled.img`
  width: 14px;
  height: 14px;
  cursor: pointer;
`;

const SearchButton = styled.img`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const WhiteButton = styled.div`
  width: 78px;
  height: 38px;
  border: 1px solid #121212;
  margin-left: 15px;
  cursor: pointer;
`;
const WhiteButtonText = styled.span`
  color: #121212;
  line-height: 38px;
  font-weight: 400;
  font-size: 12px;
`;

const UnderlinedTextButton = styled.span`
  color: #121212;
  font-size: 14px;
  font-weight: 400;
  text-decoration: underline;
  cursor: pointer;
`;

const PaginationBox = styled.div`
  margin: 20px 0;
`;
export default UserList;
