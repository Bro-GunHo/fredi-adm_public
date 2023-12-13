/*
 * Copyright (c) 2023. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

import React, {useContext, useLayoutEffect, useEffect} from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Layout from './components/Layout/Layout';
import AskInfo from './page/contact/AskInfo';
import AskList from './page/contact/AskList';
import DashBoard from './page/admin/DashBoard';
import FaqList from './page/contact/FaqList';
import FaqListAdmin from './page/admin/FaqListAdmin';
import Home from './page/product/Home';
import RegisterAsk from './page/contact/RegisterAsk';
import RegisterFaq from './page/admin/RegisterFaq';
import RegisterProduct from './page/admin/RegisterProduct';
import SettingCompanyInfo from './page/admin/SettingCompanyInfo';
import SettingTerms from './page/admin/SettingTerms';
import SignIn from './page/user/SignIn';
import UserDetails from './page/admin/UserDetails';
import UserList from './page/admin/UserList';
import Admin from './page/admin/Admin';
import Contact from './page/contact/Contact';
import AskListAdmin from './page/admin/AskListAdmin';
import ProductList from './page/admin/ProductList';
import ProducerList from './page/admin/ProducerList';
import RegisterProducer from './page/admin/RegisterProducer';
import ModifyUserInfo from './page/user/ModifyUserInfo';
import StoredAskList from './page/admin/StoredAskList';
import SettingBanner from './page/admin/SettingBanner';
import {UserContext} from './context/user';
import {APIUserDetails} from './api/UserAPI';
import Privacy from './page/user/Privacy';
import RegisterShopAsk from './page/contact/RegisterShopAsk';
import ShopAskList from './page/user/ShopAskList';

import ArtworkList from './page/admin/ArtworkList';
import RegisterArtwork from './page/admin/RegisterArtwork';

import FairList from './page/admin/FairList';
import RegisterFair from './page/admin/RegisterFair';
import WeeklyList from './page/admin/WeeklyList';
import RegisterWeekly from './page/admin/RegisterWeekly';
import SnsFeaturedList from './page/admin/SnsFeaturedList';

import SnsList from './page/admin/SnsList';
import RegisterSns from './page/admin/RegisterSns';

import ReportUserList from './page/admin/ReportUserList';
import ReportSnsList from './page/admin/ReportSnsList';
import SellingList from './page/admin/SellingList';
import RegisterSelling from './page/admin/RegisterSelling';
import CategoryList from './page/admin/CategoryList';
import RegisterCategory from './page/admin/RegisterCategory';

import NoHome from './page/product/NoHome';

function Router() {



    return (
        <BrowserRouter>
          <Layout>
            <Routes>
            {/* '작품보기' 메인 페이지 */}

              {/* 'manager' 라우터 */}
              <Route path="adm/*" element={<Admin />}>
                {/* 'manager' - 메인 페이지 */}
                  <Route index element={<DashBoard />} />

                  <Route path="registercategory" element={<RegisterCategory />} />
                  <Route path="category/:idx" element={<RegisterCategory />} />
                  <Route path="categorylist" element={<CategoryList />} />


                   <Route path="sellinglist" element={<SellingList />} />
                  <Route path="selling/:idx" element={<RegisterSelling />} />

                  <Route path="reportuserlist" element={<ReportUserList />} />

                  <Route path="reportsnslist" element={<ReportSnsList />} />


                  {/* 'fair' - 페어 ' */}
                  <Route path="fairlist" element={<FairList />} />
                  <Route path="registerfair" element={<RegisterFair />} />
                  <Route path="fair/:idx" element={<RegisterFair />} />

                  {/* 'weekly' - 위클리에디션 ' */}
                  <Route path="weeklylist" element={<WeeklyList />} />
                  <Route path="registerweekly" element={<RegisterWeekly />} />
                  <Route path="weekly/:idx" element={<RegisterWeekly />} />

                  {/* 'featured works' - 피쳐드SNS ' */}
                  <Route path="discoverfeaturedlist" element={<SnsFeaturedList />} />

                  {/* 'sns' - 디스커버 ' */}
                  <Route path="discoverlist" element={<SnsList />} />
                  <Route path="registerdiscover" element={<RegisterSns />} />
                  <Route path="discover/:idx" element={<RegisterSns />} />


                  {/* 'artwork' - 아트워크 ' */}
                  <Route path="artworklist" element={<ArtworkList />} />
                  <Route path="registerartwork" element={<RegisterArtwork />} />
                  <Route path="artwork/:idx" element={<RegisterArtwork />} />

                  {/* 'manager' - 약관 관리 페이지 */}
                  <Route path="settingterms" element={<SettingTerms />} />
                  {/* 'manager' - 회원 관리 페이지 */}
                  <Route path="userlist" element={<UserList />} />
                  {/* 'manager' - 회사 정보 관리 페이지 */}
                  <Route path="settingcompanyinfo" element={<SettingCompanyInfo />} />
                  {/* 'manager' - 회원 상세 페이지 */}
                  <Route path="userdetails/:idx" element={<UserDetails />} />
                  {/* 'manager' - FAQ 관리 페이지 */}
                  <Route path="faqlist" element={<FaqListAdmin />} />
                  {/* 'manager' - FAQ 등록 페이지 */}
                  <Route path="registerfaq" element={<RegisterFaq />} />
                  {/* 'manager' - designer product 등록 페이지 */}
                  <Route path="registerproduct" element={<RegisterProduct />} />
                  {/* 'manager' - designer product 수정 페이지 */}
                  <Route path="product/:idx" element={<RegisterProduct />} />
                  {/* 'manager' - producing 등록 페이지 */}
                  <Route path="registerproducer" element={<RegisterProducer />} />
                  {/* 'manager' - producing 수정 페이지 */}
                  <Route path="producer/:idx" element={<RegisterProducer />} />
                  {/* 'manager' - 문의글 답변 등록 페이지(문의글 목록) */}
                  <Route path="asklist" element={<AskListAdmin />} />
                  {/* 'manager' - 보관된 문의골 페이지 */}
                  <Route path="asklist-stored" element={<StoredAskList />} />
                  {/* 'manager' - Designer Product 관리 페이지 */}
                  <Route path="productlist" element={<ProductList />} />
                  {/* 'manager' - Producing 관리 페이지 */}
                  <Route path="producerlist" element={<ProducerList />} />
                  {/* 'manager' - Designer Product 배너 관리 페이지 */}
                  <Route path="settingbanner" element={<SettingBanner />} />

                  {/* 개인정보 수정 페이지 */}
                  <Route path="modifyuserinfo" element={<ModifyUserInfo />} />

                  {/*<Route path="signin" element={<SignIn />} />*/}
            </Route>

                <Route path="auth/signin" element={<SignIn />} />


                <Route path="/" element={<NoHome />} />

          {/*<Route path="adm/*" element={<Admin />}>*/}
          {/*<Route path="/" element={<Home />} />
               로그인 페이지



               카카오 회원가입 페이지
              <Route path="/kakao" element={<Kakao />} />
               네이버 회원가입 페이지
              <Route path="/naver" element={<Naver />} />
               상품문의내역 페이지
              <Route index path="/asklist-shop" element={<ShopAskList />} />
               '고객센터' 라우터
              <Route path="/contact/*" element={<Contact />}>
             '고객센터' - 1:1문의 페이지
                  <Route index path="asklist" element={<AskList />} />
                   '고객센터' - 1:1문의 등록 페이지
                  <Route path="registerask" element={<RegisterAsk />} />
                   '고객센터' - 1:1문의 수정 페이지
                  <Route path="registerask/:idx" element={<RegisterAsk />} />
                   '고객센터' - 입점문의 페이지
                  <Route path="askinfo" element={<AskInfo />} />
                   '고객센터' - FAQ 페이지
                  <Route path="faqlist" element={<FaqList />} />
                   '고객센터' - shop 1:1문의 등록 페이지
                  <Route path="registerask-shop" element={<RegisterShopAsk />} />
          </Route>*/}

          {/* 앱 심사를 위한 페이지 - 사용하지 않음 */}
          <Route path="privacy" element={<Privacy />} />

          {/* 페이지가 없을 때 */}
          <Route
              path="*"
              element={
                  <main style={{padding: '1rem'}}>
                    <p>No Page</p>
                  </main>
              } />
        </Routes>
      </Layout>
    </BrowserRouter>
    );
}

export default Router;
