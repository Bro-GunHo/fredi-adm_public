import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import likeOffImage from '../../asset/image/heart_off.png';

import { APIDashboard, APIDashboardSnsList, APIDashboardSnsLikeList, APIDashboardSnsBookmarkList, APIDashboardUserList } from '../../api/SettingAPI';
import { TProducerListItem } from './ProducerList';
// import { TProductListItem } from './ProductList';
import { TUserDetails } from '../user/Profile';
import { TProductListItem } from './SnsList';
import { Pagination } from '@mantine/core';
import AlertModal from '../../components/Modal/AlertModal';
import axios from 'axios';
import {APICategoryList} from "../../api/CategoryAPI";
import {UserContext} from "../../context/user";
import {APIUserDetails} from "../../api/UserAPI";

export const CATEGORY_PRODUCER = {
  1: '아크릴',
  2: '목재',
  3: '스틸',
  4: '금속',
  5: '유리',
  6: '도자기',
};

function DashBoard() {
  const navigate = useNavigate();
  const [days, setDays] = useState(0);
  const [days2, setDays2] = useState(0);
  const [days3, setDays3] = useState(0);
  const [total, setTotal] = useState(0);
  const [total2, setTotal2] = useState(0);
    const [total3, setTotal3] = useState(0);
    const [total4, setTotal4] = useState(0);
  const [page, setPage] = useState<number>(1);
  const [page2, setPage2] = useState<number>(1);
  const [page3, setPage3] = useState<number>(1);
  const [page4, setPage4] = useState<number>(1);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const [data, setData] = useState<{
    todayVisitor: number;
    todaySign: number;
    todaySignCustomer: number;
    todaySignArtist: number;
    todaySignBrand:number;
    visitList: { name: string; uv: number }[];
  }>();
  const [snsList, setSnsList] = useState<TProductListItem[]>([]);
  const [snsList2, setSnsList2] = useState<TProductListItem[]>([]);
    const [userList, setUserList] = useState<TUserDetails[]>([]);
    const [snsList3, setSnsList3] = useState<TProductListItem[]>([]);

    const [CATEGORYLIST, setCATEGORYLIST] = useState<any>([
        { value: '1', label: 'all' },
    ]);

    const CATEGORY_PRODUCT = (arr:[]) =>{
        let val = '';
        if (CATEGORYLIST.length && arr?.length) {
            CATEGORYLIST.forEach(({label, value}: { label: string; value: string; }) => {
                // console.log({label, value});

                arr.forEach((key)=>{
                    if (key && value == key) {
                        if (val!=='') val+=', ';
                        val += label;
                        return false;
                    }
                })

            });
        }

        return val;
    };

    const getCategory = async () => {
        try {
            const res = await APICategoryList({ show:1 });
            let CATEGORYLIST = [
                { value: '1', label: 'all' }
            ];

            if (res.list.length > 0) {
                res.list.forEach(({idx, name}: {idx: string, name: string}) => {
                    CATEGORYLIST.push({ value: idx.toString(), label: name});
                });
            }
            setCATEGORYLIST(CATEGORYLIST);
        } catch (error) {
            console.log(error);
        }
    };

  const getDashboardData = async () => {
    const data = {
      days: days,
    };
    try {
      const result = await APIDashboard(data);
      console.log('chart', result);
      setData(result);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403 || error.response?.status === 401) {
          setShowAlert(true);
        }
      }
    }
  };

  const getSnsList = async () => {
    const data = {
      page: page,
      days: days2,
    };
    try {
      const { list, total } = await APIDashboardSnsList(data);
      console.log('APIDashboardSnsList', list, total);
      setSnsList(list);
      setTotal(total);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403 || error.response?.status === 401) {
          setShowAlert(true);
        }
      }
    }
  };

  const getSnsLikeList = async () => {
    const data = {
      page: page2,
      days: days2,
    };
    try {
      const { list, total } = await APIDashboardSnsLikeList(data);
      console.log('APIDashboardSnsLikeList', list, total);
      setSnsList2(list);
      setTotal2(total);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403 || error.response?.status === 401) {
          setShowAlert(true);
        }
      }
    }
  };

  const getSnsBookmarkList = async () => {
      const data = {
          page: page3,
          days: days2,
      };
      try {
          const { list, total } = await APIDashboardSnsLikeList(data);
          console.log('APIDashboardSnsLikeList', list, total);
          setSnsList3(list);
          setTotal3(total);
      } catch (error) {
          console.log(error);
          if (axios.isAxiosError(error)) {
              if (error.response?.status === 403 || error.response?.status === 401) {
                  setShowAlert(true);
              }
          }
      }
  };

  const getUserList = async () => {
      const data = {
          page: page4,
          days: days2,
      };
      try {
          const { list, total } = await APIDashboardUserList(data);
          console.log('user', list, total);
          setUserList(list);
          setTotal4(total);
      } catch (error) {
          console.log(error);
          if (axios.isAxiosError(error)) {
              if (error.response?.status === 403 || error.response?.status === 401) {
                  setShowAlert(true);
              }
          }
      }
  };

  useEffect(() => {
    getDashboardData();
  }, [days]);


  useEffect(() => {
      getCategory();
      getSnsList();
      getSnsLikeList();
      getSnsBookmarkList();
      getUserList()

    console.log(days2);
  }, [page, page2, page3, page4, days2]);


    const {user, patchUser} = useContext(UserContext);

    const getUserInfo = async () => {
        const result = await APIUserDetails();
        patchUser(result.idx, result.level);
    };

    useEffect(() => {
        getUserInfo();
    }, []);

    useEffect(()=>{
        if (user.idx && user.level>0) {
            alert('관리자만 접근할수 있습니다.');
            window.location.replace('/');
        }
    }, [user]);

  return (
    <>
      <TitleBox>
        <TitleText>접속자 / 가입자 현황</TitleText>
      </TitleBox>
      {/*<LikeProductTabButtonWrap>
        <TabButton selected={days3 === 1} onClick={() => setDays3(1)}>
          <TabButtonText selected={days3 === 1}>오늘</TabButtonText>
        </TabButton>
        <TabButton selected={days3 === 7} onClick={() => setDays3(7)}>
          <TabButtonText selected={days3 === 7}>7일</TabButtonText>
        </TabButton>
        <TabButton selected={days3 === 30} onClick={() => setDays3(30)}>
          <TabButtonText selected={days3 === 30}>30일</TabButtonText>
        </TabButton>
        <TabButton selected={days3 === 90} onClick={() => setDays3(90)}>
          <TabButtonText selected={days3 === 90}>90일</TabButtonText>
        </TabButton>
      </LikeProductTabButtonWrap>*/}

        <LikeProductTabButtonWrap>
          <TabButton selected={days === 0} onClick={() => setDays(0)}>
            <TabButtonText selected={days === 0}>오늘</TabButtonText>
          </TabButton>
          <TabButton selected={days === 7} onClick={() => setDays(7)}>
            <TabButtonText selected={days === 7}>7일</TabButtonText>
          </TabButton>
          <TabButton selected={days === 30} onClick={() => setDays(30)}>
            <TabButtonText selected={days === 30}>30일</TabButtonText>
          </TabButton>
          <TabButton selected={days === 90} onClick={() => setDays(90)}>
            <TabButtonText selected={days === 90}>90일</TabButtonText>
          </TabButton>
        </LikeProductTabButtonWrap>
      <RowWrap>
        <TodayStatusBox>
          <TodayStatusBoxSubTitle>접속자 수</TodayStatusBoxSubTitle>
          <CountText>
            {data?.todayVisitor} <TodayStatusBoxSubTitle>명</TodayStatusBoxSubTitle>
          </CountText>
        </TodayStatusBox>
        <TodayStatusBox isLast>
          <TodayStatusBoxSubTitle>가입자 수</TodayStatusBoxSubTitle>
          <CountText>
            {data?.todaySign} <TodayStatusBoxSubTitle>명</TodayStatusBoxSubTitle>
          </CountText>
        </TodayStatusBox>
        <TodayStatusBox isLast>
          <TodayStatusBoxSubTitle>Customer</TodayStatusBoxSubTitle>
          <CountText>
            {data?.todaySignCustomer??0} <TodayStatusBoxSubTitle>명</TodayStatusBoxSubTitle>
          </CountText>
        </TodayStatusBox>
        <TodayStatusBox isLast>
          <TodayStatusBoxSubTitle>Artist</TodayStatusBoxSubTitle>
          <CountText>
            {data?.todaySignArtist??0} <TodayStatusBoxSubTitle>명</TodayStatusBoxSubTitle>
          </CountText>
        </TodayStatusBox>
        <TodayStatusBox isLast>
          <TodayStatusBoxSubTitle>Brand</TodayStatusBoxSubTitle>
          <CountText>
            {data?.todaySignBrand??0} <TodayStatusBoxSubTitle>명</TodayStatusBoxSubTitle>
          </CountText>
        </TodayStatusBox>
      </RowWrap>
      <TitleBox>
        <TitleText>최근 접속자 수</TitleText>
      </TitleBox>
      <ChartBox>

        <ChartWrap>
          <ResponsiveContainer>
            <LineChart data={data?.visitList ?? []}>
              <Line type="linear" dataKey="count" stroke="#444444" isAnimationActive={false} />
              <XAxis dataKey="name" />
              <YAxis />
            </LineChart>
          </ResponsiveContainer>
        </ChartWrap>
      </ChartBox>
      <TitleBox>
        <TitleText>최근 7일 관심제품 등록 현황</TitleText>
      </TitleBox>
      <LikeProductTabButtonWrap>
        <TabButton selected={days2 === 0} onClick={() => setDays2(0)}>
          <TabButtonText selected={days2 === 0}>오늘</TabButtonText>
        </TabButton>
        <TabButton selected={days2 === 7} onClick={() => setDays2(7)}>
          <TabButtonText selected={days2 === 7}>7일</TabButtonText>
        </TabButton>
        <TabButton selected={days2 === 30} onClick={() => setDays2(30)}>
          <TabButtonText selected={days2 === 30}>30일</TabButtonText>
        </TabButton>
        <TabButton selected={days2 === 90} onClick={() => setDays2(90)}>
          <TabButtonText selected={days2 === 90}>90일</TabButtonText>
        </TabButton>
      </LikeProductTabButtonWrap>
      <ListWrap>
        <ListBox>
          <ListTitle>새로운 게시물</ListTitle>
          {snsList.map((item) => (
            <ListItemBox key={`product1-${item.idx}`}>
              <ItemImage src={item.image[0]?.file_name ?? ''} />
              <ItemContentBox>
                <ListItemTitleRowWrap>
                  <RowWrap>
                    <ItemTitle>[{CATEGORY_PRODUCT(item.category_arr)}]</ItemTitle>
                    <LikeCountWrap>
                      <LikeButton src={likeOffImage} />
                      <LikeCount>{item.like_count}</LikeCount>
                    </LikeCountWrap>
                  </RowWrap>
                </ListItemTitleRowWrap>
                <ItemSubTitle>{item.name}</ItemSubTitle>
              </ItemContentBox>
            </ListItemBox>
          ))}
          {total > 10 && (
            <PaginationBox>
              <Pagination
                page={page}
                total={total / 10 + 1}
                position="center"
                onChange={setPage}
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
          )}
        </ListBox>
        <ListBox isLast>
          <ListTitle>좋아요 많은 게시물</ListTitle>
          {snsList2.map((item) => (
              <ListItemBox key={`product2-${item.idx}`}>
              <ItemImage src={item.image[0]?.file_name ?? ''} />
              <ItemContentBox>
                <ListItemTitleRowWrap>
                  <RowWrap>
                    <ItemTitle>[{CATEGORY_PRODUCT(item.category_arr)}]</ItemTitle>
                    <LikeCountWrap>
                      <LikeButton src={likeOffImage} />
                      <LikeCount>{item.like_count}</LikeCount>
                    </LikeCountWrap>
                  </RowWrap>
                </ListItemTitleRowWrap>
                <ItemSubTitle>{item.name}</ItemSubTitle>
              </ItemContentBox>
            </ListItemBox>
          ))}
          {total2 > 10 && (
            <PaginationBox>
              <Pagination
                page={page2}
                total={total2 / 10 + 1}
                position="center"
                onChange={setPage2}
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
          )}
        </ListBox>
      </ListWrap>
      <ListWrap>
        <ListBox>
          <ListTitle>팔로워 많은 사용자</ListTitle>
            {userList.map((item) => (
            <ListItemBox key={`user-${item.idx}`}>
                {item.image?.file_name? <ItemImage src={item.image?.file_name ?? ''} />: <ItemNoImage >No Image</ItemNoImage>}
              <ItemContentBox>
                <ListItemTitleRowWrap>
                  <RowWrap>
                    <ItemTitle>{item.name}</ItemTitle>
                    <LikeCountWrap>
                      <LikeButton src={likeOffImage} />
                      <LikeCount>{item.followers}</LikeCount>
                    </LikeCountWrap>
                  </RowWrap>
                </ListItemTitleRowWrap>
                <ItemSubTitle>{item.nickname}</ItemSubTitle>
              </ItemContentBox>
            </ListItemBox>
            ))}
            {total4 > 10 && (
                <PaginationBox>
              <Pagination
                  page={page4}
                  total={total4 / 10 + 1}
                  position="center"
                  onChange={setPage4}
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
            )}
        </ListBox>
        <ListBox isLast>
          <ListTitle>북마크 많은 게시물</ListTitle>
            {snsList3.map((item) => (
                <ListItemBox key={`product3-${item.idx}`}>
              <ItemImage src={item.image[0]?.file_name ?? ''} />
              <ItemContentBox>
                <ListItemTitleRowWrap>
                  <RowWrap>
                    <ItemTitle>[{CATEGORY_PRODUCT(item.category_arr)}]</ItemTitle>
                    <LikeCountWrap>
                      <LikeButton src={likeOffImage} />
                      <LikeCount>{item.bookmark_count}</LikeCount>
                    </LikeCountWrap>
                  </RowWrap>
                </ListItemTitleRowWrap>
                <ItemSubTitle>{item.name}</ItemSubTitle>
              </ItemContentBox>
            </ListItemBox>
            ))}
            {total3 > 10 && (
                <PaginationBox>
                  <Pagination
                      page={page3}
                      total={total3 / 10 + 1}
                      position="center"
                      onChange={setPage3}
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
            )}
        </ListBox>
      </ListWrap>
      <AlertModal
        visible={showAlert}
        setVisible={setShowAlert}
        onClick={() => {
          setShowAlert(false);
          navigate('/');
        }}
        text="접근 권한이 없습니다."
      />
    </>
  );
}

