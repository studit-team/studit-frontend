import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Transition from '../utils/Transition';
import UserAvatar from '../images/user/user.png';
import Logo from '../images/logo.png';

function UserMenu() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const modalContent = useRef(null);

  // 로그인 폼 상태
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const name = localStorage.getItem('name');

    if (token && username) {
      setIsLoggedIn(true);
      setUser({ username, name });
    }
  }, []);

  // ESC 키 누르면 모달 닫기
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!modalOpen || keyCode !== 27) return;
      setModalOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [modalOpen]);

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 로그인 제출
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
          'http://localhost:8080/api/auth/login',
          loginForm,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
      );

      // 로그인 성공
      const { token, userId, username, name, authorCode } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('username', username);
      localStorage.setItem('name', name);
      localStorage.setItem('authorCode', authorCode);

      setIsLoggedIn(true);
      setUser({ username, name });
      setModalOpen(false);

      // 폼 초기화
      setLoginForm({ username: '', password: '' });

    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || '로그인에 실패했습니다.');
      } else if (err.request) {
        setError('서버와의 연결에 실패했습니다.');
      } else {
        setError('로그인 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 로그아웃
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('name');
    localStorage.removeItem('authorCode');

    setIsLoggedIn(false);
    setUser(null);
    setModalOpen(false);
  };

  return (
      <div className="relative inline-flex">
        {/* 로그인/사용자 버튼 */}
        <button
            className="inline-flex justify-center items-center group"
            onClick={() => setModalOpen(true)}
        >
          <img className="w-8 h-8 rounded-full" src={UserAvatar} width="32" height="32" alt="User" />
          <div className="flex items-center truncate">
                    <span className="truncate ml-2 text-sm font-medium text-gray-600 dark:text-gray-100 group-hover:text-gray-800 dark:group-hover:text-white">
                        {isLoggedIn ? user?.name : '로그인'}
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
          {/* 배경 */}
          <div
              className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
              onClick={() => setModalOpen(false)}
          ></div>

          {/* 모달 박스 */}
          <div
              ref={modalContent}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-auto max-w-sm w-full max-h-full z-10 p-8 font-inter"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="w-6"></div>

              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex-1 flex items-center justify-center gap-2">
                <img src={Logo} className="w-8 h-8 object-contain" alt="Logo" />
                <span>Studit</span>
              </h2>

              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-500 transition-colors">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M10.586 12L4.586 6 6 4.586 12 10.586l6-6L19.414 6l-6 6 6 6-1.414 1.414-6-6-6 6L4.586 19.414z" />
                </svg>
              </button>
            </div>

            {/* 로그인된 경우 */}
            {isLoggedIn ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      환영합니다, {user?.name}님!
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {user?.username}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <button
                        onClick={() => {
                          setModalOpen(false);
                          navigate('/dashboard');
                        }}
                        className="w-full py-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-md shadow-md transition-colors duration-200"
                    >
                      대시보드
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-md shadow-md transition-colors duration-200"
                    >
                      로그아웃
                    </button>
                  </div>
                </div>
            ) : (
                <>
                  {/* 에러 메시지 */}
                  {error && (
                      <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                        {error}
                      </div>
                  )}

                  {/* 로그인 폼 */}
                  <form className="space-y-4" onSubmit={handleLogin}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        이메일
                      </label>
                      <input
                          type="email"
                          name="username"
                          value={loginForm.username}
                          onChange={handleInputChange}
                          placeholder="email@example.com"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-900 dark:text-white"
                          required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        비밀번호
                      </label>
                      <input
                          type="password"
                          name="password"
                          value={loginForm.password}
                          onChange={handleInputChange}
                          placeholder="••••••••"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-900 dark:text-white"
                          required
                      />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-md shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? '로그인 중...' : '로그인'}
                    </button>
                  </form>

                  {/* 하단 링크 */}
                  <div className="mt-6 pt-1 border-gray-200 dark:border-gray-700 text-center">
                    <button
                        onClick={() => {
                          setModalOpen(false);
                          navigate('/user/forgot-password');
                        }}
                        className="text-violet-600 hover:text-violet-500 font-medium"
                    >
                      비밀번호 찾기
                    </button>
                    <span> | </span>
                    <button
                        onClick={() => {
                          setModalOpen(false);
                          navigate('/user/singup');
                        }}
                        className="text-violet-600 hover:text-violet-500 font-medium"
                    >
                      회원가입
                    </button>
                    <span> | </span>
                    <button
                        onClick={() => {
                          setModalOpen(false);
                          navigate('/user/find-id');
                        }}
                        className="text-violet-600 hover:text-violet-500 font-medium"
                    >
                      아이디(이메일)찾기
                    </button>
                  </div>

                  {/* 소셜 로그인 섹션 */}
                  <div className="mt-6">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-gray-800 px-2 text-gray-500">간편로그인</span>
                      </div>
                    </div>

                    {/* 소셜 버튼 4종 */}
                    <div className="flex items-center justify-center gap-3">
                      <button className="w-11 h-11 flex items-center justify-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:bg-gray-50 transition-all">
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                      </button>

                      <button className="w-11 h-11 flex items-center justify-center bg-[#03C75A] rounded-xl shadow-sm hover:opacity-90 transition-all">
                        <span className="text-white text-lg font-black">N</span>
                      </button>

                      <button className="w-11 h-11 flex items-center justify-center bg-[#FEE500] rounded-xl shadow-sm hover:bg-[#FADA00] transition-all">
                        <svg className="w-5 h-5 fill-[#3C3E44]" viewBox="0 0 24 24">
                          <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.558 1.707 4.8 4.34 6.011l-1.09 4.011c-.05.195.176.35.334.238l4.766-3.328c.214.02.433.033.65.033 4.97 0 9-3.185 9-7.115S16.97 3 12 3z" />
                        </svg>
                      </button>

                      <button className="w-11 h-11 flex items-center justify-center bg-[#24292F] rounded-xl shadow-sm hover:opacity-90 transition-all">
                        <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </>
            )}
          </div>
        </Transition>
      </div>
  );
}

export default UserMenu;