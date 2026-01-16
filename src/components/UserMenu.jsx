import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Transition from '../utils/Transition';
//이미지
import UserAvatar from '../images/user/user.png';
import Logo from '../images/logo.png';

function UserMenu() {

  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const modalContent = useRef(null);

  // ESC 키 누르면 모달 닫기
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!modalOpen || keyCode !== 27) return;
      setModalOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [modalOpen]);

  return (
      <div className="relative inline-flex">
        {/* 로그인 버튼 (이미지 + 텍스트) */}
        <button
            className="inline-flex justify-center items-center group"
            onClick={() => setModalOpen(true)}
        >
          <img className="w-8 h-8 rounded-full" src={UserAvatar} width="32" height="32" alt="User" />
          <div className="flex items-center truncate">

          <span className="truncate ml-2 text-sm font-medium text-gray-600 dark:text-gray-100 group-hover:text-gray-800 dark:group-hover:text-white">
            로그인
          </span>
          </div>
        </button>

        {/* 모달 레이아웃 */}
        <Transition
            show={modalOpen}
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden px-4 sm:px-6"
            enter="transition ease-out duration-200 transform"
            enterStart="opacity-0 scale-95"
            enterEnd="opacity-100 scale-100"
            leave="transition ease-in duration-200 transform"
            leaveStart="opacity-100 scale-100"
            leaveEnd="opacity-0 scale-95"
        >
          {/* 배경 (검은색 반투명 + 클릭 시 닫기) */}
          <div
              className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
              onClick={() => setModalOpen(false)}
          ></div>

          {/* 모달 박스 (실제 내용) */}
          <div
              ref={modalContent}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-auto max-w-sm w-full max-h-full z-10 p-8 font-inter"
          >
            <div className="flex justify-between items-center mb-6">
              {/* 왼쪽 여백 (오른쪽 닫기 버튼과 대칭을 맞추기 위함) */}
              <div className="w-6"></div>

              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex-1 flex items-center justify-center gap-2">
                <img src={Logo} className="w-8 h-8 object-contain" />
                <span>Studit</span>
              </h2>

              {/* 닫기 버튼 */}
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-500 transition-colors">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M10.586 12L4.586 6 6 4.586 12 10.586l6-6L19.414 6l-6 6 6 6-1.414 1.414-6-6-6 6L4.586 19.414z" />
                </svg>
              </button>
            </div>

            {/* 로그인 폼 */}
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  이메일
                </label>
                <input
                    type="email"
                    placeholder="email@example.com"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  비밀번호
                </label>
                <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-900 dark:text-white"
                />
              </div>
              <button
                  type="submit"
                  className="w-full py-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-md shadow-md transition-colors duration-200"
              >
                로그인
              </button>
            </form>

            {/* 하단 링크 */}
            <div className="mt-6 pt-1  border-gray-200 dark:border-gray-700 text-center">
              <button
                  onClick={() => {
                    setModalOpen(false);
                    // 회원`1가입 페이지로 이동하는 로직 (예: navigate('/user/signup'))
                  }}
                  className="text-violet-600 hover:text-violet-500 font-medium"
              >
                비밀번호 찾기
              </button>
              <span> | </span>
              <button
                    onClick={() => {
                      setModalOpen(false);
                      navigate('/user/singup')
                    }}
                    className="text-violet-600 hover:text-violet-500 font-medium"
                >
                  회원가입
                </button>
              <span> | </span>
              <button
                  onClick={() => {
                    setModalOpen(false);
                    // 회원가입 페이지로 이동하는 로직 (예: navigate('/user/signup'))
                  }}
                  className="text-violet-600 hover:text-violet-500 font-medium"
              >
                아이디(이메일)찾기
              </button>
              
            </div>
            {/* 소셜 로그인 섹션 (모달 내부에 추가) */}
            <div className="mt-6">
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-gray-800 px-2 text-gray-500">간편로그인</span>
                </div>
              </div>

              {/* 소셜 버튼 4종 (구글, 네이버, 카카오, 깃허브) */}
              <div className="flex items-center justify-center gap-3">
                {/* 구글 */}
                <button className="w-11 h-11 flex items-center justify-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:bg-gray-50 transition-all">
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                </button>

                {/* 네이버 */}
                <button className="w-11 h-11 flex items-center justify-center bg-[#03C75A] rounded-xl shadow-sm hover:opacity-90 transition-all">
                  <span className="text-white text-lg font-black">N</span>
                </button>

                {/* 카카오 */}
                <button className="w-11 h-11 flex items-center justify-center bg-[#FEE500] rounded-xl shadow-sm hover:bg-[#FADA00] transition-all">
                  <svg className="w-5 h-5 fill-[#3C3E44]" viewBox="0 0 24 24">
                    <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.558 1.707 4.8 4.34 6.011l-1.09 4.011c-.05.195.176.35.334.238l4.766-3.328c.214.02.433.033.65.033 4.97 0 9-3.185 9-7.115S16.97 3 12 3z" />
                  </svg>
                </button>

                {/* 깃허브 */}
                <button className="w-11 h-11 flex items-center justify-center bg-[#24292F] rounded-xl shadow-sm hover:opacity-90 transition-all">
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
  );
}

export default UserMenu;