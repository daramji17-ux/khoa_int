const STORAGE_KEY = "work_checklists";

const defaultTemplates = [
  {
    id: "meeting",
    title: "회의 개최",
    items: [
      "회의 목적 정의",
      "일정 조율",
      "자료 요청",
      "회의 진행",
      "회의록 작성"
    ]
  },
  {
    id: "business_trip",
    title: "출장 준비",
    items: [
      "출장 승인",
      "항공/숙소 예약",
      "출장계획서 작성",
      "결과보고서 제출"
    ]
  }
];

function loadChecklists() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function saveChecklists(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
