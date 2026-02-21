import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import Marquee from "react-fast-marquee";
import { FaRobot, FaCodeBranch, FaRocket, FaLightbulb, FaUsers, FaCalendarAlt } from "react-icons/fa";
import Footer from "../components/Footer";
import heroImg from "../assets/hero.png";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-white text-gray-900 font-sans">
      {/* 🌟 Hero Section */}
      <section className="min-h-[85vh] bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-800 text-white flex flex-col md:flex-row justify-center items-center px-6 md:px-16 lg:px-24 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-transparent pointer-events-none" />

        <div className="md:w-1/2 text-center md:text-left z-10 space-y-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold drop-shadow-lg leading-tight">
            Welcome to the <span className="text-yellow-400">AI Club</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium max-w-xl">
            RGMCET's Innovation Hub for Artificial Intelligence &amp; Emerging Tech
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={() => navigate("/signup")}
              className="bg-yellow-400 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 hover:scale-105 transition-all shadow-lg shadow-yellow-400/20"
            >
              Join Now
            </button>
            <button
              onClick={() => navigate("/about")}
              className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all"
            >
              Learn More
            </button>
          </div>
        </div>

        <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center items-center z-10">
          <div className="relative group">
            <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-700"></div>
            <img
              src={heroImg}
              alt="AI Hero"
              className="relative w-full max-w-lg md:max-w-xl drop-shadow-2xl animate-in zoom-in-95 duration-700"
            />
          </div>
        </div>
      </section>

      {/* 🔁 Announcement Marquee */}
      <div className="bg-blue-800">
        <Marquee gradient={false} speed={45} className="text-white py-3 font-semibold text-lg tracking-wider">
          🚀 AI Hackathon coming soon! &nbsp; | &nbsp; 🧠 Machine Learning Workshop this Saturday &nbsp; | &nbsp; 🎓 Guest Talk: AI in Industry next week &nbsp; | &nbsp; 📢 New learning tracks launching soon!
        </Marquee>
      </div>

      {/* 📊 Stats Section */}
      <section className="py-16 bg-gradient-to-tr from-blue-100 via-indigo-100 to-cyan-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 text-blue-900">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Members", end: 7, icon: <FaUsers /> },
              { label: "Projects", end: 3, icon: <FaCodeBranch /> },
              { label: "Events", end: 1, icon: <FaCalendarAlt /> },
              { label: "Workshops", end: 0, icon: <FaLightbulb /> },
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg flex flex-col items-center hover:scale-105 transition-all duration-200">
                <div className="text-4xl text-indigo-700 mb-2">{stat.icon}</div>
                <h3 className="text-4xl font-extrabold text-indigo-800">
                  <CountUp end={stat.end} duration={2.5} />+
                </h3>
                <p className="text-gray-700 mt-2 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 📈 Trending AI Skills */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-10 text-blue-900">Trending AI Skills in 2025</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {[
              ["Machine Learning", "Learn how systems learn from data.", <FaRobot className="text-violet-400" />],
              ["NLP", "Make machines understand human language.", <FaLightbulb className="text-blue-400" />],
              ["Computer Vision", "AI that understands images.", <FaRocket className="text-cyan-500" />],
              ["Prompt Engineering", "Guide AI models effectively.", <FaCodeBranch className="text-indigo-400" />],
              ["Data Science", "Extract insights using code and stats.", <FaUsers className="text-teal-400" />],
              ["AI Ethics", "Understand responsible AI usage.", <FaCalendarAlt className="text-pink-400" />],
            ].map(([title, desc, icon], i) => (
              <div key={i} className="bg-gray-50 p-8 rounded-xl shadow-lg hover:shadow-xl flex items-center gap-4">
                <div className="text-3xl">{icon}</div>
                <div>
                  <h3 className="font-bold text-lg text-indigo-800 mb-1">{title}</h3>
                  <p className="text-gray-700">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 📅 Upcoming Events */}
      <section className="py-16 bg-indigo-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-10 text-blue-800">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "ML Workshop",
                date: "updated soon",
                desc: "Hands-on session on scikit-learn and real datasets.",
                icon: <FaLightbulb className="text-yellow-400" />,
              },
              {
                title: "AI Hackathon",
                date: "updated soon",
                desc: "Build mini-projects in 6 hours. Certificates & goodies!",
                icon: <FaRocket className="text-indigo-500" />,
              },
              {
                title: "Prompt Battle",
                date: "updated soon",
                desc: "Compete by generating the best outputs from ChatGPT.",
                icon: <FaCodeBranch className="text-violet-400" />,
              },
            ].map((event, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl text-left flex items-center gap-4">
                <div className="text-3xl">{event.icon}</div>
                <div>
                  <h4 className="text-xl font-bold text-indigo-900 mb-1">{event.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{event.date}</p>
                  <p className="text-gray-700">{event.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🎯 Why Join */}
      <section className="bg-blue-900 text-white py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Why Join AI Club?</h2>
          <ul className="text-lg space-y-3">
            <li>✅ Work on real-world AI projects</li>
            <li>✅ Get mentorship and internship guidance</li>
            <li>✅ Access to premium tools and learning tracks</li>
            <li>✅ Boost your resume and network with AI peers</li>
          </ul>
          <button
            onClick={() => navigate("/signup")}
            className="inline-block mt-8 bg-yellow-400 text-black px-8 py-4 font-bold rounded-full hover:bg-yellow-300 hover:scale-105 transition-all shadow-lg"
          >
            Become a Member
          </button>
        </div>
      </section>


    </div>
  );
}