// Variables
const toggleThemeBtn = document.querySelector('#toggleThemeBtn');
const MusicsList = [
    {
        id: 1,
        image: "img1.jpg",
        musicName: "زخم نامرئی",
        singerName: "ابی",
        time: "3:43",
        musicFile: "ZakhmNamari.mp3"
    },
    {
        id: 2,
        image: "img2.jpg",
        musicName: "تقدیر",
        singerName: "شادمهر عقیلی",
        time: "4:41",
        musicFile: "Taghdir.mp3"
    },
    {
        id: 3,
        image: "img3.jpg",
        musicName: "تو رگی",
        singerName: "شایع",
        time: "3:18",
        musicFile: "TooRagi.mp3"
    },
]
const getMusics = document.getElementById("musics")
const getMusic = document.getElementById("music")
const getFavoriteMusics = document.getElementById("favoriteMusics")
const getSearchInput = document.querySelector("#search")

let musicsFavorite = []
let musicPlay = []
let audio = null


// Functions
const loadMusicsList = () => {
    for (const item of MusicsList) {
        const createDiv = document.createElement("div");
        createDiv.classList.add("w-full", "h-full", "bg-white", "dark:bg-zinc-700", "rounded-xl", "overflow-hidden", "shadow");
        createDiv.setAttribute("data-id", item.id);

        const isFavorite = musicsFavorite.find((favItem) => favItem.id === item.id);

        createDiv.innerHTML = `
            <div class="flex items-center h-full">
                <img src="./images/${item.image}" alt="img ${item.id}" class="w-24 h-full md:w-28 md:h-full object-cover">
    
                <!-- information -->
                <div class="flex items-center justify-between w-full h-full p-2 md:p-3.5">
                    <!-- right side -->
                    <div class="flex flex-col justify-between h-full grow">
                        <p class="text-lg md:text-xl text-zinc-700 dark:text-white font-medium cursor-pointer hover:text-emerald-500 dark:hover:text-emerald-500 transition-all">
                            ${item.musicName}
                        </p>
                        <span class="flex items-center gap-x-2 text-sm text-gray-400">
                            <svg class="w-4 h-4">
                                <use href="#microphone"></use>
                            </svg>
                            ${item.singerName}
                        </span>
                        <span class="flex items-center gap-x-2 text-sm text-gray-400">
                            <svg class="w-4 h-4">
                                <use href="#timer"></use>
                            </svg>
                            ${item.time} دقیقه
                        </span>
                    </div>
    
                    <!-- left side -->
                    <div class="flex items-center gap-x-3 md:gap-x-4 child:text-zinc-700 child:dark:text-white">
                        <button id="add-to-favorite">
                            <svg class="w-5 h-5 ${isFavorite ? "text-red-500" : ""}">
                                <use href="#heart"></use>
                            </svg>
                        </button>
                        <button id="add-to-listen">
                            <svg class="w-5 h-5">
                                <use href="#play"></use>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
        getMusics.appendChild(createDiv);
    }
}
const findMusicToAddFavorite = (e) => {
    const getAddToFavoriteBtn = e.target.closest("button");

    if (getAddToFavoriteBtn && getAddToFavoriteBtn.id === "add-to-favorite") {
        const getId = Number(getAddToFavoriteBtn.parentElement.parentElement.parentElement.parentElement.getAttribute("data-id"));
        const findMusic = MusicsList.find((item) => item.id === getId)
        musicsFavorite.find((item) => item.id === findMusic.id) !== undefined
            ? (removeFromFavorite(findMusic.id), getAddToFavoriteBtn.children[0].classList.remove("text-red-500"))
            : (addToFavorite(findMusic), getAddToFavoriteBtn.children[0].classList.add("text-red-500"), musicsFavorite.push(findMusic))

        saveFavoritesToLocalStorage();
    }
}
const addToFavorite = (findMusic) => {
    const createDiv = document.createElement("div");
    createDiv.classList.add("relative", "w-full", "rounded-xl", "overflow-hidden");
    createDiv.setAttribute("data-id", findMusic.id);
    createDiv.innerHTML = `
        <img src="./images/${findMusic.image}" alt="img ${findMusic.id}" class="w-full">

        <div class="absolute bottom-0 right-0 left-0 mx-auto bg-gradient-to-t from-black flex flex-col items-center justify-center gap-y-1 h-24 text-center">
            <p class="text-lg md:text-xl text-white font-medium cursor-pointer hover:text-emerald-500 dark:hover:text-emerald-500 transition-all">
                ${findMusic.musicName}
            </p>
            <span class="flex items-center gap-x-2 text-sm text-gray-400">
                <svg class="w-4 h-4">
                    <use href="#microphone"></use>
                </svg>
                ${findMusic.singerName}
            </span>
        </div>
    `
    getFavoriteMusics.appendChild(createDiv)

    checkStatusFavoriteMusics()
}
const removeFromFavorite = (id) => {
    musicsFavorite = musicsFavorite.filter((item) => item.id !== id)
    const favoriteMusicElement = getFavoriteMusics.querySelector(`[data-id="${id}"]`)
    favoriteMusicElement ? (favoriteMusicElement.remove(), checkStatusFavoriteMusics()) : ""

    saveFavoritesToLocalStorage();
}
const checkStatusFavoriteMusics = () => {
    getFavoriteMusics.children.length
        ? (getFavoriteMusics.parentElement.children[2].classList.remove("block"), getFavoriteMusics.parentElement.children[2].classList.add("hidden"))
        : (getFavoriteMusics.parentElement.children[2].classList.add("block"), getFavoriteMusics.parentElement.children[2].classList.remove("hidden"))
}
const searchMusics = (e) => {
    const getAllMusic = getMusics.querySelectorAll("#musics > div")
    const getText = e.target.value

    getAllMusic.forEach((item) => {
        const getMusicName = item.children[0].children[1].children[0].children[0].textContent.trim();

        getMusicName.indexOf(getText) !== -1 ? item.style.display = "block" : item.style.display = "none"
    })
}
const findMusicForPlay = (e) => {
    const getListenBtn = e.target.closest("button");

    if (getListenBtn && getListenBtn.id === "add-to-listen") {
        const getId = Number(getListenBtn.parentElement.parentElement.parentElement.parentElement.getAttribute("data-id"));
        const findMusic = MusicsList.find((item) => item.id === getId);

        if (musicPlay.length === 0) {
            musicPlay.push(findMusic);
        } else {
            musicPlay = [findMusic];
        }

        getMusic.innerHTML = "";

        const createDiv = document.createElement("div");
        createDiv.classList.add("relative", "w-full", "rounded-lg", "overflow-hidden");
        createDiv.setAttribute("data-id", findMusic.id);
        createDiv.innerHTML = `
            <img src="./images/${findMusic.image}" alt="image ${findMusic.id}"
                 class="flex items-center justify-center h-auto w-full object-cover">

            <div class="absolute bottom-0 right-0 left-0 w-full px-5 py-10 bg-gradient-to-t from-black">
                <audio id="song">
                    <source src="./audio/${findMusic.musicFile}" type="audio/mp3">
                </audio>
                <input type="range" value="0" id="progress">
                <button class="hidden items-center justify-center w-full mt-4" id="play-custom">
                    <svg class="w-8 h-8 text-white">
                        <use href="#play"></use>
                    </svg>
                </button>
                <button class="hidden items-center justify-center w-full mt-4" id="pause-custom">
                    <svg class="w-8 h-8 text-white">
                        <use href="#pause"></use>
                    </svg>
                </button>
            </div>
        `;
        getMusic.appendChild(createDiv);

        playSong(findMusic)
    }

}
const playSong = (findMusic) => {
    const getPauseBtn = document.querySelector("#pause-custom")
    getPauseBtn.classList.replace("hidden", "flex")

    if (audio) {
        audio.pause()
        audio.currentTime = 0;
    }

    audio = new Audio(`./audio/${findMusic.musicFile}`);
    audio.play();

    localStorage.setItem("currentPlayingMusic", JSON.stringify(findMusic));

    syncProgressBar();
}
const controlSong = (e) => {
    const getPauseBtn = document.querySelector("#pause-custom")
    const getPlayBtn = document.querySelector("#play-custom")

    const getPlay = e.target.closest("#play-custom");
    const getPause = e.target.closest("#pause-custom");

    if (getPause) {
        audio.pause();
        getPauseBtn.classList.replace("flex", "hidden")
        getPlayBtn.classList.replace("hidden", "flex")
    }

    if (getPlay) {
        audio.play();
        getPauseBtn.classList.replace("hidden", "flex")
        getPlayBtn.classList.replace("flex", "hidden")
    }
}
const syncProgressBar = () => {
    if (audio) {
        audio.addEventListener("timeupdate", () => {
            const progressBar = document.querySelector("#progress");
            progressBar.value = (audio.currentTime / audio.duration) * 100 || 0;
        });

        const progressBar = document.querySelector("#progress");
        progressBar.addEventListener("input", (e) => {
            if (audio.duration) {
                audio.currentTime = (e.target.value / 100) * audio.duration;
            }
        });
    }
};
const loadFavoritesFromLocalStorage = () => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
        musicsFavorite = JSON.parse(storedFavorites);
        musicsFavorite.forEach(addToFavorite);
    }
}
const saveFavoritesToLocalStorage = () => {
    localStorage.setItem('favorites', JSON.stringify(musicsFavorite));
}


// EventListeners
loadFavoritesFromLocalStorage()
loadMusicsList()
checkStatusFavoriteMusics()
toggleThemeBtn.addEventListener("click", function () {
    if (localStorage.theme === "dark") {
        document.documentElement.classList.remove("dark");
        localStorage.theme = "light";
    } else {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
    }
})
getMusics.addEventListener("click", findMusicToAddFavorite)
getMusics.addEventListener("click", findMusicForPlay)
getSearchInput.addEventListener("input", searchMusics)
getMusic.addEventListener("click", controlSong)
