import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [tokenValid, setTokenValid] = useState(null); // null: 검증중, true: 유효, false: 무효
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [passwordValidation, setPasswordValidation] = useState({
        hasMinLength: false,
        hasTwoTypes: false,
    });

    // 마운트 시 토큰 유효성 검증
    useEffect(() => {
        if (!token) {
            setTokenValid(false);
            return;
        }

        const validateToken = async () => {
            try {
                await axios.get(`http://localhost:8080/api/auth/reset-password/validate`, {
                    params: { token },
                });
                setTokenValid(true);
            } catch {
                setTokenValid(false);
            }
        };

        validateToken();
    }, [token]);

    const validatePassword = (password) => {
        const hasMinLength =
            password.length >= 8 && password.length <= 32 && !password.includes(' ');
        let typeCount = 0;
        if (/[a-zA-Z]/.test(password)) typeCount++;
        if (/[0-9]/.test(password)) typeCount++;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) typeCount++;
        setPasswordValidation({ hasMinLength, hasTwoTypes: typeCount >= 2 });
    };

    const handlePasswordChange = (e) => {
        setNewPassword(e.target.value);
        validatePassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!passwordValidation.hasMinLength || !passwordValidation.hasTwoTypes) {
            setError('비밀번호 조건을 확인해주세요.');
            return;
        }
        if (newPassword !== newPasswordConfirm) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        setLoading(true);
        try {
            await axios.post('http://localhost:8080/api/auth/reset-password', {
                token,
                newPassword,
                newPasswordConfirm,
            });
            setSuccess(true);
            setTimeout(() => navigate('/'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || '비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setLoading(false);
        }
    };

    // ── 토큰 검증 중 ──
    if (tokenValid === null) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-gray-500 dark:text-gray-400">
                    <svg className="animate-spin w-8 h-8 text-violet-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <p className="text-sm">링크를 확인하는 중입니다...</p>
                </div>
            </div>
        );
    }

    // ── 토큰 무효 ──
    if (tokenValid === false) {
        return (
            <div className="flex h-screen overflow-hidden">
                <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                    <main className="grow">
                        <div className="px-4 sm:px-6 lg:px-8 py-12 w-full max-w-[400px] mx-auto">
                            {/* 만료 안내 */}
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-full">
                                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                    </svg>
                                </div>
                                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                                    링크가 만료되었습니다
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                    비밀번호 재설정 링크가 유효하지 않거나<br />
                                    만료(30분)되었습니다.<br />
                                    다시 요청해주세요.
                                </p>
                            </div>

                            <button
                                onClick={() => navigate('/user/forgot-password')}
                                className="w-full py-3.5 bg-violet-500 hover:bg-violet-600 text-white font-bold text-base rounded-2xl shadow-md transition-all duration-200"
                            >
                                비밀번호 찾기 다시 하기
                            </button>

                            <p className="mt-4 text-center text-sm">
                                <button
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

    // ── 변경 성공 ──
    if (success) {
        return (
            <div className="flex h-screen overflow-hidden">
                <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                    <main className="grow">
                        <div className="px-4 sm:px-6 lg:px-8 py-12 w-full max-w-[400px] mx-auto">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-violet-50 dark:bg-violet-900/20 rounded-full">
                                    <svg className="w-8 h-8 text-violet-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                                    비밀번호 변경 완료!
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                    비밀번호가 성공적으로 변경되었습니다.<br />
                                    3초 후 로그인 페이지로 이동합니다.
                                </p>
                            </div>

                            <button
                                onClick={() => navigate('/')}
                                className="w-full py-3.5 bg-violet-500 hover:bg-violet-600 text-white font-bold text-base rounded-2xl shadow-md transition-all duration-200"
                            >
                                로그인하러 가기
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    // ── 비밀번호 입력 폼 ──
    return (
        <div className="flex h-screen overflow-hidden">
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                <main className="grow">
                    <div className="px-4 sm:px-6 lg:px-8 py-12 w-full max-w-[400px] mx-auto">
                        {/* 타이틀 */}
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">새 비밀번호 설정</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                새로운 비밀번호를 입력해 주세요.<br />
                                영문, 숫자, 특수문자 중 2가지 이상 포함 (8~32자)
                            </p>
                        </div>

                        {/* 에러 */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* 새 비밀번호 */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                    새 비밀번호
                                </label>
                                <div className="relative">
                                    <input
                                        type={passwordVisible ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3.5 pr-12 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-violet-400 focus:border-transparent outline-none transition-all text-gray-700 dark:text-white dark:bg-gray-800 placeholder-gray-400 text-sm"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setPasswordVisible(!passwordVisible)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        {passwordVisible ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>

                                {/* 비밀번호 조건 표시 */}
                                {newPassword && (
                                    <div className="mt-2 space-y-1">
                                        <p className={`text-xs flex items-center gap-1 ${passwordValidation.hasMinLength ? 'text-violet-500' : 'text-gray-400'}`}>
                                            {passwordValidation.hasMinLength ? '✓' : '○'} 8~32자, 공백 없음
                                        </p>
                                        <p className={`text-xs flex items-center gap-1 ${passwordValidation.hasTwoTypes ? 'text-violet-500' : 'text-gray-400'}`}>
                                            {passwordValidation.hasTwoTypes ? '✓' : '○'} 영문, 숫자, 특수문자 중 2가지 이상
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* 비밀번호 확인 */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                    비밀번호 확인
                                </label>
                                <div className="relative">
                                    <input
                                        type={passwordConfirmVisible ? 'text' : 'password'}
                                        value={newPasswordConfirm}
                                        onChange={(e) => setNewPasswordConfirm(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3.5 pr-12 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-violet-400 focus:border-transparent outline-none transition-all text-gray-700 dark:text-white dark:bg-gray-800 placeholder-gray-400 text-sm"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setPasswordConfirmVisible(!passwordConfirmVisible)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        {passwordConfirmVisible ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>

                                {/* 일치 여부 */}
                                {newPasswordConfirm && (
                                    <p className={`mt-2 text-xs flex items-center gap-1 ${newPassword === newPasswordConfirm ? 'text-violet-500' : 'text-red-500'}`}>
                                        {newPassword === newPasswordConfirm ? '✓ 비밀번호가 일치합니다' : '✗ 비밀번호가 일치하지 않습니다'}
                                    </p>
                                )}
                            </div>

                            {/* 제출 버튼 */}
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
                                        변경 중...
                                    </span>
                                ) : '비밀번호 변경하기'}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm">
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

export default ResetPassword;
