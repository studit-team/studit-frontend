import React, { useEffect, useState } from "react";
import { useParams, Outlet, NavLink } from "react-router-dom";
import Sidebar from "../../partials/Sidebar.jsx";
import Header from "../../partials/Header.jsx";
import axios from "axios";
import StudyApplyModal from "../../components/StudyApplyModal.jsx";

function StudyLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [studyData, setStudyData] = useState(null);
    const { studyId } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const userId = localStorage.getItem('userId');

    // 일반 게시판 메뉴 [cite: 2026-01-29]
    const menus = [
        { name: "홈", path: "" },
        { name: "공지사항", path: "notice" },
        { name: "모임 일정", path: "schedule" },
        { name: "과제/인증", path: "assignment" },
        { name: "자유 게시판", path: "free" }
    ];

    // 방장 전용 관리 메뉴 [cite: 2026-01-29]
    const leaderMenus = [
        { name: "신청자 관리", path: "manage/applicants" },
        { name: "멤버 관리", path: "manage/members" },
        { name: "과제 출제", path: "manage/assignment" },
        { name: "스터디 설정", path: "manage/settings" }
    ];

    useEffect(() => {
        const fetchStudyHome = async () => {
            try {
                const response = await axios.get(`/api/studies/${studyId}/home`, {
                    params: { userId: userId }
                });
                setStudyData(response.data);
            } catch (error) {
                console.error("❌ 데이터 호출 실패:", error);
            }
        };
        if (studyId) fetchStudyHome();
    }, [studyId, userId]);

    /**
     * 상단 상태 액션 렌더링 (색상 톤 수정) [cite: 2026-01-29]
     */
    const renderStatusAction = () => {
        if (!studyData) return null;

        switch (studyData.userStatus) {
            case 'LEADER':
                return (
                    <div className="flex items-center gap-2 bg-rose-50 text-rose-600 px-4 py-2 rounded-lg font-bold border border-rose-100 shadow-sm transition-all">
                        <span className="text-lg">👑</span> 스터디 방장
                    </div>
                );
            case 'MEMBER':
                return (
                    <div className="flex items-center gap-2 bg-sky-50 text-sky-600 px-4 py-2 rounded-lg font-bold border border-sky-100 shadow-sm transition-all">
                        <span className="text-lg">🏃</span> 스터디 메이트
                    </div>
                );
            case 'WAIT':
                return (
                    <div className="flex items-center gap-2 bg-slate-50 text-slate-500 px-4 py-2 rounded-lg font-bold border border-slate-200 shadow-sm">
                        <span className="text-lg">⌛</span> 승인 대기 중
                    </div>
                );
            case 'NONE':
            default:
                return (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn bg-violet-600 text-white hover:bg-violet-700 h-fit shadow-md px-6 py-2.5 rounded-lg font-bold transition-all active:scale-95"
                    >
                        스터디 참여하기
                    </button>
                );
        }
    };

    if (!studyData) return <div className="p-8 text-center text-gray-500">로딩 중...</div>;

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 font-sans">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <main className="grow">
                    {/* 상단 스터디 정보 헤더 */}
                    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-6">
                        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-violet-100 text-violet-600 text-xs font-bold px-2.5 py-1 rounded-full">
                                        {studyData.categoryNames}
                                    </span>
                                    <span className="text-gray-400 text-sm">| {studyData.region}</span>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 italic">
                                    {studyData.studyNm}
                                </h1>
                            </div>
                            <div className="flex items-center">
                                {renderStatusAction()}
                            </div>
                        </div>
                    </div>

                    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-6xl mx-auto">
                        <div className="grid grid-cols-12 gap-6">

                            {/* 좌측 사이드 메뉴 */}
                            <div className="col-span-12 md:col-span-3">
                                <div className="space-y-4">

                                    {/* 일반 메뉴 섹션 */}
                                    <nav className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">스터디 메뉴</h3>
                                        <div className="space-y-1">
                                            {menus.map((menu) => (
                                                <NavLink
                                                    key={menu.name}
                                                    to={menu.path}
                                                    end={menu.path === ""}
                                                    className={({ isActive }) =>
                                                        `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition ${
                                                            isActive
                                                                ? "bg-violet-100 text-violet-600"
                                                                : "text-gray-700 hover:bg-gray-50"
                                                        }`
                                                    }
                                                >
                                                    {menu.name}
                                                </NavLink>
                                            ))}
                                        </div>
                                    </nav>

                                    {/* 방장 전용 관리 섹션 (로즈 핑크 톤 수정) [cite: 2026-01-29] */}
                                    {studyData.userStatus === 'LEADER' && (
                                        <nav className="bg-rose-50/50 dark:bg-rose-900/10 p-4 rounded-xl shadow-sm border border-rose-100 dark:border-rose-900/30">
                                            <h3 className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-3 px-3">스터디 관리</h3>
                                            <div className="space-y-1">
                                                {leaderMenus.map((menu) => (
                                                    <NavLink
                                                        key={menu.name}
                                                        to={menu.path}
                                                        className={({ isActive }) =>
                                                            `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition ${
                                                                isActive
                                                                    ? "bg-rose-100 text-rose-700 dark:bg-rose-600/20 dark:text-rose-400"
                                                                    : "text-rose-800/70 dark:text-rose-200 hover:bg-rose-100/50 dark:hover:bg-gray-700"
                                                            }`
                                                        }
                                                    >
                                                        {menu.name}
                                                    </NavLink>
                                                ))}
                                            </div>
                                        </nav>
                                    )}
                                </div>
                            </div>

                            <div className="col-span-12 md:col-span-9">
                                <Outlet context={{ studyData }} />
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <StudyApplyModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                studyNm={studyData?.studyNm}
                studyId={studyId}
                userId={userId}
            />
        </div>
    );
}

export default StudyLayout;