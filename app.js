const drawer =
document.getElementById("drawer");

const term =
document.getElementById("term");

const choices =
document.getElementById("choices");

const result =
document.getElementById("result");

let currentSect = null;
let currentSutra = null;
let currentChapter = null;
let currentQuestion = null;
let currentWordElement = null;

let solved = 0;
let exp = 0;

/* ==========================
const HANNYA_CHAPTERS = [

  HANNYA_01,
  HANNYA_02,
  HANNYA_03,
  HANNYA_04,
  HANNYA_05,
  HANNYA_06,
  HANNYA_07,
  HANNYA_08,
  HANNYA_09,
  HANNYA_10,

  HANNYA_11,
  HANNYA_12,
  HANNYA_13,
  HANNYA_14,
  HANNYA_15,
  HANNYA_16,
  HANNYA_17,
  HANNYA_18,
  HANNYA_19,
  HANNYA_20,

  HANNYA_21,
  HANNYA_22,
  HANNYA_23,
  HANNYA_24,
  HANNYA_25,
  HANNYA_26,
  HANNYA_27,
  HANNYA_28,
  HANNYA_29,
  HANNYA_30,

  HANNYA_31,
  HANNYA_32,
  HANNYA_33,
  HANNYA_34,
  HANNYA_35,
  HANNYA_36,
  HANNYA_37,
  HANNYA_38,
  HANNYA_39,
  HANNYA_40,

  HANNYA_41,
  HANNYA_42

];
========================== */


/* ==========================
   宗派
========================== */

const SECTS = {

  tendai:{
    title:"天台宗",

    sutras:[
      {
        id:"hannya",
        title:"般若心経",
        chapters:HANNYA_CHAPTERS
      }
    ]
  }

};

/* ==========================
   起動
========================== */

window.onload = () => {

  const area =
  document.getElementById(
    "workSelect"
  );

  area.innerHTML = "";

  Object.keys(SECTS)
  .forEach(key => {

    const sect =
    SECTS[key];

    area.innerHTML += `

    <div
      class="work-card"
      onclick="openSect('${key}')">

      <h3>
      ${sect.title}
      </h3>

    </div>

    `;

  });

};

/* ==========================
   宗派
========================== */

function openSect(id){

  currentSect = SECTS[id];

  document.getElementById(
    "workSelect"
  ).style.display = "none";

  const area =
  document.getElementById(
    "sutraSelect"
  );

  area.style.display = "grid";

  area.innerHTML = "";

  currentSect.sutras
  .forEach(sutra => {

    area.innerHTML += `

    <div
      class="work-card"
      onclick="openSutra('${sutra.id}')">

      <h3>
      ${sutra.title}
      </h3>

    </div>

    `;

  });

}

/* ==========================
   お経
========================== */

function openSutra(id){

  currentSutra =
  currentSect.sutras.find(
    s => s.id === id
  );

  document.getElementById(
    "sutraSelect"
  ).style.display = "none";

  const area =
  document.getElementById(
    "chapterSelect"
  );

  area.style.display = "grid";

  area.innerHTML = "";

  currentSutra.chapters
  .forEach(chapter => {

    area.innerHTML += `

    <div
      class="work-card"
      onclick="openChapter('${chapter.id}')">

      <h3>
      ${chapter.chapter}
      </h3>

    </div>

    `;

  });

}

/* ==========================
   章開始
========================== */

function openChapter(id){

  currentChapter =
  currentSutra.chapters.find(
    c => c.id === id
  );

  solved = 0;

  document.getElementById(
    "chapterSelect"
  ).style.display = "none";

  document.getElementById(
    "studyUI"
  ).style.display = "block";

  document.getElementById(
    "lessonScreen"
  ).innerHTML =
  currentChapter.text;

  document.getElementById(
    "translation"
  ).innerHTML = `
  <h3>現代語訳</h3>
  ${currentChapter.translation}
  `;

  setupWords();
document
.getElementById(
  "readingQuiz"
)
.classList.remove(
  "show"
);
document
.getElementById("translation")
.classList.remove("show");


document
.getElementById(
  "chapterComplete"
)
.style.display =
"none";
}

/* ==========================
   単語設定
========================== */

function setupWords(){

  document
  .querySelectorAll(".word")
  .forEach(word => {

    word.onclick = () => {

      currentWordElement =
      word;

      currentQuestion =
      currentChapter.words[
        Number(
          word.dataset.id
        )
      ];

      showQuestion();

    };

  });

}

