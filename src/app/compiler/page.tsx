import Navbar from "../../components/navbar";
import Compiler from "./Compiler";

export default function Home() {
  return (
    <>
      <div className="bg-white dark:bg-[#101010] min-h-screen">
        <Navbar />
        <div className="py-2">
          <Compiler/>
        </div>
      </div>
    </>
  );
}
