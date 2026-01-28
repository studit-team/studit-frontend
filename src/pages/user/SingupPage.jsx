import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SingupPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        passwordConfirm: '', // 추가
        phone: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        // 비밀번호 확인 검증
        if (formData.password !== formData.passwordConfirm) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            // URL 오타 수정: singup → signup
            const response = await axios.post('http://localhost:8080/api/auth/singup', formData);

            if (response.data.success) {
                alert('회원가입이 완료되었습니다! 로그인해 주세요.');
                navigate('/');
            } else {
                alert(response.data.message || '회원가입에 실패했습니다.');
            }
        } catch (error) {
            console.error('회원가입 에러:', error);
            const errorMessage = error.response?.data?.message || '회원가입에 실패했습니다. 다시 시도해 주세요.';
            alert(errorMessage);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                <main className="grow">
                    <div className="px-4 sm:px-6 lg:px-8 py-12 w-full max-w-[400px] mx-auto">
                        <div className="text-center mb-10">
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">회원가입</h1>
                            <p className="text-sm text-gray-500">나의 온라인 사수, 스터딧</p>
                        </div>

                        <form className="space-y-5" onSubmit={handleSignup}>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">이름</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="이름을 입력하세요"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition-all dark:bg-gray-800 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">이메일</label>
                                <input
                                    type="email"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="example@studit.com"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition-all dark:bg-gray-800 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">비밀번호</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition-all dark:bg-gray-800 dark:text-white"
                                    required
                                />
                            </div>
                            {/* 비밀번호 확인 필드 추가 */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">비밀번호 확인</label>
                                <input
                                    type="password"
                                    name="passwordConfirm"
                                    value={formData.passwordConfirm}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition-all dark:bg-gray-800 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">전화번호</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="010-0000-0000"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition-all dark:bg-gray-800 dark:text-white"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                            >
                                가입하기
                            </button>
                        </form>

                        <div className="mt-8 mb-6">
                            <div className="relative flex items-center justify-center">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                                </div>
                                <div className="relative bg-white dark:bg-gray-900 px-3 text-xs text-gray-400">간편 회원가입</div>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-4">
                            <button className="w-12 h-12 flex items-center justify-center bg-gray-50 border border-gray-100 rounded-xl shadow-sm hover:bg-white transition-all">
                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google" />
                            </button>
                            <button className="w-12 h-12 flex items-center justify-center bg-[#03C75A] rounded-xl shadow-sm hover:opacity-90">
                                <span className="text-white text-lg font-black">N</span>
                            </button>
                            <button className="w-12 h-12 flex items-center justify-center bg-[#FEE500] rounded-xl shadow-sm hover:bg-[#FADA00]">
                                <svg className="w-6 h-6 fill-[#3C3E44]" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.558 1.707 4.8 4.34 6.011l-1.09 4.011c-.05.195.176.35.334.238l4.766-3.328c.214.02.433.033.65.033 4.97 0 9-3.185 9-7.115S16.97 3 12 3z"/></svg>
                            </button>
                            <button className="w-12 h-12 flex items-center justify-center bg-[#24292F] rounded-xl shadow-sm hover:opacity-90">
                                <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default SingupPage;