import React, { useEffect, useState } from "react";
import Sidebar from "../../partials/Sidebar.jsx";
import Header from "../../partials/Header.jsx";
import FilterButton from "../../components/DropdownFilter.jsx";
import Datepicker from "../../components/Datepicker.jsx";
import StudyCard from "../../components/ui/StudyCard.jsx";
import axios from "axios";
import LocationModal from "../../components/LocationModal.jsx";
import DropdownFilter from "../../components/DropdownFilter.jsx";
import CategoryFilter from "../../components/CategoryFilter.jsx";
import DayFilter from "../../components/DayFilter.jsx";
import {useNavigate} from "react-router-dom";

function StudyList() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [studies, setStudies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedDays, setSelectedDays] = useState([]);
    const navigate = useNavigate();
    const getLocationText = () => {
        if (!selectedLocations || selectedLocations.length === 0) return "전체 지역";

        const firstLoc = selectedLocations[0];
        const firstName = firstLoc && firstLoc.name ? firstLoc.name : "지역 선택";

        if (selectedLocations.length === 1) return firstName;
        return `${firstName} 외 ${selectedLocations.length - 1}곳`;
    };

    const fetchStudies = async () => {
        try {
            setLoading(true);
            const mpngSnList = selectedLocations.map(loc => loc.mpngSn);

            const response = await axios.get("/api/studies/search/list", {
                params: {
                    mpngSn: mpngSnList,
                    studyNm: searchQuery,
                    category: selectedCategories,
                    dayIds: selectedDays
                },
                paramsSerializer: (params) => {
                    const searchParams = new URLSearchParams();
                    for (const key in params) {
                        const value = params[key];
                        if (Array.isArray(value)) {
                            value.forEach(v => searchParams.append(key, v));
                        } else if (value) {
                            searchParams.append(key, value);
                        }
                    }
                    return searchParams.toString();
                }
            });
            setStudies(response.data);
        } catch (error) {
            console.error("데이터 로딩 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudies();
    }, [selectedLocations, selectedCategories, selectedDays]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchStudies();
    };

    const handleCreateClick = () => {
        navigate("/study/create");
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <main className="grow">
                    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

                        <div className="sm:flex sm:justify-between sm:items-center mb-8">
                            <div className="mb-4 sm:mb-0">
                                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">스터디 탐색</h1>
                            </div>

                            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                                <button
                                    className={`btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 ${
                                        selectedLocations.length > 0 ? 'text-violet-600 border-violet-200 bg-violet-50/50' : 'text-gray-600'
                                    }`}
                                    onClick={() => setIsLocationModalOpen(true)}
                                >
                                    <svg className={`w-4 h-4 shrink-0 mr-2 fill-current ${selectedLocations.length > 0 ? 'text-violet-500' : 'text-gray-400'}`} viewBox="0 0 16 16">
                                        <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z" />
                                        <circle cx="8" cy="8" r="3" />
                                    </svg>
                                    <span className="font-bold">{getLocationText()}</span>
                                </button>
                                <CategoryFilter
                                    selectedCategories={selectedCategories}
                                    setSelectedCategories={setSelectedCategories}
                                />
                                <DayFilter
                                    selectedDays={selectedDays}
                                    setSelectedDays={setSelectedDays}
                                />
                                <form className="relative" onSubmit={handleSearchSubmit}>
                                    <label htmlFor="action-search" className="sr-only">Search</label>
                                    <input
                                        id="action-search"
                                        className="form-input pl-9 bg-white dark:bg-gray-800 border-gray-200"
                                        type="search"
                                        placeholder="스터디 검색..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <button className="absolute inset-y-0 left-0 flex items-center justify-center ml-3 group" type="submit">
                                        <svg className="w-4 h-4 shrink-0 fill-current text-gray-400" viewBox="0 0 16 16">
                                            <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
                                            <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
                                        </svg>
                                    </button>
                                </form>
                                <button
                                    onClick={handleCreateClick}
                                    className="btn bg-violet-600 text-white hover:bg-violet-700 flex items-center shadow-md shadow-violet-200 transition-all"
                                >
                                    <svg className="fill-current shrink-0 w-4 h-4 mr-2" viewBox="0 0 16 16">
                                        <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                                    </svg>
                                    <span className="hidden xs:block font-medium">스터디 만들기</span>
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-12 gap-6">
                            {loading ? (
                                <div className="col-span-full flex flex-col items-center justify-center py-20">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-600 mb-4"></div>
                                    <p className="text-gray-500">스터디 목록을 불러오는 중...</p>
                                </div>
                            ) : studies.length > 0 ? (
                                studies.map((study) => (
                                    <div
                                        key={study.studyId}
                                        onClick={() => navigate(`/study/${study.studyId}`)} // 클릭 시 상세페이지로 이동
                                        className="col-span-12 sm:col-span-6 xl:col-span-4 cursor-pointer transform transition hover:scale-[1.02]"
                                    >
                                        <StudyCard study={study} />
                                    </div>))
                            ) : (
                                <div className="col-span-full text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                    <p className="text-gray-400">조건에 맞는 스터디가 없습니다.</p>
                                    <button onClick={() => {setSelectedLocations([]); setSearchQuery("");}} className="mt-4 text-violet-600 font-bold hover:underline">
                                        필터 초기화하기
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>
                </main>

                <LocationModal
                    isOpen={isLocationModalOpen}
                    setIsOpen={setIsLocationModalOpen}
                    selectedLocations={selectedLocations}
                    setSelectedLocations={setSelectedLocations}
                />

            </div>
        </div>
    );
}

export default StudyList;