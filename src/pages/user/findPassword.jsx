import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function FindPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('이메일을 입력해주세요.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await axios.post('http://localhost:8080/api/auth/find-password', { username: email });
            setSuccess('비밀번호 변경 링크가 이메일로 전송되었습니다.');
        } catch (err) {
            setError(err.response?.data?.message || '이메일 전송에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                <main className="grow">
                    <div className="px-4 sm:px-6 lg:px-8 py-12 w-full max-w-[400px] mx-auto">

                        {/* 타이틀 */}
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">비밀번호 찾기</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                가입한 이메일을 입력해 주세요.<br />
                                이메일을 통해 비밀번호 변경 링크가 전송됩니다
                            </p>
                        </div>

                        {/* 에러 메시지 */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
                                {error}
                            </div>
                        )}

                        {/* 성공 메시지 */}
                        {success && (
                            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* 이메일 입력 */}
                            <div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="이메일 입력"
                                    className="w-full px-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-violet-400 focus:border-transparent outline-none transition-all text-gray-700 dark:text-white dark:bg-gray-800 placeholder-gray-400 text-sm"
                                    disabled={loading || !!success}
                                />
                            </div>

                            {/* 전송 버튼 */}
                            <button
                                type="submit"
                                disabled={loading || !!success}
                                className="w-full py-3.5 bg-violet-600 hover:bg-violet-701 active:bg-violet-701 text-white font-bold text-base rounded-2xl shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        전송 중...
                                    </span>
                                ) : '변경 링크 전송하기'}
                            </button>
                        </form>

                        {/* 하단 링크 */}
                        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="text-gray-500 hover:text-violet-500 dark:text-gray-400 dark:hover:text-violet-400 font-medium transition-colors"
                            >
                                ← 로그인으로 돌아가기
                            </button>
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default FindPassword;
