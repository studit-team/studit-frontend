import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function FindId() {
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [maskedEmail, setMaskedEmail] = useState('');

    // 전화번호 자동 하이픈 포맷
    const handlePhoneChange = (e) => {
        const raw = e.target.value.replace(/\D/g, '');
        let formatted = raw;
        if (raw.length <= 3) {
            formatted = raw;
        } else if (raw.length <= 7) {
            formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
        } else {
            formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
        }
        setPhone(formatted);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMaskedEmail('');

        if (!phone || phone.replace(/\D/g, '').length < 10) {
            setError('올바른 휴대폰 번호를 입력해주세요.');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post('http://localhost:8080/api/auth/find-id', { phone });
            setMaskedEmail(res.data.maskedEmail);
        } catch (err) {
            setError(err.response?.data?.message || '아이디 찾기에 실패했습니다. 다시 시도해주세요.');
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
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">아이디 찾기</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                가입 시 등록한 휴대폰 번호를 입력해 주세요.<br />
                                가입된 아이디를 확인할 수 있습니다.
                            </p>
                        </div>

                        {/* 에러 */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
                                {error}
                            </div>
                        )}

                        {/* 결과 카드 */}
                        {maskedEmail ? (
                            <div className="space-y-4">
                                <div className="p-5 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-2xl text-center">
                                    <div className="flex items-center justify-center mb-3">
                                        <div className="w-10 h-10 flex items-center justify-center bg-violet-100 dark:bg-violet-800 rounded-full">
                                            <svg className="w-5 h-5 text-violet-600 dark:text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">가입된 아이디(이메일)</p>
                                    <p className="text-lg font-bold text-gray-800 dark:text-gray-100 tracking-wide">
                                        {maskedEmail}
                                    </p>
                                </div>

                                <button
                                    onClick={() => navigate('/')}
                                    className="w-full py-3.5 bg-violet-500 hover:bg-violet-600 text-white font-bold text-base rounded-2xl shadow-md transition-all duration-200"
                                >
                                    로그인하러 가기
                                </button>

                                <button
                                    onClick={() => navigate('/user/forgot-password')}
                                    className="w-full py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-violet-400 dark:hover:border-violet-500 text-gray-700 dark:text-gray-300 font-semibold text-base rounded-2xl transition-all duration-200"
                                >
                                    비밀번호 찾기
                                </button>
                            </div>

                        ) : (
                            /* 입력 폼 */
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={handlePhoneChange}
                                        placeholder="010-0000-0000"
                                        maxLength={13}
                                        className="w-full px-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-violet-400 focus:border-transparent outline-none transition-all text-gray-700 dark:text-white dark:bg-gray-800 placeholder-gray-400 text-sm"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3.5 bg-violet-500 hover:bg-violet-600 active:bg-violet-700 text-white font-bold text-base rounded-2xl shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            조회 중...
                                        </span>
                                    ) : '아이디 찾기'}
                                </button>
                            </form>
                        )}

                        {/* 하단 링크 */}
                        {!maskedEmail && (
                            <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                <button
                                    onClick={() => navigate('/')}
                                    className="hover:text-violet-500 dark:hover:text-violet-400 font-medium transition-colors"
                                >
                                    로그인
                                </button>
                                <span className="text-gray-300 dark:text-gray-600">|</span>
                                <button
                                    onClick={() => navigate('/user/forgot-password')}
                                    className="hover:text-violet-500 dark:hover:text-violet-400 font-medium transition-colors"
                                >
                                    비밀번호 찾기
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default FindId;