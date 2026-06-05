import { useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [stars, setStars] = useState(0);
  const [forks, setForks] = useState(0);
  const [languages, setLanguages] = useState({});
  const [mentorScore, setMentorScore] = useState(0);
  const [recommendations, setRecommendations] = useState([]);

  const fetchUser = async () => {
    try {
      const userResponse = await fetch(
        `http://localhost:5000/github/${username}`
      );

      const userData = await userResponse.json();

      const repoResponse = await fetch(
        `http://localhost:5000/repos/${username}`
      );

      const repos = await repoResponse.json();

      let totalStars = 0;
      let totalForks = 0;
      let languageCount = {};

      repos.forEach((repo) => {
        totalStars += repo.stargazers_count;
        totalForks += repo.forks_count;

        if (repo.language) {
          languageCount[repo.language] =
            (languageCount[repo.language] || 0) + 1;
        }
      });

      let score = 0;
      let tips = [];

      if (userData.followers > 50) score += 20;
      else tips.push("Increase followers through contributions");

      if (userData.public_repos > 10) score += 20;
      else tips.push("Create more public repositories");

      if (totalStars > 20) score += 20;
      else tips.push("Build projects that attract stars");

      if (Object.keys(languageCount).length >= 3) score += 20;
      else tips.push("Learn more programming languages");

      if (userData.bio) score += 20;
      else tips.push("Add a GitHub bio");

      setStars(totalStars);
      setForks(totalForks);
      setLanguages(languageCount);
      setMentorScore(score);
      setRecommendations(tips);
      setUser(userData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-5xl font-bold text-center mb-8">
        🚀 OpenSource Mentor AI
      </h1>

      <div className="flex justify-center gap-4 mb-10">
        <input
          type="text"
          placeholder="Enter GitHub Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="px-4 py-3 rounded-lg text-black w-80"
        />

        <button
          onClick={fetchUser}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg"
        >
          Analyze
        </button>
      </div>

      {user && (
        <div className="max-w-6xl mx-auto">

          <div className="bg-slate-800 rounded-xl p-6 text-center mb-6">
            <img
              src={user.avatar_url}
              alt="avatar"
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />

            <h2 className="text-3xl font-bold">{user.name}</h2>

            <p>@{user.login}</p>

            <p>{user.bio || "No Bio Available"}</p>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-6">

            <div className="bg-slate-800 p-5 rounded-xl">
              <h3 className="text-xl">Followers</h3>
              <p className="text-3xl font-bold">{user.followers}</p>
            </div>

            <div className="bg-slate-800 p-5 rounded-xl">
              <h3 className="text-xl">Repositories</h3>
              <p className="text-3xl font-bold">{user.public_repos}</p>
            </div>

            <div className="bg-slate-800 p-5 rounded-xl">
              <h3 className="text-xl">Stars</h3>
              <p className="text-3xl font-bold">{stars}</p>
            </div>

            <div className="bg-slate-800 p-5 rounded-xl">
              <h3 className="text-xl">Forks</h3>
              <p className="text-3xl font-bold">{forks}</p>
            </div>

          </div>

          <div className="bg-slate-800 rounded-xl p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">
              🤖 Mentor Score
            </h2>

            <div className="w-full bg-slate-700 rounded-full h-6">
              <div
                className="bg-green-500 h-6 rounded-full"
                style={{ width: `${mentorScore}%` }}
              />
            </div>

            <p className="mt-3 text-xl">
              {mentorScore}/100
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-slate-800 p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-4">
                💻 Languages
              </h2>

              {Object.entries(languages).map(([lang, count]) => (
                <p key={lang}>
                  {lang}: {count}
                </p>
              ))}
            </div>

            <div className="bg-slate-800 p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-4">
                🎯 Recommendations
              </h2>

              <ul className="list-disc pl-5">
                {recommendations.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}

export default App;