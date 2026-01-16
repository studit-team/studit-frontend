import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';

function SingupPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="flex h-screen overflow-hidden">
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                <main className="grow">
                    <div className="px-4 sm:px-6 lg:px-8 py-12 w-full max-w-[400px] mx-auto">

                        {/* 상단 로고 및 제목 */}
                        <div className="text-center mb-10">
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">회원가입</h1>
                            <p className="text-sm text-gray-500">나의 온라인 사수, 스터딧</p>
                        </div>

                        {/* 회원가입 폼 */}
                        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">이메일</label>
                                <input
                                    type="email"
                                    placeholder="example@studit.com"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:bg-gray-800"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">비밀번호</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        placeholder="********"
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:bg-gray-800"
                                    />
                                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                                    </button>
                                </div>
                                <ul className="mt-2 space-y-1 text-[11px] text-gray-500">
                                    <li className="flex items-center">✓ 영문/숫자/특수문자 중, 2가지 이상 포함</li>
                                    <li className="flex items-center">✓ 8자 이상 32자 이하 입력 (공백 제외)</li>
                                </ul>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">비밀번호 확인</label>
                                <input
                                    type="password"
                                    placeholder="********"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:bg-gray-800"
                                />
                            </div>

                            <button className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-md transition-colors shadow-sm">
                                가입하기
                            </button>
                        </form>

                        {/* 간편 회원가입 구분선 */}
                        <div className="mt-8 mb-6">
                            <div className="relative flex items-center justify-center">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                                </div>
                                <div className="relative bg-white dark:bg-gray-900 px-3 text-xs text-gray-400">간편 회원가입</div>
                            </div>
                        </div>

                        {/* 소셜 버튼 4종 (이미지 스타일 적용) */}
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