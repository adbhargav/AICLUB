import React, { useState, useEffect } from "react";

export default function Team() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch("https://aiclub-y4ox.onrender.com/api/team");
        const data = await res.json();
        setMembers(data);
      } catch (error) {
        console.error("Error fetching team:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-indigo-900 via-purple-900 to-blue-950 text-white font-sans">
        <p className="text-indigo-200 text-xl animate-pulse">Loading team members...</p>
      </div>
    );
  }

  const faculty = members.filter((m) =>
    m.role.toLowerCase().includes("faculty")
  );
  const coreTeam = members.filter(
    (m) =>
      !m.role.toLowerCase().includes("faculty") &&
      !m.role.toLowerCase().includes("coordinator")
  );

  return (
    <div className="bg-gradient-to-tr from-indigo-900 via-purple-900 to-blue-950 text-white min-h-screen px-4 py-16 font-sans">
      {/* Hero */}
      <section className="text-center mb-16">
        <div className="inline-block bg-white/10 backdrop-blur-lg rounded-2xl px-8 py-8 shadow-xl">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-blue-400 drop-shadow">
            Meet Our Team
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-indigo-100 leading-relaxed font-medium">
            The AI Club is powered by passionate faculty and students working
            together to foster innovation, collaboration, and learning opportunities.
          </p>
        </div>
      </section>

      {/* Faculty Coordinators */}
      {faculty.length > 0 && (
        <section className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12 text-blue-300 drop-shadow">
            Faculty Coordinators
          </h2>
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {faculty.map((person, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl text-center border border-white/10 hover:scale-105 hover:border-blue-400 transition-all duration-300"
              >
                <img
                  src={person.profileImageURL}
                  alt={person.name}
                  className="w-40 h-40 mx-auto rounded-full object-cover mb-5 border-4 border-blue-400 shadow-lg"
                />
                <h3 className="text-2xl font-bold text-cyan-200 mb-2">{person.name}</h3>
                <p className="text-indigo-100 font-semibold">{person.role}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Core Team */}
      {coreTeam.length > 0 && (
        <section className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12 text-blue-300 drop-shadow">
            Core Team
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-12 max-w-6xl mx-auto">
            {coreTeam.map((person, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-xl text-center border border-white/10 hover:scale-105 hover:border-blue-400 transition-all duration-300"
              >
                <img
                  src={person.profileImageURL}
                  alt={person.name}
                  className="w-32 h-32 mx-auto rounded-full object-cover mb-4 border-2 border-blue-400 shadow-md"
                />
                <h3 className="text-lg font-bold text-cyan-200 mb-1">{person.name}</h3>
                <p className="text-indigo-100">{person.role}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
