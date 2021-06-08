// APIBASE
const HASE_KEY = '70a4d3ecf68d7a742fb1f5ea5f260790'
const API_KEY = '7dd22034e230f2bd80637d6a43a387fb'
const container = document.querySelector('.card_container')
let pageCounter = 1;
let offsetCounter = 0;
const LIMIT = 20
const TOTAL_HEROES = 1493;
const TOTAL_PAGES = Math.floor(TOTAL_HEROES / LIMIT)

const getRequest = (quaries , searchString , cb) => {
    const baseurl = `http://gateway.marvel.com/v1/public/characters?ts=1&apikey=${API_KEY}&hash=${HASE_KEY}&${quaries}${!searchString ? null : `&nameStartsWith=${searchString}`}&orderBy=-modified`
    fetch(baseurl)
    .then(res => res.json())
    .then(el => {
        cb(el.data)
    })
    .catch(err => {
        console.log(err);
    })
}

window.addEventListener('load' , () => {
    getRequest(`offset=${offsetCounter}&limit=${LIMIT}` , '' ,res => {
        const temp = res.results.map(item => cardTemplate(item)).join('')
        container.innerHTML = temp
        container.insertAdjacentHTML('afterend' , `
        <div class='pagination'>
            <span id='prevBtn' class='prevBtn'><i class="fas fa-chevron-left"></i></span>
            <div id='page'></div>
            <span id='nextBtn' class='nextBtn'><i class="fas fa-chevron-right"></i></span>
        </div>`)

        const page = document.getElementById('page')
        page.innerHTML = pageCounter
    })
})

function cardTemplate({name , id , thumbnail: {extension , path}}){
    return `
    <div onclick='singleShow(${id})' id='el' class="card">
        <img src="${path}.${extension}" alt="">
        <div class="card_title">
            <h2>${name}</h2>
        </div>
    </div>
    `
}

const quadBtn = document.querySelector('.quadBtn')
const tripleBtn = document.querySelector('.tripleBtn')

quadBtn.addEventListener('click' , e => {
    e.preventDefault()
    quadBtn.classList.remove('noActive')
    tripleBtn.classList.remove('active')
    container.classList.remove('active')
})

tripleBtn.addEventListener('click' , e => {
    e.preventDefault()
    tripleBtn.classList.add('active')
    quadBtn.classList.add('noActive')
    container.classList.add('active')
})

const searchInput = document.querySelector('.searchInput')
searchInput.addEventListener('input' , e => {
    const pagination = document.querySelector('.pagination')
    pagination.classList.add('active')
    const value = e.target.value

    if(value === ''){
        window.location.reload()
    }else{
        getRequest(`offset=${offsetCounter}&limit=${LIMIT}`,value , res => {
            const temp = res.results.reduce((prev , item) => {
                return prev += cardTemplate(item)
            }, '')
            container.innerHTML = temp
        })
    }
})

function singleShow(id){
    const pagination = document.querySelector('.pagination')
    pagination.classList.add('active')
    const baseurl = `http://gateway.marvel.com/v1/public/characters/${id}?ts=1&apikey=${API_KEY}&hash=${HASE_KEY}`
    fetch(baseurl)
    .then(res => res.json())
    .then(el => {
        let singleName = ''
        el.data.results.forEach(item => {
            singleName += item.name.toUpperCase()
        })
        let check = false
        const singleArr = []
        const singleHeroBase = `https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/all.json`
        fetch(singleHeroBase)
        .then(res => res.json())
        .then(item => {
            item.forEach(em => {
                if(em.name.toUpperCase() == singleName){
                    check = true
                    singleArr.push(em)
                }
            })
            if(check === false){
                singleArr.push(el.data.results)
                const temp = singleArr.reduce((prev , item) => {
                    return prev += singleMarvelTemplate(item)
                }, '')
                container.innerHTML = temp
            }else{
                const temp = singleArr.reduce((prev , item) => {
                    return prev += singleCardTemplate(item)
                }, '')
                container.innerHTML = temp
            }
        })
        .catch(err => {
            console.log(err);
        })
    })
    .catch(err => {
        console.log(err);
    })
}

function singleMarvelTemplate([{name , events: {available: el4} ,  stories: {available: el3} , series: {available: el2}, comics: {available: el1} , thumbnail: {path , extension}}]){
    return `
    <div class="hero">
        <div class="back">
            <span onclick="reLoad()">Back</span>
        </div>
        <div class="hero_child">
            <div class="hero_picture">
                <img src="${path}.${extension}" alt="">
            </div>  
        </div>
        <div class="hero_child hero_child_alt">
            <div class="hero_title">
                <h2>${name}</h2>
            </div>
        <div class="hero_body">
            <ul>
                <li>
                    <span>Comics:</span>
                    <span>${el1}</span>
                </li>
                <li>
                    <span>Series:</span>
                    <span>${el2}</span>
                </li>
                <li>
                    <span>Stories:</span>
                    <span>${el3}</span>
                </li>
                <li>
                    <span>Events:</span>
                    <span>${el4}</span>
                </li>
            </ul>
        </div>
    </div>
    `
}

function reLoad(){
    window.location.reload()
}

