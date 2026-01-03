const STORAGE_KEY = "work_checklists_v1";

// 템플릿(원하는 만큼 추가 가능)
const defaultTemplates = [
  {
    id: "meeting",
    title: "회의 개최",
    items: ["회의 목적 정의", "일정 조율", "자료 요청", "회의 진행", "회의록 작성", "Action item 정리"]
  },
  {
    id: "cl_paper",
    title: "공문/CL 작성·회람",
    items: ["초안 작성", "내부 검토", "대외 조율", "최종본 확정", "발송", "회신/후속조치 정리"]
  },
  {
    id: "business_trip",
    title: "출장 준비",
    items: ["출장 승인", "항공/숙소 예약", "일정표 공유", "자료/명함 준비", "출장 경비 정리", "결과보고서 제출"]
  }
];

function loadChecklists() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveChecklists(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function uid() {
  return "cl_" + Math.random().toString(16).slice(2) + "_" + Date.now().toString(16);
}
