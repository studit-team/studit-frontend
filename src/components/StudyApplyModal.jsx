import React, { useState } from 'react';
import axios from 'axios';

function StudyApplyModal({ isOpen, onClose, studyId, userId, studyNm }) {
    const [applyMsg, setApplyMsg] = useState('');
    const [loading, setLoading] = useState(false); // 전송 중 상태 관리

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!applyMsg.trim()) {
            alert("신청 내용을 입력해주세요!");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`/api/studies/study/apply`, {
                studyId: studyId,
                userId: userId,
                content: applyMsg
            });

            if (response.status === 200) {
                alert(`[${studyNm}] 스터디 참여 신청이 완료되었습니다!`);
                setApplyMsg('');
                onClose();
            }
        } catch (error) {
            console.error("❌ 신청 실패:", error);
            // 백엔드에서 보낸 Conflict(-1) 등 예외 메시지 처리
            if (error.response?.status === 409) {
                alert("이미 신청했거나 참여 중인 스터디입니다.");
            } else {
                alert("신청 처리 중 오류가 발생했습니다. 다시 시도해 주세요.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
                <div className="border-b border-gray-100 p-6 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">스터디 참여 신청</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        <span className="font-semibold text-violet-600">{studyNm}</span> 방장에게 보낼 메시지
                    </p>
                </div>

                <div className="p-6">
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">신청 내용</label>
                    <textarea
                        className="w-full rounded-xl border-gray-200 p-4 text-sm focus:border-violet-500 focus:ring-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        rows="5"
                        placeholder="본인의 스터디 목표나 간단한 자기소개를 적어주세요!"
                        value={applyMsg}
                        onChange={(e) => setApplyMsg(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <div className="flex items-center justify-end gap-3 bg-gray-50 p-6 dark:bg-gray-700/50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                        disabled={loading}
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`rounded-lg bg-violet-600 px-6 py-2 text-sm font-semibold text-white shadow-md hover:bg-violet-700 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? '전송 중...' : '신청하기'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default StudyApplyModal;