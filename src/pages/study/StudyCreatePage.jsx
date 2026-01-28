import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// 레이아웃 컴포넌트 (StudyList와 동일하게 유지)
import Sidebar from "../../partials/Sidebar.jsx";
import Header from "../../partials/Header.jsx";

// 필터 컴포넌트 재활용 (카테고리, 요일 선택용)
import CategoryFilter from "../../components/CategoryFilter.jsx";
import DayFilter from "../../components/DayFilter.jsx";
import LocationModal from "../../components/LocationModal.jsx";

function StudyCreatePage() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

    // 폼 상태 관리 (StudyCreateDto 구조에 맞춤)
    const [formData, setFormData] = useState({
        leaderId: localStorage.getItem("userId"),
        studyNm: "",
        studyDc: "",
        maxMbrNocs: 5,
        mpngSn: "", // 지역 매핑 번호
        categoryIds: [],
        dayIds: [],
        fees: [{ feeTyCode: "DEPOSIT", amount: 0 }],
        studyStatusCode: "Y"
    });

    const [locationText, setLocationText] = useState("지역 선택");

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 지역 선택 처리
    const handleLocationSelect = (selected) => {
        if (selected && selected.length > 0) {
            setFormData(prev => ({ ...prev, mpngSn: selected[0].mpngSn }));
            setLocationText(selected[0].name);
        }
    };

    // 스터디 생성 요청
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 백엔드 StudyController @PostMapping으로 전송
            const response = await axios.post("/api/studies/study", formData);
            if (response.status === 201) {
                alert("스터디가 생성되었습니다!");
                navigate("/study/list"); // 생성 후 목록으로 이동
            }
        } catch (error) {
            console.error("❌ 스터디 생성 실패:", error);
            alert("스터디 생성 중 오류가 발생했습니다.");
        }
    };

    // 비용 항목 추가
    const addFeeField = () => {
        setFormData(prev => ({
            ...prev,
            fees: [...prev.fees, { feeTyCode: "PARTICIPATION", amount: 0 }]
        }));
    };

// 비용 항목 삭제
    const removeFeeField = (index) => {
        setFormData(prev => ({
            ...prev,
            fees: prev.fees.filter((_, i) => i !== index)
        }));
    };

