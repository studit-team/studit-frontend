import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SingupPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        verificationCode: '',
        password: '',
        passwordConfirm: '',
        phone: ''
    });

    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [timer, setTimer] = useState(300);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false);

    // 비밀번호 유효성 검증 상태
    const [passwordValidation, setPasswordValidation] = useState({
        hasMinLength: false,
        hasTwoTypes: false
    });

    // 타이머 처리
    useEffect(() => {
        if (isCodeSent && !isEmailVerified && timer > 0) {
            const interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else if (timer === 0 && isCodeSent && !isEmailVerified) {
            setError('인증시간이 만료되었습니다. 인증번호를 재발송해주세요.');
        }
    }, [isCodeSent, isEmailVerified, timer]);

    // 타이머 포맷
    const formatTimer = (seconds) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec.toString().padStart(2, '0')}`;
    };

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'password') {
            validatePassword(value);
        }
    };

    // 비밀번호 유효성 검증
    const validatePassword = (password) => {
        const hasMinLength = password.length >= 8 && password.length <= 32 && !password.includes(' ');

        let typeCount = 0;
        if (/[a-zA-Z]/.test(password)) typeCount++;
        if (/[0-9]/.test(password)) typeCount++;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) typeCount++;

        setPasswordValidation({
            hasMinLength,
            hasTwoTypes: typeCount >= 2
        });
    };

    // 인증번호 발송
    const handleSendCode = async () => {
        if (!formData.username) {
            setError('이메일을 입력해주세요.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await axios.post('http://localhost:8080/api/auth/send-verification', {
                username: formData.username
            });

            setIsCodeSent(true);
            setTimer(300);
            setSuccess('인증번호가 발송되었습니다. 이메일을 확인해주세요.');
        } catch (err) {
            setError(err.response?.data?.message || '인증번호 발송에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 인증번호 재발송
    const handleResendCode = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await axios.post('http://localhost:8080/api/auth/resend-verification', {
                username: formData.username
            });

            setTimer(300);
            setSuccess('인증번호가 재발송되었습니다.');
        } catch (err) {
            setError(err.response?.data?.message || '인증번호 재발송에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 인증번호 확인
    const handleVerifyCode = async () => {
        if (!formData.verificationCode) {
            setError('인증번호를 입력해주세요.');
            return;
        }

        if (formData.verificationCode.length !== 6) {
            setError('인증번호는 6자리입니다.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await axios.post('http://localhost:8080/api/auth/verify-code', {
                username: formData.username,
                verificationCode: formData.verificationCode
            });

            setIsEmailVerified(true);
            setSuccess('이메일 인증이 완료되었습니다!');
        } catch (err) {
            setError(err.response?.data?.message || '인증번호가 올바르지 않습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 회원가입
    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!isEmailVerified) {
            setError('이메일 인증을 완료해주세요.');
            return;
        }

        if (!passwordValidation.hasMinLength || !passwordValidation.hasTwoTypes) {
            setError('비밀번호 조건을 확인해주세요.');
            return;
        }

        if (formData.password !== formData.passwordConfirm) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        setLoading(true);

        try {
            await axios.post('http://localhost:8080/api/auth/singup', formData);

            setSuccess('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');

            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || '회원가입에 실패했습니다.');
        } finally {
            setLoading(false);
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

                        {/* 에러 메시지 */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
                                {error}
                            </div>
                        )}

                        {/* 성공 메시지 */}
                        {success && (
                            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-600 dark:text-green-400">
                                {success}
                            </div>
                        )}

                        <form className="space-y-5" onSubmit={handleSignup}>
                            {/* 이름 */}
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

                            {/* 이메일 + 인증번호 발송 */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">이메일</label>
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="example@studit.com"
                                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition-all dark:bg-gray-800 dark:text-white disabled:opacity-50"
                                        disabled={isEmailVerified}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={isCodeSent && !isEmailVerified ? handleResendCode : handleSendCode}
                                        disabled={isEmailVerified || loading}
                                        className="px-4 py-3 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                    >
                                        {isEmailVerified ? '인증완료' : isCodeSent ? '재발송' : '인증번호'}
                                    </button>
                                </div>
                            </div>

                            {/* 인증번호 입력 */}
                            {isCodeSent && !isEmailVerified && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                        인증번호
                                        <span className={`ml-2 text-xs font-mono ${timer <= 60 ? 'text-red-500' : 'text-violet-500'}`}>
                                            {formatTimer(timer)}
                                        </span>
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            name="verificationCode"
                                            value={formData.verificationCode}
                                            onChange={handleChange}
                                            placeholder="6자리 인증번호"
                                            maxLength={6}
                                            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition-all dark:bg-gray-800 dark:text-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleVerifyCode}
                                            disabled={loading || timer === 0}
                                            className="px-4 py-3 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                        >
                                            확인
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* 인증 완료 표시 */}
                            {isEmailVerified && (
                                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    이메일 인증이 완료되었습니다
                                </div>
                            )}

                            {/* 비밀번호 */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">비밀번호</label>
                                <div className="relative">
                                    <input
                                        type={passwordVisible ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition-all dark:bg-gray-800 dark:text-white"
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
                                {/* 비밀번호 유효성 표시 */}
                                {formData.password && (
                                    <div className="mt-2 space-y-1">
                                        <p className={`text-xs flex items-center gap-1 ${passwordValidation.hasMinLength ? 'text-green-500' : 'text-gray-400'}`}>
                                            {passwordValidation.hasMinLength ? '✓' : '○'} 8~32자, 공백 없음
                                        </p>
                                        <p className={`text-xs flex items-center gap-1 ${passwordValidation.hasTwoTypes ? 'text-green-500' : 'text-gray-400'}`}>
                                            {passwordValidation.hasTwoTypes ? '✓' : '○'} 영문, 숫자, 특수문자 중 2가지 이상
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* 비밀번호 확인 */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">비밀번호 확인</label>
                                <div className="relative">
                                    <input
                                        type={passwordConfirmVisible ? 'text' : 'password'}
                                        name="passwordConfirm"
                                        value={formData.passwordConfirm}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition-all dark:bg-gray-800 dark:text-white"
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
                                {/* 비밀번호 일치 여부 표시 */}
                                {formData.passwordConfirm && (
                                    <p className={`mt-2 text-xs flex items-center gap-1 ${formData.password === formData.passwordConfirm ? 'text-green-500' : 'text-red-500'}`}>
                                        {formData.password === formData.passwordConfirm ? '✓ 비밀번호가 일치합니다' : '✗ 비밀번호가 일치하지 않습니다'}
                                    </p>
                                )}
                            </div>

                            {/* 전화번호 */}
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

                            {/* 가입 버튼 */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        처리중...
                                    </span>
                                ) : '가입하기'}
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

                        {/* 소셜 로그인 버튼 */}
                        <div className="flex items-center justify-center gap-4">
                            <button className="w-12 h-12 flex items-center justify-center bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm hover:bg-white dark:hover:bg-gray-700 transition-all">
                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google" />
                            </button>
                            <button className="w-12 h-12 flex items-center justify-center bg-[#03C75A] rounded-xl shadow-sm hover:opacity-90 transition-all">
                                <span className="text-white text-lg font-black">N</span>
                            </button>
                            <button className="w-12 h-12 flex items-center justify-center bg-[#FEE500] rounded-xl shadow-sm hover:bg-[#FADA00] transition-all">
                                <svg className="w-6 h-6 fill-[#3C3E44]" viewBox="0 0 24 24">
                                    <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.558 1.707 4.8 4.34 6.011l-1.09 4.011c-.05.195.176.35.334.238l4.766-3.328c.214.02.433.033.65.033 4.97 0 9-3.185 9-7.115S16.97 3 12 3z" />
                                </svg>
                            </button>
                            <button className="w-12 h-12 flex items-center justify-center bg-[#24292F] rounded-xl shadow-sm hover:opacity-90 transition-all">
                                <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                                </svg>
                            </button>
                        </div>

                        {/* 로그인 링크 */}
                        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                            이미 계정이 있으신가요?{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="text-violet-600 hover:text-violet-700 font-semibold"
                            >
                                로그인
                            </button>
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default SingupPage;