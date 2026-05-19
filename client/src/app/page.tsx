import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />

      <div className="h-[80vh] flex flex-col items-center justify-center">
        <h1 className="text-6xl font-bold">
          SocialSync AI 🚀
        </h1>

        <p className="text-gray-500 mt-5 text-xl">
          AI Powered Social Media Automation SaaS
        </p>
      </div>
    </div>
  );
}