// 비용 항목 수정
    const handleFeeChange = (index, e) => {
        const { name, value } = e.target;
        const newFees = [...formData.fees];
        newFees[index][name] = value;
        setFormData(prev => ({ ...prev, fees: newFees }));
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
            {/* 1. 사이드바 (디자인 유지) */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                {/* 2. 헤더 (디자인 유지) */}
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <main className="grow">
                    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-4xl mx-auto">

                        {/* 상단 헤더 영역 */}
                        <div className="mb-8">
                            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">새로운 스터디 만들기</h1>
                            <p className="text-sm text-gray-500 mt-1">함께 성장할 팀원을 모집하기 위한 정보를 입력해주세요.</p>
                        </div>

                        {/* 3. 스터디 생성 폼 */}
                        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 relative">
                            <div className="p-6 space-y-6">

                                {/* 스터디 이름 */}
                                <div>
                                    <label className="block text-sm font-bold mb-2 dark:text-gray-300">스터디 이름</label>
                                    <input
                                        name="studyNm"
                                        className="form-input w-full px-4 py-3 rounded-xl border-gray-200 focus:border-violet-500 focus:ring-violet-500"
                                        type="text"
                                        placeholder="스터디 명을 입력하세요"
                                        value={formData.studyNm}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {/* 스터디 상세 설명 */}
                                <div>
                                    <label className="block text-sm font-bold mb-2 dark:text-gray-300">스터디 소개</label>
                                    <textarea
                                        name="studyDc"
                                        className="form-input w-full px-4 py-3 rounded-xl border-gray-200 min-h-[150px]"
                                        placeholder="어떤 방식으로 공부하나요? 상세하게 적어주세요."
                                        value={formData.studyDc}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* 카테고리 선택 (기존 필터 컴포넌트 활용) */}
                                    <div>
                                        <label className="block text-sm font-bold mb-2 dark:text-gray-300">카테고리</label>
                                        <CategoryFilter
                                            selectedCategories={formData.categoryIds}
                                            setSelectedCategories={(ids) => setFormData(p => ({...p, categoryIds: ids}))}
                                        />
                                    </div>

                                    {/* 요일 선택 (기존 필터 컴포넌트 활용) */}
                                    <div>
                                        <label className="block text-sm font-bold mb-2 dark:text-gray-300">진행 요일</label>
                                        <DayFilter
                                            selectedDays={formData.dayIds}
                                            setSelectedDays={(ids) => setFormData(p => ({...p, dayIds: ids}))}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                                    {/* 지역 선택 */}
                                    <div>
                                        <label className="block text-sm font-bold mb-2 dark:text-gray-300">활동 지역</label>
                                        <button
                                            type="button"
                                            className="w-full btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-violet-300 text-gray-600 dark:text-gray-300 justify-start h-[46px]"
                                            onClick={() => setIsLocationModalOpen(true)}
                                        >
                                            <svg className="w-4 h-4 shrink-0 mr-2 text-violet-500" viewBox="0 0 16 16">
                                                <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z" />
                                            </svg>
                                            <span className="font-medium">{locationText}</span>
                                        </button>
                                    </div>

                                    {/* 최대 인원 */}
                                    <div>
                                        <label className="block text-sm font-bold mb-2 dark:text-gray-300">모집 인원 (최대)</label>
                                        <input
                                            name="maxMbrNocs"
                                            type="number"
                                            className="form-input w-full px-4 py-2 rounded-xl border-gray-200"
                                            value={formData.maxMbrNocs}
                                            onChange={handleChange}
                                            min="1"
                                        />
                                    </div>
                                </div>

                                {/* 보증금/참가비 설정 영역 */}
                                <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="block text-sm font-bold dark:text-gray-300">비용 설정 (보증금, 참가비 등)</label>
                                        <button
                                            type="button"
                                            onClick={addFeeField}
                                            className="text-xs font-bold text-violet-600 hover:text-violet-700 flex items-center bg-violet-50 px-3 py-1.5 rounded-lg transition-colors"
                                        >
                                            <svg className="w-3 h-3 mr-1 fill-current" viewBox="0 0 16 16">
                                                <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                                            </svg>
                                            항목 추가
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {formData.fees.map((fee, index) => (
                                            <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end bg-gray-50 dark:bg-gray-800/30 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                                <div className="md:col-span-5">
                                                    <label className="block text-xs font-semibold text-gray-500 mb-1">비용 종류</label>
                                                    <select
                                                        name="feeTyCode"
                                                        className="form-select w-full rounded-lg border-gray-200 text-sm"
                                                        value={fee.feeTyCode}
                                                        onChange={(e) => handleFeeChange(index, e)}
                                                    >
                                                        <option value="DEPOSIT">보증금</option>
                                                        <option value="PARTICIPATION">참가비</option>
                                                        <option value="PENALTY">벌금</option>
                                                    </select>
                                                </div>
                                                <div className="md:col-span-5">
                                                    <label className="block text-xs font-semibold text-gray-500 mb-1">금액 (원)</label>
                                                    <input
                                                        name="amount"
                                                        type="number"
                                                        className="form-input w-full px-4 py-2 rounded-lg border-gray-200 text-sm"
                                                        placeholder="0"
                                                        value={fee.amount}
                                                        onChange={(e) => handleFeeChange(index, e)}
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFeeField(index)}
                                                        className="w-full h-[38px] flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                                                        disabled={formData.fees.length === 1} // 최소 하나는 남겨둠
                                                    >
                                                        <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                                                            <path d="M5 9h10v2H5V9z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* 하단 버튼 영역 */}
                            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="btn bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="btn bg-violet-600 text-white hover:bg-violet-700 shadow-md shadow-violet-200"
                                >
                                    스터디 개설하기
                                </button>
                            </div>
                        </form>
                    </div>
                </main>

                {/* 지역 선택 모달 (StudyList와 동일 컴포넌트) */}
                <LocationModal
                    isOpen={isLocationModalOpen}
                    setIsOpen={setIsLocationModalOpen}
                    selectedLocations={[]}
                    setSelectedLocations={handleLocationSelect}
                />
            </div>
        </div>
    );
}

export default StudyCreatePage;