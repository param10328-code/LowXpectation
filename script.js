// ===============================
// OJ PLATFORM MAIN SCRIPT
// ===============================

// ---------- STORAGE SETUP ----------
const DB = {
    username: localStorage.getItem("oj_username") || "CodeMaster",

    problems: JSON.parse(localStorage.getItem("oj_problems")) || [
        {id:1,title:"Two Sum",difficulty:"Easy",solved:false},
        {id:2,title:"Binary Search",difficulty:"Easy",solved:false},
        {id:3,title:"Longest Substring",difficulty:"Medium",solved:false},
        {id:4,title:"Graph Traversal",difficulty:"Medium",solved:false},
        {id:5,title:"Segment Tree",difficulty:"Hard",solved:false}
    ],

    submissions: JSON.parse(localStorage.getItem("oj_submissions")) || []
};

// Save helper
function saveDB(){
    localStorage.setItem("oj_problems", JSON.stringify(DB.problems));
    localStorage.setItem("oj_submissions", JSON.stringify(DB.submissions));
}

// ---------- GLOBAL USER DISPLAY ----------
document.querySelectorAll("#usernameDisplay").forEach(el=>{
    el.textContent = DB.username;
});

// =====================================================
// ================= DASHBOARD =========================
// =====================================================
i

// =====================================================
// ================= PROBLEMS PAGE ======================
// =====================================================
const container = document.getElementById("problemsContainer");
if(container){

    function renderProblems(list){
        container.innerHTML="";
        list.forEach(p=>{
            container.innerHTML += `
                <div class="problem-card">
                    <h3>${p.title}</h3>
                    <span class="difficulty ${p.difficulty.toLowerCase()}">${p.difficulty}</span>
                    <br><br>
                    <button class="btn-primary solve-btn" data-id="${p.id}">
                        ${p.solved ? "Solved ✔" : "Solve"}
                    </button>
                </div>
            `;
        });
    }

    renderProblems(DB.problems);

    // Stats strip
    document.getElementById("totalProblemsCount").textContent = DB.problems.length;
    document.getElementById("easyCount").textContent = DB.problems.filter(p=>p.difficulty==="Easy").length;
    document.getElementById("mediumCount").textContent = DB.problems.filter(p=>p.difficulty==="Medium").length;
    document.getElementById("hardCount").textContent = DB.problems.filter(p=>p.difficulty==="Hard").length;

    // Solve button simulation
    document.addEventListener("click", e=>{
        if(e.target.classList.contains("solve-btn")){
            const id = Number(e.target.dataset.id);
            const prob = DB.problems.find(p=>p.id===id);

            // simulate verdict
            const verdict = Math.random() > 0.3 ? "Accepted" : "Wrong Answer";

            DB.submissions.push({
                title: prob.title,
                verdict: verdict,
                date: "Today"
            });

            if(verdict==="Accepted") prob.solved = true;

            saveDB();
            renderProblems(DB.problems);
            location.reload();
        }
    });

    // Search
    document.getElementById("searchInput").addEventListener("input",e=>{
        renderProblems(DB.problems.filter(p=>p.title.toLowerCase().includes(e.target.value.toLowerCase())));
    });

    // Difficulty filter
    document.getElementById("difficultyFilter").addEventListener("change",e=>{
        if(e.target.value==="All") renderProblems(DB.problems);
        else renderProblems(DB.problems.filter(p=>p.difficulty===e.target.value));
    });

    // Progress bar
    const solvedCount = DB.problems.filter(p=>p.solved).length;
    const percent = Math.round((solvedCount/DB.problems.length)*100);
    document.getElementById("overallProgressBar").style.width = percent+"%";
    document.getElementById("overallProgressText").textContent = percent+"% Completed";
}

// =====================================================
// ================= LEADERBOARD ========================
// =====================================================
const lbBody = document.getElementById("leaderboardBody");
if(lbBody){

    const userSolved = DB.problems.filter(p=>p.solved).length;
    const userSub = DB.submissions.length;

    const leaderboard = [
        {name:"User1", solved:150, submissions:200},
        {name:"User2", solved:120, submissions:160},
        {name:"User3", solved:100, submissions:150},
        {name:DB.username, solved:userSolved, submissions:userSub}
    ];

    leaderboard.sort((a,b)=>b.solved-a.solved);

    lbBody.innerHTML="";
    leaderboard.forEach((u,i)=>{
        const acc = u.submissions ? Math.round((u.solved/u.submissions)*100) : 0;
        lbBody.innerHTML += `
            <tr>
                <td>${i+1}</td>
                <td>${u.name}</td>
                <td>${u.solved}</td>
                <td>${u.submissions}</td>
                <td>${acc}%</td>
                <td>${Math.round(acc*0.9)}%</td>
            </tr>
        `;
    });
}

