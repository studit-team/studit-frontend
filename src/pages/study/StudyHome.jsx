import React from "react";
import { useOutletContext } from "react-router-dom";

function StudyHome() {
    // 1. 상위 Layout에서 전달한 데이터 받기 (studyData 내에 weeklySchedules, recentNotices 포함)
    const { studyData } = useOutletContext();
    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

    // 2. 정기 요일 변환 (예: "MON,WED" -> ["월", "수"])
    const dayMap = {
        'MON': '월', 'TUE': '화', 'WED': '수', 'THU': '목', 'FRI': '금', 'SAT': '토', 'SUN': '일'
    };

    // regularDays 문자열을 배열로 변환
    const studyDaysKr = studyData.regularDays
        ? studyData.regularDays.split(',').map(day => dayMap[day.trim()] || day)
        : [];


    /**
     * 가장 가까운 "미래" 일정 찾기 로직
     * 현재 시간 이후의 일정만 필터링하여 가장 빠른 순서대로 정렬 후 첫 번째 값 반환
     */
    const getNextMeeting = () => {
        if (!studyData.weeklySchedules || studyData.weeklySchedules.length === 0) return null;

        const now = new Date();

        const futureSchedules = studyData.weeklySchedules
            .filter(s => new Date(s.meetingAt) > now) // 오늘/현재 시간보다 이후인 것만
            .sort((a, b) => new Date(a.meetingAt) - new Date(b.meetingAt)); // 시간순 정렬

        return futureSchedules.length > 0 ? futureSchedules[0] : null;
    };

    const nextMeeting = getNextMeeting();

    /**
     * 이번 주 달력 데이터 생성
     */
    const getThisWeek = () => {
        const today = new Date();
        const currentDay = today.getDay(); // 0(일)~6(토)
        const diff = today.getDate() - currentDay;
        const sunday = new Date(new Date().setDate(diff));

        return daysOfWeek.map((day, index) => {
            const date = new Date(sunday);
            date.setDate(sunday.getDate() + index);

            // 비교를 위한 YYYY-MM-DD 형식 추출
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const dayNum = String(date.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${dayNum}`;

            // 해당 날짜에 일정이 등록되어 있는지 확인
            const hasSchedule = studyData.weeklySchedules?.find(s =>
                s.meetingAt && s.meetingAt.startsWith(dateStr)
            );

            return {
                dayName: day,
                dateNum: date.getDate(),
                isToday: date.toDateString() === new Date().toDateString(),
                schedule: hasSchedule
            };
        });
    };

    const thisWeek = getThisWeek();

    return (
        <div className="space-y-6">
            {/* 1. 상단 요약 정보 섹션 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 p-5 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">참여 멤버</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-gray-800 dark:text-white">{studyData.currentMbrCount}</span>
                            <span className="text-gray-400 text-sm">/ {studyData.maxMbrNocs}명</span>
                        </div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg text-blue-600">👥</div>
                </section>

                <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 p-5 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">최신 공지</p>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate block max-w-[150px]">
                            {studyData.recentNotices?.[0]?.title || "공지사항이 없습니다."}
                        </span>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg text-green-600">📢</div>
                </section>

                <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 p-5 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">정기 모임일</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {studyDaysKr.length > 0 ? studyDaysKr.map(day => (
                                <span key={day} className="bg-violet-100 text-violet-600 text-xs font-bold px-2 py-1 rounded">
                                    매주 {day}요일
                                </span>
                            )) : <span className="text-xs text-gray-400">지정 안됨</span>}
                        </div>
                    </div>
                    <div className="bg-violet-50 p-3 rounded-lg text-violet-600">🔔</div>
                </section>
            </div>

            {/* 2. 이번 주 일정 달력 섹션 */}
            <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                    <span className="mr-2">📅</span> 이번 주 스터디 일정
                </h2>
                <div className="grid grid-cols-7 gap-2">
                    {thisWeek.map((item, idx) => (
                        <div key={idx} className={`text-center p-3 rounded-xl border transition-all ${
                            item.isToday ? "ring-2 ring-violet-500 ring-offset-2 dark:ring-offset-gray-900" : ""
                        } ${item.schedule ? "bg-violet-50 border-violet-200 dark:bg-violet-900/30 dark:border-violet-800" : "bg-gray-50 border-gray-100 dark:bg-gray-700/30 dark:border-gray-700"}`}>
                            <p className={`text-xs mb-2 ${item.schedule ? "text-violet-600 font-bold" : "text-gray-400"}`}>
                                {item.dayName}
                            </p>
                            <div className={`w-9 h-9 mx-auto flex items-center justify-center rounded-full text-sm font-bold ${
                                item.schedule ? "bg-violet-600 text-white" : "text-gray-500"
                            }`}>
                                {item.dateNum}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. 하단 상세 정보 (가장 가까운 모임 & 최근 공지사항) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 가장 가까운 모임 섹션 */}
                <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 p-5">
                    <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                        <span className="mr-2">🚀</span> 가장 가까운 모임
                    </h2>
                    {nextMeeting ? (
                        <div className="p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg border border-violet-100 dark:border-violet-800">
                            <div className="text-sm text-violet-600 font-bold mb-1">
                                {new Date(nextMeeting.meetingAt).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })}
                            </div>
                            <div className="font-bold text-gray-800 dark:text-white text-lg">{nextMeeting.title}</div>
                            <div className="text-sm text-gray-500 mt-1">{nextMeeting.location} • {nextMeeting.description}</div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-gray-400 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                            <span className="text-3xl mb-2">🍃</span>
                            <p className="text-sm italic">예정된 일정이 없습니다.</p>
                        </div>
                    )}
                </section>

                {/* 최근 공지사항 섹션 */}
                <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 p-5">
                    <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                        <span className="mr-2">📝</span> 최근 공지사항
                    </h2>
                    <ul className="space-y-3">
                        {studyData.recentNotices && studyData.recentNotices.length > 0 ? (
                            studyData.recentNotices.map(notice => (
                                <li key={notice.boardId} className="flex justify-between items-center text-sm border-b border-gray-100 dark:border-gray-700 pb-2">
                                    <span className="text-gray-700 dark:text-gray-300 truncate flex-1 mr-2">{notice.title}</span>
                                    <button className="text-violet-600 text-xs font-semibold hover:underline shrink-0">상세보기</button>
                                </li>
                            ))
                        ) : (
                            <li className="text-center py-10 text-gray-400 text-sm border border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                                등록된 공지가 없습니다.
                            </li>
                        )}
                    </ul>
                </section>
            </div>
        </div>
    );
}

export default StudyHome;