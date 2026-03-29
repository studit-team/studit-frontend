import React, { useEffect, useState, useCallback } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import axios from "axios";

function StudyManageApplicants() {
  const { studyId } = useParams();
  const { studyData } = useOutletContext();
  const navigate = useNavigate();

  const [applicants, setApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  // 1. 신청자 목록 가져오기
  const fetchApplicants = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/studies/${studyId}/applicants`);
      const data = response.data;

      // 백엔드 인터페이스 수정(List 반환)에 따른 데이터 세팅
      if (Array.isArray(data)) {
        setApplicants(data);
      } else if (data && typeof data === "object" && data.userId) {
        setApplicants([data]); // 단일 객체 대응
      } else {
        setApplicants([]);
      }
    } catch (error) {
      console.error("신청자 목록 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, [studyId]);

  // 권한 체크 및 초기 데이터 로드
  useEffect(() => {
    if (!studyData) return;

    if (studyData.userStatus !== "LEADER") {
      alert("방장만 접근 가능한 페이지입니다.");
      navigate(`/study/${studyId}`, { replace: true });
      return;
    }

    fetchApplicants();
  }, [studyData, studyId, navigate, fetchApplicants]);

  // 2. 승인/거절 처리 (PUT 메서드로 변경)
  const handleAction = async (applicantUserId, status) => {
    const actionText = status === "APPROVE" ? "승인" : "거절";
    if (!window.confirm(`이 신청자를 ${actionText}하시겠습니까?`)) return;

    try {
      // 백엔드 @PutMapping 및 @RequestBody 구조에 맞춤
      await axios.put(`/api/studies/${studyId}/applicants/${applicantUserId}`, {
        status,
      });

      alert(`${actionText} 처리되었습니다.`);

      // 성공 시 목록에서 제거 (UI 업데이트)
      setApplicants((prev) =>
        prev.filter((app) => app.userId !== applicantUserId),
      );

      // 선택된 상태 초기화
      setSelectedId(null);

      // *참고: 승인 시 인원수 반영을 위해 필요하다면 부모 컨텍스트의 데이터를 새로고침하는 로직을 호출할 수 있습니다.
    } catch (error) {
      console.error(error);
      const errorMsg =
        error.response?.status === 409
          ? "스터디 인원이 가득 찼거나 잘못된 요청입니다."
          : "처리 중 오류가 발생했습니다.";
      alert(errorMsg);
    }
  };

  if (isLoading) {
    return (
      <div className="p-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-600 mb-4"></div>
        <p className="text-gray-500 font-medium">
          신청 정보를 가져오는 중입니다...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* 헤더 섹션 */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-700/20">
        <div>
          <h2 className="font-bold text-gray-800 dark:text-gray-100 text-xl flex items-center gap-2">
            <span className="text-violet-600">📝</span> 신청자 관리
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            참여 희망자의 메시지를 확인하고 승인 여부를 결정하세요.
          </p>
        </div>
        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
          현재 인원:{" "}
          <span className="text-violet-600">
            {studyData?.currentMbrCount || 0}
          </span>{" "}
          / {studyData?.maxMbrNocs || 0}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse">
          <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50/80 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
            <tr>
              <th className="px-5 py-3 text-center w-20">번호</th>
              <th className="px-5 py-3 text-left">신청자 정보</th>
              <th className="px-5 py-3 text-center w-40">신청일</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {applicants.length > 0 ? (
              applicants.map((applicant, index) => (
                <React.Fragment key={applicant.userId}>
                  <tr
                    onClick={() =>
                      setSelectedId(
                        selectedId === applicant.userId
                          ? null
                          : applicant.userId,
                      )
                    }
                    className={`group hover:bg-violet-50/30 dark:hover:bg-violet-600/5 cursor-pointer transition-colors ${
                      selectedId === applicant.userId
                        ? "bg-violet-50/50 dark:bg-violet-600/10"
                        : ""
                    }`}
                  >
                    <td className="px-5 py-4 text-center text-gray-400 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800 dark:text-gray-200">
                          {applicant.userId.split("-")[0]}... 님
                        </span>
                        {selectedId !== applicant.userId && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-md">
                            {applicant.content || "참여 메시지가 없습니다."}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center text-gray-500 font-medium font-mono text-xs">
                      {applicant.appliedAt?.split("T")[0]}
                    </td>
                  </tr>

                  {/* 상세 내용 (아코디언) */}
                  {selectedId === applicant.userId && (
                    <tr className="bg-gray-50/30 dark:bg-gray-900/20">
                      <td
                        colSpan="3"
                        className="px-8 py-6 border-y border-gray-100 dark:border-gray-700"
                      >
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                          <h4 className="text-xs font-bold text-violet-600 mb-3 uppercase tracking-widest">
                            Application Message
                          </h4>
                          <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-base mb-6">
                            {applicant.content ||
                              "등록된 신청 메시지가 없습니다."}
                          </div>
                          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction(applicant.userId, "REJECT");
                              }}
                              className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-rose-600 transition-colors"
                            >
                              거절하기
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction(applicant.userId, "APPROVE");
                              }}
                              className="px-6 py-2 bg-violet-600 text-white rounded-lg text-sm font-bold hover:bg-violet-700 shadow-md transition-all active:scale-95"
                            >
                              스터디 승인
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="px-5 py-20 text-center text-gray-400"
                >
                  대기 중인 신청자가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudyManageApplicants;