const TitleBox = styled.div`
  border-bottom: 1px solid #121212;
  height: 57px;
  display: flex;
  align-items: center;
  padding-left: 15px;
`;

const TitleText = styled.span`
  font-weight: 700;
  font-size: 18px;
  color: #121212;
`;

const RowWrap = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const TodayStatusBox = styled.div<{ isLast?: boolean }>`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  border-top: 1px solid #121212;
  border-bottom: 1px solid #121212;
  padding: 35px 15px;
  border-right: ${(props) => (props.isLast ? 0 : ' 1px solid #121212')};
`;

const TodayStatusBoxSubTitle = styled.span`
  font-weight: 500;
  font-size: 12px;
  color: #121212;
`;

const CountText = styled.span`
  font-weight: 700;
  font-size: 36px;
  color: #121212;
  letter-spacing: -1px;
`;

const ChartBox = styled.div`
  border-bottom: 1px solid #121212;
  padding: 15px;
`;

const ChartWrap = styled.div`
  width: 100%;
  height: 310px;
  background-color: #f5f5f5;
  padding: 25px 25px 0px 0;
`;

const TabButtonWrap = styled.div`
  display: flex;
  margin-bottom: 15px;
`;

const LikeProductTabButtonWrap = styled.div`
  display: flex;
  margin: 15px;
`;

