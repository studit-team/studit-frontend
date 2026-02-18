import React, { useEffect, useState } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import axios from "axios";

function StudyManageApplicants() {
  const { studyId } = useParams();
  const { studyData } = useOutletContext(); // Layout에서 전달받은 데이터
  const navigate = useNavigate();

  const [applicants, setApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  // 1. 방장 권한 체크 및 데이터 로드
  useEffect(() => {
    if (studyData && studyData.userStatus !== "LEADER") {
      alert("방장만 접근 가능한 페이지입니다.");
      navigate(`/study/${studyId}`); // 홈으로 리다이렉트
      return;
    }

    const fetchApplicants = async () => {
      try {
        // 실제 API 엔드포인트에 맞게 수정하세요
        const response = await axios.get(`/api/studies/${studyId}/applicants`);
        setApplicants(response.data);
      } catch (error) {
        console.error("신청자 목록 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicants();
  }, [studyId, studyData, navigate]);

  const handleRowClick = (id) => {
    setSelectedId(selectedId === id ? null : id);
  };

  // 2. 승인/거절 처리 함수
  const handleAction = async (applicantId, status) => {
    const actionText = status === "APPROVE" ? "승인" : "거절";
    if (!window.confirm(`이 신청자를 ${actionText}하시겠습니까?`)) return;

    try {
      await axios.post(`/api/studies/${studyId}/applicants/${applicantId}`, {
        status,
      });
      alert(`${actionText} 처리되었습니다.`);
      // 목록 새로고침
      setApplicants(applicants.filter((app) => app.userId !== applicantId));
    } catch (error) {
      alert("처리 중 오류가 발생했습니다.");
    }
  };

  if (isLoading)
    return (
      <div className="p-8 text-center text-gray-500">
        신청자 목록 불러오는 중...
      </div>
    );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* 헤더 섹션 */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-700/20">
        <div>
          <h2 className="font-bold text-gray-800 dark:text-gray-100 text-xl flex items-center gap-2">
            <span className="text-violet-600">📝</span> 신청자 관리
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            스터디 참여를 희망하는 분들의 각오를 확인하고 승인 여부를
            결정하세요.
          </p>
        </div>
        <div className="text-sm font-medium text-gray-600">
          현재 인원:{" "}
          <span className="text-violet-600">{studyData.currentMbrCount}</span> /{" "}
          {studyData.maxMbrNocs}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse">
          <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50/80 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
            <tr>
              <th className="px-5 py-3 text-center w-20">번호</th>
              <th className="px-5 py-3 text-left">신청자 정보 및 각오</th>
              <th className="px-5 py-3 text-center w-32">신청일</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {applicants.length > 0 ? (
              applicants.map((applicant, index) => (
                <React.Fragment key={applicant.userId}>
                  <tr
                    onClick={() => handleRowClick(applicant.userId)}
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
                        <div className="flex items-center mb-1">
                          <span className="font-bold text-gray-800 dark:text-gray-200 mr-2">
                            {applicant.username}
                          </span>
                          <span className="text-xs text-gray-400 font-normal">
                            ({applicant.email})
                          </span>
                        </div>
                        {selectedId !== applicant.userId && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-md">
                            {applicant.message || "참여 각오가 없습니다."}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center text-gray-500 font-medium">
                      {applicant.applyDate}
                    </td>
                  </tr>

                  {/* 상세 내용 및 액션 버튼 */}
                  {selectedId === applicant.userId && (
                    <tr className="bg-gray-50/30 dark:bg-gray-900/20">
                      <td
                        colSpan="3"
                        className="px-8 py-6 border-y border-gray-100 dark:border-gray-700"
                      >
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-inner">
                          <h4 className="text-xs font-bold text-violet-600 mb-3 uppercase tracking-widest">
                            Application Message
                          </h4>
                          <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-base mb-6">
                            {applicant.message ||
                              "등록된 신청 메시지가 없습니다."}
                          </div>

                          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <button
                              onClick={() =>
                                handleAction(applicant.userId, "REJECT")
                              }
                              className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-rose-600 transition-colors"
                            >
                              거절하기
                            </button>
                            <button
                              onClick={() =>
                                handleAction(applicant.userId, "APPROVE")
                              }
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
