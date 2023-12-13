import React, { useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const MenuList = [
  {
    idx: 'Main',
    title: '대시보드',
    subTitleList: null,
    route: '/adm',
  },
  {
      idx: 'User',
      title: '회원 관리',
      subTitleList: null,
      route: '/adm/userlist',
      //     [
      //     {
      //         idx: 'Userlist',
      //         title: '회원관리',
      //
      //     },
      //     {
      //         idx: 'UserlistOut',
      //         title: '탈퇴 회원 관리',
      //         route: '/userlist-out',
      //     },
      // ],
  },

  { idx: 'Fair', title: 'FAIR', subTitleList: null, route: '/adm/fairlist', },//개발필요
  { idx: 'Artworks', title: 'ARTWORKS', subTitleList: null, route: '/adm/artworklist', },//개발필요
  { idx: 'Banners', title: '메인화면 관리', subTitleList:
      [
          { idx: 'weekly', title: 'Weekly Edition 관리', route: '/adm/weeklylist' },//개발필요
          { idx: 'featured', title: 'Featured works 관리', route: '/adm/discoverfeaturedlist' },//개발필요
          { idx: 'Banner', title: '배너 관리', route: '/adm/settingbanner' },
      ]
  },
  { idx: 'sns', title: 'Discover 관리', subTitleList: null, route: '/adm/discoverlist' },//개발필요

 /* {//제거예정
    idx: 'Product',
    title: 'Designer Product 관리',
    subTitleList: [
      {
        idx: 'Banner',
        title: 'Designer Product 배너 관리',
        route: '/adm/settingbanner',
      },
      {
        idx: 'Product-Register',
        title: 'Artwork 등록',
        route: '/adm/registerproduct',
      },
      { idx: 'Product-Manage', title: 'Designer Product 관리', route: '/adm/productlist' },
    ],
  },*/

    {
      idx: 'Report',
      title:'신고 관리',
      subTitleList: [
          { idx: 'Report-Lis', title: '게시글 신고 관리', route: '/adm/reportsnslist' },
          { idx: 'Report-User-Lis', title: '사용자 신고 관리', route: '/adm/reportuserlist' },
      ]
    },
  {
    idx: 'Board',
    title: '문의 관리',
    subTitleList: [
      { idx: 'Ask-Lis', title: '1:1 Meassage 관리', route: '/adm/asklist' },

      {
        idx: 'Ask-Store',
        title: '보관된 Meassage',
        route: '/adm/asklist-stored',
      },
      { idx: 'selling-Lis', title: 'Selling 관리', route: '/adm/sellinglist' },//개발필요
      {
        idx: 'FAQ',
        title: 'FAQ 관리',
        route: '/adm/faqlist',
      },
    ],
  },

  {
    idx: 'Setting',
    title: '설정',
    subTitleList: [
      {
        idx: 'Setting-Terms',
        title: '약관관리',
        route: '/adm/settingterms',
      },
      {
        idx: 'Setting-Info',
        title: '회사정보',
        route: '/adm/settingcompanyinfo',
      },
      {//개발필요
          idx: 'Category-Info',
          title: '카테고리 관리',
          route: '/adm/categorylist',
      },
    ],
    selected: false,
  },
];

function AdminNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selected, setSelected] = useState<String[]>([]);
  const [showMenu, setShowMenu] = useState<String>('');

  const handleMenu = (type: 'main' | 'sub', idx: string) => {
    if (type === 'main') {
      const menu = MenuList.find((menu) => menu.idx === idx);
      if (menu) {
        setShowMenu(menu.idx);
        if (!menu.subTitleList) {
          navigate(menu.route);
          setSelected([menu.idx]);
        }
      }
    } else {
      const menu = MenuList.find((menu) => menu.idx === showMenu);
      if (menu) {
        const subMenu = menu.subTitleList ? menu.subTitleList.find((subMenu) => subMenu.idx === idx) : null;
        setShowMenu(menu.idx);
        if (subMenu) {
          navigate(subMenu.route);
          setSelected([menu.idx, subMenu.idx]);
        }
      }
    }
  };

  return (
    <LeftBox>
      <MenuBox>
        {MenuList.map((menu, index) => (
          <div key={menu.idx}>
            <MenuButton onClick={() => handleMenu('main', menu.idx)}>
              {menu.idx === showMenu && <Hyphen>―</Hyphen>}
              <MenuButtonText>{menu.title}</MenuButtonText>
            </MenuButton>

            {menu.idx === showMenu &&
              menu.subTitleList &&
              menu.subTitleList.map((subMenu) => (
                <InnerMenuBox key={subMenu.idx}>
                  <InnerMenuButton onClick={() => handleMenu('sub', subMenu.idx)}>
                    <InnerMenuButtonText style={{ fontWeight: selected.indexOf(subMenu.idx) > -1 ? 'bold' : undefined }}>
                      {subMenu.title}
                    </InnerMenuButtonText>
                  </InnerMenuButton>
                </InnerMenuBox>
              ))}
          </div>
        ))}
      </MenuBox>
    </LeftBox>
  );
}

const LeftBox = styled.div`
  display: flex;
  min-width: 290px;
  width: 400px;
  flex-direction: column;
  text-align: left;
  border-right: 1px solid #121212;
`;

const SubTitle = styled.h4`
  margin: 0;
  font-weight: 500;
  color: #121212;
  font-size: 16px;
`;

const MenuBox = styled.div`
  margin-top: 40px;
`;

const MenuButton = styled.div`
  padding: 5px 0;
  display: flex;
  cursor: pointer;
  line-height: 30px;
  padding-left: 50px;
  margin-top: 10px;
  cursor: pointer;
`;

const MenuButtonText = styled(SubTitle)`
  font-weight: 700;
  height: 100%;
`;

const Hyphen = styled.span`
  font-size: 12px;
  margin-right: 7px;
  display: inline-block;
  color: #121211;
`;

const InnerMenuBox = styled.div`
  width: 100%;
  background-color: #f5f5f5;
  padding-left: 70px;
`;

const InnerMenuButton = styled.div`
  width: 100%;
  padding: 10px 0;
  cursor: pointer;
`;

const InnerMenuButtonText = styled.span`
  color: #121212;
  font-weight: 400;
  font-size: 15px;
`;

export default AdminNav;
