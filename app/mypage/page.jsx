import MyContentList from "../../jsx/mypageContents"; // 파일 경로를 실제 위치에 맞게 수정하세요

export const metadata = {
  title: "My Page | Next Movies",
  description: "나의 찜 목록과 시청 기록을 확인하세요.",
};

export default function Mypage() {
  return (
    <main className="bg-[#141414] text-white">
      <div className="w-full mx-auto px-0 pb-6 md:py-16">
        <header className="mb-10 px-[5%] md:px-[4%] hidden md:block">
          <h1 className="text-4xl text-center md:text-start font-extrabold">마이페이지</h1>
        </header>

        <MyContentList />
      </div>
    </main>
  );
}