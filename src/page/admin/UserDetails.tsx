import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { Modal, Select } from '@mantine/core';
import arrDownImage from '../../asset/image/arr_down.png';
import { APIDeleteAccountAdmin, APIModifyPassword, APIModifyUserDetailsAdmin, APIUserDetails, checkNicknameExcludeUser, APIModifyUserAddressAdmin, APIUserRecover } from '../../api/UserAPI';
import { TUserDetails } from '../user/Profile';
import dayjs from 'dayjs';
import { passwordReg, phoneReg } from '../../util/Reg';
import AlertModal from '../../components/Modal/AlertModal';
import PostModal from '../../components/Modal/PostModal';

import { LevelObject, LevelList, UserTypeObject } from '../../util/GlobalValues';

const STATUSLIST = [
  { value: 'active', label: '가입' },
  { value: 'deleted', label: '탈퇴' },
  { value: 'suspended', label: '휴면' },
];



//
// const LEVELLIST = [
//   { value: '1', label: '입점업체회원' },
//   { value: '2', label: '일반회원2' },
//   { value: '3', label: '일반회원1' },
// ];

const TRANDING_LIST = [
    {value: 'Y', label: '노출'},
    {value: 'N', label: '미노출'},
];

const LEVELLIST = LevelList;

function UserDetails() {
  const { idx } = useParams();

  const navigate = useNavigate();

  const [alertType, setAlertType] = useState<
    | 'originalNickname'
    | 'nicknameEmpty'
    | 'nicknameAvailable'
    | 'nicknameDuplicated'
    | 'passwordEmpty'
    | 'originalPhone'
    | 'password'
    | 'passwordDiffrent'
    | 'passwordReg'
    | 'phoneReg'
    | 'modified'
  >();
  const [alertModal, setAlertModal] = useState(false);
  const [showDeleteAccountConfirmModal, setShowDeleteAccountConfirmModal] = useState(false);
    const [showRestoreAccountConfirmModal, setShowRestoreAccountConfirmModal] = useState(false);

  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
    const [showPostModal, setShowPostModal] = useState(false)

  const [userDetails, setUserDetails] = useState<TUserDetails>();
  const [isSnsUser, setIsSnsUser] = useState(false);

  const [originalNickname, setOriginalNickname] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [isDuplicatedNickname, setIsDuplicatedNickname] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>('');

  const [newPassword, setNewPassword] = useState<string>('');
  const [newPassword2, setNewPassword2] = useState<string>('');

  const isOriginalNickname = nickname === originalNickname;
  const testPasswordReg = passwordReg.test(newPassword);
  const testPhoneReg = phoneReg.test(phone);

  const [status, setStatus] = useState<'active' | 'deleted' | 'suspended'>();
  const [level, setLevel] = useState<'0' | '1' | '2' | '3'>();

  const [isTranding, setIsTranding] = useState<'Y' | 'N'>('Y');
    const [showAddressChangeModal, setShowAddressChangeModal] = useState(false);

    const [address1, setAddress1] = useState("")
    const [address2, setAddress2] = useState("")
    const [zipcode, setZipcode] = useState("")

  const getUserDetails = async () => {
    console.log(idx);
    const data = {
      idx: Number(idx),
    };
    try {
      const res = await APIUserDetails(data);
      console.log(res);
      setUserDetails(res);
      setNickname(res.nickname);
      setOriginalNickname(res.nickname);
      setPhone(res.phone);
      setStatus(res.deleted_time ? 'deleted' : res.suspended_time ? 'suspended' : 'active');
      setLevel(res.level === 0 ? '0' : res.level === 1 ? '1' : res.level === 2 ? '2' : '3');
      setIsSnsUser(res.type !== 1 ? true : false);
      setIsTranding(res.is_tranding);
        setAddress1(res.address1)
        setAddress2(res.address2)
        setZipcode(res.zipcode)
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const onCheckNickname = async () => {
    if (isOriginalNickname) return setAlertType('originalNickname');
    if (!nickname) return setAlertType('nicknameEmpty');
    try {
      const data = {
        user_idx: Number(idx),
        nickname: nickname,
      };
      const res = await checkNicknameExcludeUser(data);
      console.log(res);
      setAlertType('nicknameAvailable');
      setIsDuplicatedNickname(false);
    } catch (error) {
      console.log(error);
      setIsDuplicatedNickname(true);
      setAlertType('nicknameDuplicated');
      setNickname('');
    }
  };

  const onModifyPassword = async () => {
    if (!newPassword) return setAlertType('passwordReg');
    if (!testPasswordReg) return setAlertType('passwordReg');
    if (newPassword !== newPassword2) return setAlertType('passwordDiffrent');
    try {
      const data = {
        idx: Number(idx),
        password: newPassword,
      };
      const res = await APIModifyPassword(data);
      console.log(res);
      setAlertType('password');
      setNewPassword('');
      setNewPassword2('');
    } catch (error) {
      console.log(error);
    }
  };

  const onModifyUserInfo = async () => {
    if (isDuplicatedNickname) return setAlertType('nicknameDuplicated');
    if (!testPhoneReg) return setAlertType('phoneReg');

    const data = {
      user_idx: Number(idx),
      phone: phone,
      nickname: nickname,
      status: status,
      level: level,
      is_tranding: level=='2'? isTranding:'N',
    };

    try {
      const res = await APIModifyUserDetailsAdmin(data);
      console.log(res);
      setAlertType('modified');
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const onDeleteAccount = async () => {
    setShowDeleteAccountConfirmModal(false);
    const data = {
      idx: Number(idx),
    };
    try {
      const res = await APIDeleteAccountAdmin(data);
      console.log(res);
      setShowDeleteAccountModal(true);
        getUserDetails();
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

    const handleRestoreUser = async () =>{
      try {
          const response = await APIUserRecover({idx: Number(idx) });
          //const { state, logisticCorrect } = await APIUserRecover(idx);
          console.log('response', response);
          getUserDetails();
      } catch (error) {
          console.error(error);
          alert("송장번호 입력이 실패했습니다.");
      }
    }

    const onModifyAddress = async () => {

        //profile-address-admin
        const data = {
            user_idx: Number(idx),
            address1: address1,
            address2: address2,
            zipcode: zipcode,
        }

        try {
            const res = await APIModifyUserAddressAdmin(data)
            console.log(res)
            setAlertType("modified")
            setShowAddressChangeModal(false);
            getUserDetails()
        } catch (error) {
            console.log(error)
            alert(error)
        }
    }

  useEffect(() => {
    getUserDetails();
  }, []);

  useEffect(() => {
    if (alertType) {
      setAlertModal(true);
    }
  }, [alertType]);

  useEffect(() => {
    if (isOriginalNickname) {
      setIsDuplicatedNickname(false);
    } else {
      setIsDuplicatedNickname(true);
    }
  }, [nickname]);

  return (
    <>
        {level =='2'?
            <RowWap>
              <LeftText>Tranding Artist</LeftText>
              <UnderLineBox>
                <Select
                    rightSection={<DownIcon src={arrDownImage} />}
                    styles={(theme) => ({
                        rightSection: { pointerEvents: 'none' },
                        root: { width: '100%' },
                        input: { fontSize: 16 },
                        item: {
                            '&[data-selected]': {
                                '&, &:hover': {
                                    backgroundColor: '#121212',
                                    color: '#fff',
                                },
                            },
                            fontSize: 16,
                        },
                    })}
                    variant="unstyled"
                    value={isTranding}
                    onChange={(value: 'N' | 'Y') => setIsTranding(value)}
                    data={TRANDING_LIST}
                />
              </UnderLineBox>
            </RowWap>
        :null
        }
      <RowWap>
        <LeftText>아이디</LeftText>
        <RightText>{userDetails?.user_id}</RightText>
      </RowWap>
      <RowWap>
        <LeftText>회원등급</LeftText>
        <UnderLineBox>
          <Select
            rightSection={<DownIcon src={arrDownImage} />}
            styles={(theme) => ({
              rightSection: { pointerEvents: 'none' },
              root: { width: '100%' },
              input: { fontSize: 16 },
              item: {
                '&[data-selected]': {
                  '&, &:hover': {
                    backgroundColor: '#121212',
                    color: '#fff',
                  },
                },
                fontSize: 16,
              },
            })}
            variant="unstyled"
            value={level}
            onChange={(value: '0' | '1' | '2' | '3') => setLevel(value)}
            data={LEVELLIST}
          />
        </UnderLineBox>
      </RowWap>
      <RowWap>
        <LeftText>이름</LeftText>
        <RightText>{userDetails?.name}</RightText>
      </RowWap>
      <RowWap>
        <LeftText>닉네임</LeftText>
        <TextInput maxLength={10} value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="닉네임 입력" />
        <UnderlineTextButton onClick={onCheckNickname}>중복확인</UnderlineTextButton>
      </RowWap>
      <RowWap>
        <LeftText>휴대폰번호</LeftText>
        <TextInput value={phone} maxLength={11} onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))} placeholder="휴대폰 번호 입력" />
      </RowWap>
      {/*<RowWap>
        <LeftText>성별</LeftText>
        <RightText>{userDetails?.gender === 1 ? '남자' : '여자'}</RightText>
      </RowWap>
      <RowWap>
        <LeftText>생년월일</LeftText>
        <RightText>{userDetails?.birth}</RightText>
      </RowWap>*/}
      {!isSnsUser && (
        <>
          <RowWap>
            <LeftText>비밀번호</LeftText>
            <TextInput
              maxLength={16}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="새 비밀번호"
              type="password"
            />
          </RowWap>
          <RowWap>
            <LeftText></LeftText>
            <TextInput
              maxLength={16}
              value={newPassword2}
              onChange={(e) => setNewPassword2(e.target.value)}
              placeholder="새 비밀번호 확인"
              type="password"
            />
            <UnderlineTextButton onClick={onModifyPassword}>변경하기</UnderlineTextButton>
          </RowWap>
        </>
      )}

      <RowWap>
        <LeftText>가입구분</LeftText>
        <RightText>{UserTypeObject[userDetails?.type ?? 1]}</RightText>
      </RowWap>
      <RowWap >
          <LeftText>주소</LeftText>
          <RightText>{userDetails?.zipcode?`[${zipcode}]`:''} {address1} {address2}</RightText>
        <UnderlineTextButton onClick={()=>setShowAddressChangeModal(true)}>변경하기</UnderlineTextButton>
      </RowWap>
      <RowWap>
        <LeftText>상태</LeftText>
        <RightText>{status=='active'? '가입': status=='deleted'? '탈퇴':'휴면'}</RightText>
        {/*<UnderLineBox>
          <Select
            rightSection={<DownIcon src={arrDownImage} />}
            styles={(theme) => ({
              rightSection: { pointerEvents: 'none' },
              root: { width: '100%' },
              input: { fontSize: 16 },
              item: {
                '&[data-selected]': {
                  '&, &:hover': {
                    backgroundColor: '#121212',
                    color: '#fff',
                  },
                },
                fontSize: 16,
              },
            })}
            variant="unstyled"
            value={status}
            onChange={(value: 'active' | 'deleted' | 'suspended') => setStatus(value)}
            data={STATUSLIST}
          />
        </UnderLineBox>*/}
      </RowWap>
      <RowWap>
        <LeftText>가입일시</LeftText>
        <RightText>{dayjs(userDetails?.created_time).format('YYYY-MM-DD HH:mm:ss')}</RightText>
      </RowWap>
      <RowWap>
        <LeftText>최근 로그인 일시</LeftText>
        <RightText>{userDetails?.login_time ? dayjs(userDetails?.login_time).format('YYYY-MM-DD HH:mm:ss') : '-'}</RightText>
      </RowWap>
      <RowWap>
        <LeftText>방문 횟수</LeftText>
        <RightText>{userDetails?.visit_count}회</RightText>
      </RowWap>
      <RowWap>
        <LeftText>탈퇴일시</LeftText>
        <RightText>{userDetails?.deleted_time ? dayjs(userDetails?.deleted_time).format('YYYY-MM-DD HH:mm:ss') : '-'}</RightText>
      </RowWap>
      <RowWap>
        <LeftText>회원탈퇴 메모</LeftText>
        <RightText>{userDetails?.reason ?? '-'}</RightText>
      </RowWap>
      <ButtonRowWrap>
        <Button onClick={onModifyUserInfo} type="black">
          <ButtonText type="black">수정</ButtonText>
        </Button>
        <Button type="white" onClick={() => navigate(-1)}>
          <ButtonText type="white">이전</ButtonText>
        </Button>
        {userDetails?.deleted_time ?
            (<Button onClick={()=>setShowRestoreAccountConfirmModal(true)} type="green">
            <ButtonText type="green">복원</ButtonText>
          </Button>)
          :
            (
                <Button onClick={() => setShowDeleteAccountConfirmModal(true)} type="green">
            <ButtonText type="green">탈퇴</ButtonText>
          </Button>
            )
        }
      </ButtonRowWrap>
      <AlertModal
        visible={alertModal}
        setVisible={setAlertModal}
        onClick={() => {
          setAlertModal(false);
          setAlertType(undefined);
        }}
        text={
          alertType === 'nicknameDuplicated'
            ? '중복된 닉네임입니다.'
            : alertType === 'nicknameEmpty'
            ? '닉네임을 입력해 주세요.'
            : alertType === 'nicknameAvailable'
            ? '사용 가능한 닉네임입니다.'
            : alertType === 'phoneReg'
            ? '휴대폰 번호를 올바르게 입력해 주세요.'
            : alertType === 'originalPhone'
            ? '기존 휴대폰 번호와 같습니다.'
            : alertType === 'originalNickname'
            ? '기존 닉네임과 같습니다.'
            : alertType === 'passwordReg'
            ? '비밀번호는 8-16자 영문, 숫자로 구성되어야 합니다.'
            : alertType === 'password'
            ? '비밀번호가 변경되었습니다.'
            : alertType === 'passwordDiffrent'
            ? '비밀번호와 비밀번호 확인이 일치하지 않습니다.'
            : alertType === 'modified'
            ? '유저 정보가 수정되었습니다.'
            : ''
        }
      />
      <AlertModal
        visible={showDeleteAccountModal}
        setVisible={setShowDeleteAccountModal}
        onClick={() => {
          setShowDeleteAccountModal(false);
          navigate(-1);
        }}
        text="해당 유저가 탈퇴 처리되었습니다."
      />
      <Modal
        opened={showDeleteAccountConfirmModal}
        onClose={() => setShowDeleteAccountConfirmModal(false)}
        overlayOpacity={0.5}
        size="auto"
        centered
        withCloseButton={false}
      >
        <ModalBox>
          <ModalTitle>관리자 권한 탈퇴 처리하시겠습니까?</ModalTitle>
          <ButtonWrap>
            <ModalBlackButton onClick={onDeleteAccount}>
              <BlackButtonText>확인</BlackButtonText>
            </ModalBlackButton>
            <ModalWhiteButton onClick={() => setShowDeleteAccountConfirmModal(false)}>
              <WhiteButtonText>취소</WhiteButtonText>
            </ModalWhiteButton>
          </ButtonWrap>
        </ModalBox>
      </Modal>

      <Modal
          opened={showRestoreAccountConfirmModal}
          onClose={() => setShowRestoreAccountConfirmModal(false)}
          overlayOpacity={0.5}
          size="auto"
          centered
          withCloseButton={false}
      >
        <ModalBox>
          <ModalTitle>해당 회원정보를 복구처리 하시겠습니까?</ModalTitle>
          <ButtonWrap>
            <ModalBlackButton onClick={handleRestoreUser}>
              <BlackButtonText>확인</BlackButtonText>
            </ModalBlackButton>
            <ModalWhiteButton onClick={() => setShowRestoreAccountConfirmModal(false)}>
              <WhiteButtonText>취소</WhiteButtonText>
            </ModalWhiteButton>
          </ButtonWrap>
        </ModalBox>
      </Modal>


      <Modal opened={showAddressChangeModal}
          onClose={() => setShowAddressChangeModal(false)}
          overlayOpacity={0.5}
          size="auto"
          centered
      >
        <ModalBox>
            <ModalTitle>Change Address</ModalTitle>
            <ModalContWrap>
                <CustomZipInput
                    maxLength={6}
                    value={zipcode}
                    onChange={e => setZipcode(e.target.value)}
                    placeholder="우편번호"
                    readOnly={true}
                    onClick={()=>setShowPostModal(true)}
                />
              <ModalWhiteButton onClick={() => setShowPostModal(true)}>
                <WhiteButtonText>Search Address</WhiteButtonText>
              </ModalWhiteButton>

            </ModalContWrap>
            <ModalContWrap>
                <CustomInput
                    maxLength={100}
                    value={address1}
                    onChange={e => setAddress1(e.target.value)}
                    placeholder="기본주소"
                />
            </ModalContWrap>
            <ModalContWrap>
                <CustomInput
                    maxLength={200}
                    value={address2}
                    onChange={e => setAddress2(e.target.value)}
                    placeholder="상세주소"
                />
            </ModalContWrap>
          <ButtonWrap style={{marginTop:30}}>
            <ModalBlackButton onClick={onModifyAddress}>
              <BlackButtonText>확인</BlackButtonText>
            </ModalBlackButton>
            <ModalWhiteButton onClick={() => setShowAddressChangeModal(false)}>
              <WhiteButtonText>취소</WhiteButtonText>
            </ModalWhiteButton>
          </ButtonWrap>
        </ModalBox>
    </Modal>

      <PostModal visible={showPostModal} setVisible={setShowPostModal} setAddress={(data:any)=>{
          console.log(data);

          setZipcode(data.zonecode);
          setAddress1(data.roadAddress);
          if (data.buildingName)  setAddress2('('+data.buildingName+')');
          else setAddress2('');
      }} />

    </>
  );
}

const CustomInput = styled.input`
    width: 300px;
    font-size: 14px;
    height:60px;
    margin: 0 7px;
`;

const CustomZipInput = styled.input`
    width: 80px;
    font-size: 14px;
    height:60px;
    margin: 0 7px;
`;

const ModalContWrap = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 5px;
  @media only screen and (max-width: 768px) {
  flex-direction: column;
}
  `

const ButtonRowWrap = styled.div`
  display: flex;
  margin: 30px;
  margin-bottom: 130px;
  align-self: flex-end;
`;

const Button = styled.div<{ type: 'black' | 'white' | 'green' }>`
  width: 160px;
  height: 60px;
  border: 1px solid #121212;
  background-color: ${(props) => (props.type === 'black' ? '#121212' : '#fff')};
  border-color: ${(props) => (props.type === 'green' ? '#398049' : '#121212')};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  cursor: pointer;
`;

const ButtonText = styled.span<{ type: 'black' | 'white' | 'green' }>`
  color: ${(props) => (props.type === 'black' ? '#ffffff' : props.type === 'white' ? '#121212' : '#398049')};
  font-size: 16px;
  font-weight: 400;
`;

const RowWap = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #121212;
  height: 80px;
  position: relative;
`;

const LeftText = styled.span`
  color: #121212;
  font-size: 16px;
  font-weight: 600;
  width: 200px;
  border-right: 1px solid #121212;
  display: inline-block;
  height: 100%;
  line-height: 80px;
`;

const TextInput = styled.input`
  color: #121212;
  font-size: 16px;
  font-weight: 400;
  border: 0;
  height: 100%;
  line-height: 80px;
  padding-left: 20px;
  outline: 0;
  flex: 1;
`;

const RightText = styled(LeftText)`
  font-weight: 400;
  border: 0;
  width: auto;
  padding-left: 20px;
`;

const UnderLineBox = styled.div`
  display: flex;
  flex: 1;
  padding: 0px 20px;
`;

const DownIcon = styled.img`
  width: 14px;
  height: 14px;
  cursor: pointer;
`;

const UnderlineTextButton = styled.span`
  font-weight: 400;
  font-size: 15px;
  color: #121212;
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  text-decoration: underline;
  cursor: pointer;
`;

const ModalBox = styled.div`
  background-color: #fff;
  padding: 40px 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media only screen and (max-width: 768px) {
    padding: 20px 10px;
    width: 260px;
  }
`;

const ModalTitle = styled.span`
  font-size: 18px;
  color: #121212;
  font-weight: 600;
  margin-bottom: 30px;
  @media only screen and (max-width: 768px) {
    font-size: 18px;
  }
`;

const ButtonWrap = styled.div`
  display: flex;
  margin-top: 5px;
  @media only screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

const ModalBlackButton = styled.div`
  width: 150px;
  height: 60px;
  background-color: #121212;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  cursor: pointer;
  border: 1px solid #121212;
  @media only screen and (max-width: 768px) {
    display: block;
    text-align: center;
    padding: 15px 0;
  }
`;

const BlackButtonText = styled.span`
  font-weight: 400;
  color: #ffffff;
  font-size: 16px;
  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

const WhiteButtonText = styled(BlackButtonText)`
  color: #121212;
`;

const ModalWhiteButton = styled(ModalBlackButton)`
  background-color: #ffffff;
  margin-left: 10px;
  @media only screen and (max-width: 768px) {
    margin-left: 0;
    margin-top: 10px;
  }
`;

export default UserDetails;