function singleCardTemplate({name , biography: {fullName , alterEgos , placeOfBirth , firstAppearance , publisher , alignment} , powerstats: {intelligence , strength , speed , power , combat , durability} , images: {lg} , appearance: {gender , race , height , weight , eyeColor , hairColor}}){
    return `
        <div class="hero">
        <div class="back">
            <span onclick="reLoad()">Back</span>
        </div>
        <div class="hero_child">
            <div class="hero_picture">
                <img src="${lg}" alt="">
            </div>
        </div>
        <div class="hero_child hero_child_alt">
            <div class="hero_title">
                <h2>${name}</h2>
            </div>
            <div class="hero_body">
                <ul>
                    <li>
                        <span>Gender:</span>
                        <span>${gender}</span>
                    </li>
                    <li>
                        <span>Race:</span>
                        <span>${race}</span>
                    </li>
                    <li>
                        <span>Height:</span>
                        <span>${height}</span>
                    </li>
                    <li>
                        <span>Weight:</span>
                        <span>${weight}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="hero_stats">
            <div class="hero_statsTitle">
                <h2>PowerStats</h2>
            </div>
            <div class="hero_statsBody">
                <div class="hero_inner">
                    <div class="hero_name">
                        <h3>Intelligence</h3>
                    </div>
                    <div class="hero_content">
                        <div class='showProcent'>${intelligence}%</div>
                        <div style='height: ${intelligence}%' class="hero_fill"></div>
                    </div>
                </div>
                <div class="hero_inner">
                    <div class="hero_name">
                        <h3>Strength</h3>
                    </div>
                    <div class="hero_content">
                        <div class='showProcent'>${strength}%</div>
                        <div style='height: ${strength}%' class="hero_fill"></div>
                    </div>
                </div>
                <div class="hero_inner">
                    <div class="hero_name">
                        <h3>Speed</h3>
                    </div>
                    <div class="hero_content">
                        <div class='showProcent'>${speed}%</div>
                        <div style='height: ${speed}%' class="hero_fill"></div>
                    </div>
                </div>
                <div class="hero_inner">
                    <div class="hero_name">
                        <h3>Durability</h3>
                    </div>
                    <div class="hero_content">
                    <div class='showProcent'>${durability}%</div>
                        <div style='height: ${durability}%' class="hero_fill"></div>
                    </div>
                </div>
                <div class="hero_inner">
                    <div class="hero_name">
                        <h3>Power</h3>
                    </div>
                    <div class="hero_content">
                    <div class='showProcent'>${power}%</div>
                        <div style='height: ${power}%' class="hero_fill"></div>
                    </div>
                </div>
                <div class="hero_inner">
                    <div class="hero_name">
                        <h3>Combat</h3>
                    </div>
                    <div class="hero_content">
                        <div class='showProcent'>${combat}%</div>
                        <div style='height: ${combat}%' class="hero_fill"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="hero_info">
            <div class="hero_statsTitle">
                <h2>More Info</h2>
            </div>
            <div class="hero_wrapper">
                <div class="hero_item">
                    <ul>
                        <li>
                            <span>EyeColor:</span>
                            <span>${eyeColor}</span>
                        </li>
                        <li>
                            <span>HairColor:</span>
                            <span>${hairColor}</span>
                        </li>
                        <li>
                            <span>FullName:</span>
                            <span>${fullName}</span>
                        </li>
                        <li>
                            <span>Alignment:</span>
                            <span>${alignment}</span>
                        </li>
                    </ul>
                </div>
                <div class="hero_item">
                    <ul>
                        <li>
                            <span>AlterEgos:</span>
                            <span>${alterEgos}</span>
                        </li>
                        <li>
                            <span>Publisher:</span>
                            <span>${publisher}</span>
                        </li>
                        <li>
                            <span>PlaceOfBirth:</span>
                            <span>${placeOfBirth}</span>
                        </li>
                        <li>
                            <span>FirstAppearance:</span>
                            <span>${firstAppearance}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    `
}

// Pagination

document.body.addEventListener('click' , e => {
    const value = e.target

    if(value.id === 'nextBtn'){
        document.querySelector('#prevBtn').classList.remove('disabled')

        if(pageCounter >= 1 && pageCounter <= TOTAL_PAGES){
            if(pageCounter === TOTAL_PAGES){
                document.querySelector('#nextBtn').classList.add('disabled')
                getRequest(`offset=${offsetCounter += LIMIT}&limit=${LIMIT}` , '' , res => {
                    pageCounter++
                    const temp = res.results.map(item => cardTemplate(item)).join('')
                    container.innerHTML = temp
                    const page = document.getElementById('page')
                    page.innerHTML = pageCounter
                })
            }else{
                getRequest(`offset=${offsetCounter += LIMIT}&limit=${LIMIT}` , '' , res => {
                    pageCounter++
                    const temp = res.results.map(item => cardTemplate(item)).join('')
                    container.innerHTML = temp
                    const page = document.getElementById('page')
                    page.innerHTML = pageCounter
                })
            }
        }
    }
})

document.body.addEventListener('click' , e => {
    const value = e.target

    if(value.id === 'prevBtn'){
        if(pageCounter >= 1){
            pageCounter--
            if(pageCounter === 1){
                value.classList.add('disabled')
                offsetCounter = 0
                getRequest(`offset=${offsetCounter}&limit=${LIMIT}` , '' , res => {
                    const temp = res.results.map(item => cardTemplate(item)).join('')
                    container.innerHTML = temp
                    const page = document.getElementById('page')
                    page.innerHTML = pageCounter
                })
            }else{
                getRequest(`offset=${offsetCounter -= LIMIT}&limit=${LIMIT}` , '' , res => {
                    document.querySelector('#nextBtn').classList.remove('disabled')
                    const temp = res.results.map(item => cardTemplate(item)).join('')
                    container.innerHTML = temp
                    const page = document.getElementById('page')
                    page.innerHTML = pageCounter
                })
            }
        }
    }
})