/* ==========================
   問題表示
========================== */

function showQuestion(){

  drawer.classList.add(
    "show"
  );

  document
  .getElementById("overlay")
  .classList.add("show");

  term.innerHTML = `

  <ruby>
  ${currentQuestion.word}
  <rt>
  ${currentQuestion.ruby}
  </rt>
  </ruby>

  `;

  choices.innerHTML = "";
  result.innerHTML = "";
const shuffledChoices =
currentQuestion.choices
.map((choice,index)=>({

  choice: choice,

  correct:
  index ===
  currentQuestion.answer

}))
.sort(() =>
  Math.random() - 0.5
);
  shuffledChoices
.forEach(item=>{


    const btn =
    document.createElement(
      "button"
    );

    btn.className =
    "option";

    btn.textContent =
    item.choice;

    btn.onclick = ()=>{

      if(
  item.correct
){

        correctAnswer();

      }else{

        wrongAnswer();

      }

    };

    choices.appendChild(btn);

  });

}

/* ==========================
   正解
========================== */

function correctAnswer(){

  currentWordElement
  .classList
  .add("done");

  solved++;

  // EXP加算
  exp += 10;

  document.getElementById(
    "exp"
  ).textContent = exp;

  document.getElementById(
    "level"
  ).textContent =
  Math.floor(exp / 50) + 1;

  result.innerHTML = `

  <div class="correct">

  ✅ 正解

  <hr>

  ${
    currentQuestion.commentary ||
    currentQuestion.explanation
  }

  </div>

  `;

  updateProgress();

}

/* ==========================
   不正解
========================== */

function wrongAnswer(){

  result.innerHTML = `
  <div class="wrong">
  ❌ 不正解
  </div>
  `;

}

/* ==========================
   進捗
========================== */
function updateProgress(){

  const total =
  currentChapter.words.length;

  document.getElementById(
    "count"
  ).textContent =
  `${solved}/${total}`;

  document.getElementById(
    "progressBar"
  ).style.width =
  `${(solved/total)*100}%`;

  if(
    solved === total
  ){

    document
    .getElementById(
      "translationBtn"
    )
    .classList
    .remove("lock");

  }

}
/* ==========================
   現代語訳
========================== */

document
.getElementById(
  "translationBtn"
)
.onclick = ()=>{

  if(
    solved <
    currentChapter.words.length
  ){
    return;
  }

  document
  .getElementById(
    "translation"
  )
  .classList
  .add("show");

  buildReadingQuiz();

};

/* ==========================
   閉じる
========================== */
function buildReadingQuiz(){

  const q =
  currentChapter.reading;

  if(!q){
    return;
  }

  document
  .getElementById(
    "readingQuiz"
  )
  .classList
  .add("show");

  document
  .getElementById(
    "readingQuiz"
  )
  .innerHTML = `

    <h3>
    理解度チェック
    </h3>

    <p>
    ${q.question}
    </p>

    ${q.choices.map(
      (choice,index)=>`

      <button
        class="option"
        onclick="checkReading(${index})">

        ${choice}

      </button>

      `
    ).join("")}

    <div id="readingResult">
    </div>

  `;

}

function checkReading(num){

  const q =
  currentChapter.reading;

  const area =
  document.getElementById(
    "readingResult"
  );

  if(
    num === q.answer
  ){

    area.innerHTML = `

      <div class="correct">

      ✅ 正解

      <hr>

      ${q.comment}

      <br><br>

      <button
        class="btn green"
        onclick="chapterComplete()">

        章をクリア

      </button>

      </div>

    `;

  }
  else{

    area.innerHTML = `

      <div class="wrong">

      ❌ 不正解

      </div>

    `;

  }

}

function chapterComplete(){

  document
  .getElementById(
    "chapterComplete"
  )
  .style.display =
  "block";

}

function closeDrawer(){

  drawer.classList.remove(
    "show"
  );

  document
  .getElementById("overlay")
  .classList.remove(
    "show"
  );

}

/* ==========================
   タイトル
========================== */

function backToTitle(){

  location.reload();

}

function backToChapter(){

  document.getElementById(
    "studyUI"
  ).style.display = "none";

  document.getElementById(
    "chapterSelect"
  ).style.display = "grid";

  document.getElementById(
    "translation"
  ).classList.remove(
    "show"
  );

  document.getElementById(
    "readingQuiz"
  ).classList.remove(
    "show"
  );

}

document
.getElementById("overlay")
.onclick = ()=>{

  closeDrawer();

};