// =====================================================
// ================= ANALYTICS ==========================
// =====================================================
if(document.getElementById("submissionTrendChart")){

    const solved = DB.problems.filter(p=>p.solved).length;
    const submissions = DB.submissions.length;
    const accuracy = submissions ? Math.round((solved/submissions)*100) : 0;

    document.getElementById("analyticsSubmissions").textContent=submissions;
    document.getElementById("analyticsAccepted").textContent=solved;
    document.getElementById("analyticsSolved").textContent=solved;
    document.getElementById("analyticsSuccessRate").textContent=accuracy+"%";

    // Chart data from real submissions
    const verdictCounts = {
        Accepted: DB.submissions.filter(s=>s.verdict==="Accepted").length,
        Wrong: DB.submissions.filter(s=>s.verdict!=="Accepted").length
    };

    new Chart(document.getElementById("verdictChart"),{
        type:"pie",
        data:{
            labels:["Accepted","Wrong Answer"],
            datasets:[{data:[verdictCounts.Accepted, verdictCounts.Wrong]}]
        }
    });

    new Chart(document.getElementById("difficultyChart"),{
        type:"doughnut",
        data:{
            labels:["Easy","Medium","Hard"],
            datasets:[{
                data:[
                    DB.problems.filter(p=>p.difficulty==="Easy" && p.solved).length,
                    DB.problems.filter(p=>p.difficulty==="Medium" && p.solved).length,
                    DB.problems.filter(p=>p.difficulty==="Hard" && p.solved).length
                ]
            }]
        }
    });

    new Chart(document.getElementById("submissionTrendChart"),{
        type:"line",
        data:{
            labels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
            datasets:[{label:"Submissions",data:[2,3,1,5,4,6,3]}]
        }
    });

    // Insights
    document.getElementById("analyticsInsightsList").innerHTML=`
        <li>You solved ${solved} problems so far.</li>
        <li>Your accuracy is ${accuracy}%.</li>
        <li>Try solving harder problems to improve rank.</li>
    `;
}
// ===== PROBLEMS DATA =====
const problems = [
  { title: "Two Sum", difficulty: "Easy" },
  { title: "Palindrome Number", difficulty: "Easy" },
  { title: "Longest Substring Without Repeating", difficulty: "Medium" },
  { title: "Valid Parentheses", difficulty: "Easy" },
  { title: "Merge Intervals", difficulty: "Medium" },
  { title: "Binary Tree Level Order Traversal", difficulty: "Medium" },
  { title: "LRU Cache", difficulty: "Hard" }
];

// ===== LOAD PROBLEMS FUNCTION =====
function loadProblems() {
  const container = document.getElementById("problems-list");
  if (!container) return;

  container.innerHTML = "";

  problems.forEach(p => {
    const div = document.createElement("div");
    div.className = "problem-card";
    div.innerHTML = `
      <h3>${p.title}</h3>
      <p>Difficulty: <b>${p.difficulty}</b></p>
      <button onclick="alert('Problem Opened')">Solve</button>
    `;
    container.appendChild(div);
  });
}

// ===== RUN AFTER PAGE LOAD =====
document.addEventListener("DOMContentLoaded", loadProblems);

// ===== PROBLEMS DATABASE =====
const problem = [
  { title: "Two Sum", difficulty: "Easy" },
  { title: "Palindrome Number", difficulty: "Easy" },
  { title: "Longest Substring Without Repeating Characters", difficulty: "Medium" },
  { title: "Merge Intervals", difficulty: "Medium" },
  { title: "Binary Tree Level Order Traversal", difficulty: "Medium" },
  { title: "LRU Cache", difficulty: "Hard" },
  { title: "Word Ladder", difficulty: "Hard" }
];

// ===== RENDER PROBLEMS =====
function renderProblems(list) {
  const container = document.getElementById("problems-container");
  if (!container) return;

  container.innerHTML = "";

  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "problem-card";

    card.innerHTML = `
      <h3>${p.title}</h3>
      <p class="difficulty ${p.difficulty}">${p.difficulty}</p>
      <button onclick="alert('Opening ${p.title}')">Solve</button>
    `;

    container.appendChild(card);
  });
}

// ===== FILTER FUNCTION =====
function filterProblems(level) {
  if (level === "All") {
    renderProblems(problems);
  } else {
    renderProblems(problems.filter(p => p.difficulty === level));
  }
}

// ===== LOAD WHEN PAGE OPENS =====
document.addEventListener("DOMContentLoaded", () => {
  renderProblems(problems);
});

