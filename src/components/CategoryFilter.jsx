import React, { useState, useRef, useEffect } from 'react';
import Transition from '../utils/Transition';
import axios from "axios";

function CategoryFilter({ selectedCategories, setSelectedCategories }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const trigger = useRef(null);
    const dropdown = useRef(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/studies/category/list');
                setCategories(response.data);
            } catch (error) {
                console.error("카테고리 목록 로드 실패:", error);
            }
        };

        fetchCategories();
    }, []);
    const handleSelect = (categoryId) => {
        if (categoryId === 'ALL') {
            setSelectedCategories([]); // '전체' 클릭 시 다른 모든 선택 해제
            return;
        }

        if (selectedCategories.includes(categoryId)) {
            // 이미 선택된 항목이면 제거
            setSelectedCategories(selectedCategories.filter((id) => id !== categoryId));
        } else {
            // 새로운 항목 추가
            setSelectedCategories([...selectedCategories, categoryId]);
        }
    };

    // 📍 외부 클릭 시 닫기 로직 (반응성 최적화)
    useEffect(() => {
        const clickHandler = ({ target }) => {
            if (!dropdown.current) return;
            if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)) return;
            setDropdownOpen(false);
        };
        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    }, [dropdownOpen]);

    return (
        <div className="relative inline-flex">
            {/* 📍 필터 버튼: 너비 고정 및 왼쪽 정렬 */}
            <button
                ref={trigger}
                type="button"
                className={`btn min-w-[145px] justify-start px-3 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 ${
                    selectedCategories.length > 0 ? 'text-violet-600 border-violet-200 bg-violet-50/50' : 'text-gray-600'
                }`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
            >
                <svg className={`w-4 h-4 shrink-0 mr-2 fill-current ${selectedCategories.length > 0 ? 'text-violet-500' : 'text-gray-400'}`} viewBox="0 0 16 16">
                    <path d="M9 15H7a1 1 0 010-2h2a1 1 0 010 2zM11 11H5a1 1 0 010-2h6a1 1 0 010 2zM13 7H3a1 1 0 010-2h10a1 1 0 010 2zM15 3H1a1 1 0 010-2h14a1 1 0 010 2z" />
                </svg>
                <span className="font-bold whitespace-nowrap">
          {selectedCategories.length === 0 ? '카테고리' : `카테고리 (${selectedCategories.length})`}
        </span>
                <svg className={`w-3 h-3 shrink-0 ml-auto fill-current text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 12 12">
                    <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                </svg>
            </button>

            {/* 📍 드롭다운 메뉴: z-index 최상단 배치 */}
            <Transition
                show={dropdownOpen}
                tag="div"
                className="z-50 absolute top-full left-0 sm:left-auto sm:right-0 min-w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-1.5 rounded-2xl shadow-xl mt-1 overflow-hidden"
                enter="transition ease-out duration-200 transform"
                enterStart="opacity-0 -translate-y-2"
                enterEnd="opacity-100 translate-y-0"
                leave="transition ease-in duration-150 transform"
                leaveStart="opacity-100"
                leaveEnd="opacity-0"
            >
                <div ref={dropdown} className="px-3 py-2">
                    <div className="text-xs font-semibold text-gray-400 uppercase pt-1.5 pb-2 px-1 border-b border-gray-50 mb-2">스터디 분야</div>
                    <ul className="max-h-64 overflow-y-auto custom-scrollbar">
                        {/* 📍 '전체' 선택 항목 */}
                        <li className="mb-0.5">
                            <label className="flex items-center px-2 py-2 rounded-lg hover:bg-violet-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors">
                                <input
                                    type="checkbox"
                                    className="form-checkbox text-violet-600 rounded border-gray-300"
                                    checked={selectedCategories.length === 0}
                                    onChange={() => handleSelect('ALL')}
                                />
                                <span className={`text-sm font-medium ml-3 ${selectedCategories.length === 0 ? 'text-violet-700 font-bold' : 'text-gray-600'}`}>
                  전체
                </span>
                            </label>
                        </li>

                        {/* 📍 개별 카테고리 목록 */}
                        {categories.map((category) => (
                            <li key={category.categoryId} className="mb-0.5">
                                <label className="flex items-center px-2 py-2 rounded-lg hover:bg-violet-50 dark:hover:bg-gray-700/50 cursor-pointer group transition-colors">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox text-violet-600 rounded border-gray-300"
                                        checked={selectedCategories.includes(category.categoryId)}
                                        onChange={() => handleSelect(category.categoryId)}
                                    />
                                    <span className={`text-sm font-medium ml-3 ${selectedCategories.includes(category.categoryId) ? 'text-violet-700 font-bold' : 'text-gray-600'}`}>
                    {category.categoryNm}
                  </span>
                                </label>
                            </li>
                        ))}
                    </ul>

                    <div className="py-2 px-1 mt-1 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <button
                            type="button"
                            className="text-xs font-bold text-violet-600 hover:text-violet-700"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCategories([]);
                            }}
                        >
                            초기화
                        </button>
                        <button
                            type="button"
                            className="text-xs font-bold text-gray-400 hover:text-gray-600"
                            onClick={(e) => {
                                e.stopPropagation();
                                setDropdownOpen(false);
                            }}
                        >
                            닫기
                        </button>
                    </div>
                </div>
            </Transition>
        </div>
    );
}

export default CategoryFilter;