const TabButton = styled.div<{ selected: boolean }>`
  background-color: ${(props) => (props.selected ? '#121212' : '#fff')};
  border: 1px solid #121212;
  width: 78px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
  cursor: pointer;
`;

const TabButtonText = styled.span<{ selected: boolean }>`
  font-weight: 400;
  font-size: 12px;
  color: ${(props) => (props.selected ? '#fff' : '#121212')};
`;

const ListWrap = styled.div`
  display: flex;
  flex: 1;
  border-top: 1px solid;
`;

const ListBox = styled.div<{ isLast?: boolean }>`
  display: flex;
  flex: 1;
  padding: 20px 15px;
  border-right: ${(props) => (props.isLast ? 0 : '1px solid #121212')};
  flex-direction: column;
  align-items: flex-start;
`;

const ListItemBox = styled.div`
  display: flex;
  margin-top: 10px;
  width: 100%;
`;

const ItemImage = styled.img`
  display: block;
  width: 145px;
  height: 145px;
`;

const ItemNoImage = styled.div`
  display: flex;
  width: 145px;
  height: 145px;
  border:1px solid #222;
  font-size:11px;
  justify-content:center;
  align-items:center;
`;


const ItemContentBox = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-end;
  padding: 0 10px;
`;

const ItemTitle = styled.span`
  font-weight: 700;
  font-size: 12px;
  color: #121212;
`;

const ItemSubTitle = styled(ItemTitle)`
  font-weight: 500;
  align-self: flex-start;
`;

const LikeCount = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #121212;
`;

const LikeButton = styled.img`
  width: 18px;
  height: 18px;
  margin-right: 6px;
`;

const ListItemTitleRowWrap = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const ListTitle = styled(TitleText)`
  margin-bottom: 10px;
`;
const LikeCountWrap = styled.div``;

const PaginationBox = styled.div`
  margin: 20px 0;
  display: flex;
  width: 100%;
  justify-content: center;
`;

export default DashBoard;
