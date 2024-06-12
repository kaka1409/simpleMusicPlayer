const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)


const playList = $('.playlist')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('.progress')
const nextBtn = $('.btn-next')
const preBtn = $('.btn-pre')
const loopBtn = $('.btn-repeat')
const randomBtn = $('.btn-random')


const app = {
    
    songs: [
        {
            name: 'Intentions',
            singer: 'Justine Bieber',
            path: './assets/songs/Intentions.mp3',
            image: './assets/song-thumb/intention.jpg'
        },
        {
            name: 'A new kind of love',
            singer: 'Frou Frou',
            path: './assets/songs/Frou Frou  A New Kind Of Love Nightcore TikTok remix.mp3',
            image: './assets/song-thumb/ANKOL.jpg'
        },
        {
            name: 'Firefies',
            singer: 'Khai Dreams',
            path: './assets/songs/khai dreams  Fireflies.mp3',
            image: './assets/song-thumb/fireflies.webp'
        },
        {
            name: 'Into your arms',
            singer: 'Ava Max',
            path: './assets/songs/Into Your Arms.mp3',
            image: './assets/song-thumb/IYA.jpg'
        },
        {
            name: 'Mood',
            singer: '24kGoldn, Iann Dior',
            path: './assets/songs/24kGoldn  Mood Lyrics ft Iann Dior.mp3',
            image: './assets/song-thumb/Mood.jpg'
        },
        {
            name: 'Sunflower',
            singer: 'Post Malone, Swae Lee',
            path: './assets/songs/Post Malone Swae Lee  Sunflower SpiderMan Into the SpiderVerse.mp3',
            image: './assets/song-thumb/Sunflower.jpg'
        },
        {
            name: 'Stay',
            singer: 'The kid LAROI, Justine Bieber',
            path: './assets/songs/The Kid LAROI Justin Bieber  STAY Official Video.mp3',
            image: './assets/song-thumb/Stay.jpg'
        },
        {
            name: 'Heat Wave',
            singer: 'Glass Animals',
            path: './assets/songs/Glass Animals  Heat Waves TikTok Remix.mp3',
            image: './assets/song-thumb/HW.jpg'
        },
        {
            name: 'Apologize',
            singer: 'Timbaland, OneRepublic',
            path: './assets/songs/Timbaland  Apologize ft OneRepublic.mp3',
            image: './assets/song-thumb/Apologize.jpg'
        },
        {
            name: 'Waiting For Love',
            singer: 'Avicii',
            path: './assets/songs/Avicii - Waiting For Love.mp3',
            image: './assets/song-thumb/WFL.jpg'
        }
    ],


    currentIndex: 0 ,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    render: function() {
        const htmls = this.songs.map( (song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? "active": "" }" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}');" >
                </div>

                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>

                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`
        })

        playList.innerHTML = htmls.join('')
    },



    handleEvent: function () {
        const cdWidth = cd.offsetWidth
        const cdRotate = cdThumb.animate([
            {transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdRotate.pause() // set as default

        document.onscroll = function() {
            const scroll = window.scrollY || document.documentElement.scrollTop
            cd.style.width = (cdWidth - scroll) > 0 ? cdWidth - scroll + 'px': 0
            cd.style.opacity = (cdWidth - scroll) / cdWidth
        }

        nextBtn.onclick = function() {
            if (app.isRandom) {
                app.playRandomSong()
            } else {
                app.nextSong()
            }
            audio.play()
            app.render()
            app.scrollIntoActiveSong()
        }

        preBtn.onclick = function() {
            if (app.isRandom) {
                app.playRandomSong()
            } else {
                app.preSong()
            }
            audio.play()
            app.render()
            app.scrollIntoActiveSong()
        }

        loopBtn.onclick = function() {
            app.repeatSong()
            this.classList.toggle('active')
        }

        randomBtn.onclick = function() {
            app.isRandom = !app.isRandom
            randomBtn.classList.toggle('active', app.isRandom)
        }

        playBtn.onclick = function() {
            if (app.isPlaying) {
                setTimeout(audio.pause(), 50)
            } else {
                audio.play()
            }

            audio.onpause = function() {
                app.isPlaying = false
                player.classList.remove('playing')
                cdRotate.pause()
            }

            audio.onplay = function() {
                app.isPlaying = true
                player.classList.add('playing')
                cdRotate.play()
            }
        }

        audio.ontimeupdate = function() {
            if(audio.duration) {
                const percent = Math.floor(audio.currentTime / audio.duration *100)
                progress.value = percent
            } 
        }

        audio.onended = function() {
            nextBtn.click()
        }

        progress.oninput = function(e) {
            const newPosition = audio.duration * (e.target.value / 100)
            audio.currentTime = newPosition

            progress.onmouseup = function() {
                audio.play()
            }
            audio.pause()
        }
    
        playList.onclick = function(e) {
            const songClick = e.target.closest('.song:not(.active)')
            const optionClick = e.target.closest('.option')
            if (songClick || optionClick) {

                if (songClick && !optionClick) {
                    app.currentIndex = Number(songClick.getAttribute('data-index'))
                    app.loadcurrentSong()
                    app.render()
                    audio.play()
                }

                if (optionClick) {
                    // add share feature
                }
            }

        }
    },

    nextSong: function() {
        this.currentIndex++
        
        if (this.currentIndex === this.songs.length ) {
            this.currentIndex = 0
        }

        this.loadcurrentSong()
    }, 

    preSong: function() {
        this.currentIndex--

        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }

        this.loadcurrentSong()
    },

    repeatSong: function() {
        if (this.isRepeat) {

            audio.removeAttribute("loop")
            this.isRepeat = false

        } else {

            audio.setAttribute("loop", "true")
            this.isRepeat = true
            
        }
        
    },

    playRandomSong: function() {
        let newIndex
       
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        
        this.currentIndex = newIndex
        this.loadcurrentSong()
    },

    scrollIntoActiveSong: function() {
        setTimeout( () => {
            $('.song.active').scrollIntoView({
                behavior: "smooth",
                block: "center"
            })
        },250)
    },

    loadcurrentSong: function() {

        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})` 
        audio.src = this.currentSong.path

    },

    start: function () {

        this.defineProperties()
        this.loadcurrentSong()
        this.render()
        this.handleEvent()

    }

}

app.start()