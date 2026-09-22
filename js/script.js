//=====================================================
// VOICES OF HUMANITY
// Official Website v4.1
// Foundation Edition
//=====================================================

window.addEventListener("DOMContentLoaded", () => {

    initialiseOpeningExperience();

});

//=====================================================
// OPENING EXPERIENCE
//=====================================================

function initialiseOpeningExperience() {

    const screen1 = document.getElementById("screen1");
    const screen2 = document.getElementById("screen2");
    const screen3 = document.getElementById("screen3");

    const introMessage = document.getElementById("introMessage");

    const opening = document.getElementById("opening");

    const earthVideo = document.getElementById("earthVideo");

    const beginJourney = document.getElementById("beginJourney");

    if (
        !screen1 ||
        !screen2 ||
        !screen3 ||
        !introMessage ||
        !opening ||
        !earthVideo ||
        !beginJourney
    ) {
        return;
    }

    //-------------------------------------------------
    // INTRO TEXT
    //-------------------------------------------------

    const introLines = [

        "Every language carries a history.",

        "Every culture carries wisdom.",

        "Every voice matters."

    ];

    let currentLine = 0;

    //-------------------------------------------------
    // INITIAL STATE
    //-------------------------------------------------

    screen1.classList.add("active");
    screen2.classList.remove("active");
    screen3.classList.remove("active");

    earthVideo.pause();

    //-------------------------------------------------
    // SHOW INTRO LINES
    //-------------------------------------------------

    function showLine() {

    // Show current line immediately

    introMessage.innerHTML = introLines[currentLine];

    introMessage.style.opacity = "1";

    introMessage.style.transform = "translate(-50%,-50%)";

    // Fade out

    setTimeout(() => {

        introMessage.style.opacity = "0";

        introMessage.style.transform = "translate(-50%,-55%)";

    }, 3000);

    // Move to next line AFTER fade finishes

    setTimeout(() => {

        currentLine++;

        if(currentLine < introLines.length){

            showLine();

        }else{

            screen1.classList.remove("active");

            screen2.classList.add("active");

            setTimeout(()=>{

                screen2.classList.remove("active");

                screen3.classList.add("active");

                earthVideo.play();

            },4000);

        }

    },4000);

}

    showLine();

    //-------------------------------------------------
    // BACKGROUND MUSIC
    //-------------------------------------------------

    const music = new Audio("audio/intro-theme/voices-of-humanity-theme.mp3");

    music.volume = 0.55;

    //-------------------------------------------------
    // EXPLORE BUTTON
    //-------------------------------------------------

    beginJourney.addEventListener("click", () => {

        music.play().catch(() => {});

        beginJourney.disabled = true;

        beginJourney.innerHTML = "Entering the Archive...";

        opening.style.transition = "opacity 2s ease";

        setTimeout(() => {

    window.location.href = "museum/";

},1500);

    });

}

//=====================================================
// STATISTICS COUNTER
//=====================================================

const statNumbers = document.querySelectorAll(".stat-number");

const statisticsSection = document.getElementById("statistics");

let statisticsAnimated = false;

function animateStatistics(){

    if(statisticsAnimated) return;

    const triggerPoint = statisticsSection.offsetTop - window.innerHeight + 150;

    if(window.scrollY < triggerPoint) return;

    statisticsAnimated = true;

    statNumbers.forEach(number=>{

        const target = Number(number.dataset.target);

        let current = 0;

        const increment = target / 120;

        const timer = setInterval(()=>{

            current += increment;

            if(current >= target){

                current = target;

                clearInterval(timer);

            }

            if(target >= 1000){

                number.textContent =
                    Math.floor(current).toLocaleString() + "+";

            }

            else{

                number.textContent =
                    Math.floor(current) + "+";

            }

        },15);

    });

}

window.addEventListener("scroll",animateStatistics);

animateStatistics();
