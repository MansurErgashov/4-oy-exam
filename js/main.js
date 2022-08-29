const elSearchInput = document.querySelector('.header__box-box-label-input')
const elMarkList = document.querySelector('.bookmarks__list')
const elMoreInfoWrapper = document.querySelector('.info__container')
const elCardList = document.querySelector('.cards__list')
const elCardResult = document.querySelector('.result__span')
const elOrderNewest = document.querySelector('.results')
const elReadBtn = document.querySelector('.cards__item-readbtn')
const elMoreInfoWrChild = document.querySelector('.info__container')
const elMoreInfoDark = document.querySelector('#light')
const elCardTemp = document.querySelector('.card__template').content
const elMarkTemp = document.querySelector('.bookmark__temp').content
const elMoreInfoTemp = document.querySelector('.temp__moreInfo').content


// dark mode
const elDarkBtn = document.querySelector('.header__box-label-btn-img')
const elDarkHeaders = document.querySelector('.header__container')
const elDarkResults = document.querySelector('.results__container')
const elDarkCounts = document.querySelector('.results__count')
const elDarkinputs = document.querySelector('.header__box-box-label-input')
const elBookmarks = document.querySelector('.bookmarks')
const elBookmarkHeading = document.querySelector('.bookmarks__heading')
const elBookmarkDesc = document.querySelector('.bookmarks__desc')
const elBookmarkItem = document.querySelector('.bookmarks__item')
const elBookmarkItemTitle = document.querySelector('.bookmarks__item-box-title')
const elBookmarkItemBody = document.querySelector('.bookmarks__item-box-body')
const elCards = document.querySelector('.book-cards__cards')
const elCardsImg = document.querySelector('.cards__item-img')
const elCardsTitle = document.querySelector('.cards__item-title')
const elCardsAuthors = document.querySelector('.cards__item-author')
const elCardsYear = document.querySelector('.cards__item-year')
elDarkBtn.addEventListener('click', function() {
    elDarkinputs.classList.toggle('header__box-box-label-input--dark')
    elDarkHeaders.classList.toggle('header__container--dark')
    elDarkResults.classList.toggle('results__container--dark')
    elDarkCounts.classList.toggle('results__count--dark')
    elBookmarks.classList.toggle('bookmarks--dark')
    elBookmarkHeading.classList.toggle('bookmarks__heading--dark')
    elBookmarkDesc.classList.toggle('bookmarks__desc--dark')
    elBookmarkItem.classList.toggle('bookmarks__item--dark')
    elBookmarkItemTitle.classList.toggle('bookmarks__item-box-title--dark')
    elBookmarkItemBody.classList.toggle('bookmarks__item-box-body--dark')
    elCards.classList.toggle('cards--dark')
    elCardsImg.classList.toggle('cards__item-img--dark')
    elCardsTitle.classList.toggle('items--dark')
    elCardsAuthors.classList.toggle('items--dark')
    elCardsYear.classList.toggle('items--dark')
})



elSearchInput.addEventListener('input', function() {

    let inputValue = elSearchInput.value.trim();
    if(inputValue.length > 0) {
        
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${inputValue}`)
        .then(res => res.json())
        .then(data => {
            if(!data.error) {
                renderCards(data.items.splice(0, 10), elCardList)
                elCardResult.textContent = data.totalItems
            }
            // console.log(data[0].item.id);
        })
    }
})
function renderCards(array, wrapper) {

    wrapper.innerHTML = ''
    let cardFragment = document.createDocumentFragment();

    array.forEach(item => {

        const newCardsTemp = elCardTemp.cloneNode(true)
        newCardsTemp.querySelector('.cards__item-img').src = item.volumeInfo.imageLinks.smallThumbnail
        newCardsTemp.querySelector('.cards__item-title').textContent = item.volumeInfo.title
        newCardsTemp.querySelector('.cards__item-author').textContent = item.volumeInfo.authors
        newCardsTemp.querySelector('.cards__item-year').textContent = item.volumeInfo.publishedDate
        newCardsTemp.querySelector('.cards__item-btns-bookmarkbtn').dataset.deleteBtnId= item.id
        newCardsTemp.querySelector('.cards__item-btns-infobtn').dataset.infoBtnId= item.id
        newCardsTemp.querySelector('.cards__item-readbtn').dataset.readBtnId= item.id

        cardFragment.appendChild(newCardsTemp)
    });
    wrapper.appendChild(cardFragment)
}


// Bookmark
let bookmarksArray = []

if(localStorage.getItem('item')) {
    JSON.parse(localStorage.getItem('item')).forEach(item => {
        bookmarksArray.push(item)
    })
    renderBookmarks(bookmarksArray, elMarkList)
}

elCardList.addEventListener('click', function(event) {
    let bookmarkItemId = event.target.dataset.deleteBtnId
    // console.log(bookmarkItemId);
    // console.log(bookmarkItemId);
    let inputValue = elSearchInput.value.trim()

    if(bookmarkItemId) {
        
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${inputValue}`)
        .then(res => res.json())
        .then(data => {
            let getItem = data.items.find(item => {
                return item.id == bookmarkItemId
            })
            if(bookmarksArray.length == 0) {

                bookmarksArray.unshift(getItem)
                localStorage.setItem('item', JSON.stringify(bookmarksArray))
                // console.log(localStorage.getItem('item'));
                renderBookmarks(JSON.parse(localStorage.getItem('item')), elMarkList)
            } else {
                let getMarkItem = bookmarksArray.find(item => {
                    return item.id == getItem.id
                })
                if(!getMarkItem) {

                    bookmarksArray.unshift(getItem)

                    localStorage.setItem('item', JSON.stringify(bookmarksArray))
                }
                renderBookmarks(JSON.parse(localStorage.getItem('item')), elMarkList)
            }
        })
    } 
})


// render Bookmark
function renderBookmarks(array, wrapper) {
    
    wrapper.innerHTML = ''
    let bookmarkFragment = document.createDocumentFragment();

    array.forEach(item => {
        let newMarkTemp = elMarkTemp.cloneNode(true)
        newMarkTemp.querySelector('.bookmarks__item-box-title').textContent = item.volumeInfo.title
        newMarkTemp.querySelector('.bookmarks__item-box-body').textContent = item.volumeInfo.authors
        newMarkTemp.querySelector('.bookmarks__item').dataset.itemId = item.id

        bookmarkFragment.appendChild(newMarkTemp)
    })
    wrapper.appendChild(bookmarkFragment)
}

// Delete bookmark

elMarkList.addEventListener('click', function(event) {
    let deleteBtn = event.target.closest('.bookmarks__item-btns-deletebtn')
    let deleteArray

    if(deleteBtn) {
        deleteArray = JSON.parse(localStorage.getItem('item'))
    }

    let itemIndex = deleteArray.findIndex(item => {

        return item.id == deleteBtn.closest('.bookmarks__item').dataset.itemId
    })
    deleteArray.splice(itemIndex, 1)

    bookmarksArray = deleteArray
    localStorage.setItem('item', JSON.stringify(bookmarksArray))
    renderBookmarks(JSON.parse(localStorage.getItem('item')) , elMarkList)
   
})


// Order by newest
elOrderNewest.addEventListener('click', function(event) {

    let newestBtn = event.target.closest('.results__btn')

    if(newestBtn && elSearchInput.value.trim()) {
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${elSearchInput.value.trim()}&orderBy=newest`)
        .then(res => res.json())
        .then(data => {
            renderCards(data.items, elCardList)
        })
    }

})


// Read
// elCardList.addEventListener('click', function(event) {
//     event.preventDefault();

//     let readBtnId = event.target.dataset.readBtnId

//     if(readBtnId) {
//         fetch(`https://www.googleapis.com/books/v1/volumes/${readBtnId}`)
//         .then(res => res.json())
//         .then(data => {
//             // elReadBtn.href = data.accessInfo.webReaderLink
//             console.log(data);
//             elReadBtn.setAttribute('href', data.accessInfo.webReaderLink)
//             console.log(elReadBtn);
//         })
//     }
// })


// More info
let moreInfoArray = []
elCardList.addEventListener('click', function(event) {

    let moreInfoId = event.target.dataset.infoBtnId

        if(moreInfoId) {
            elMoreInfoDark.classList.add('more-info')
            elMoreInfoWrChild.classList.remove('info__none')
            fetch(`https://www.googleapis.com/books/v1/volumes/${moreInfoId}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                moreInfoArray.push(data)
                renderMoreInfo(moreInfoArray, elMoreInfoWrapper)
                moreInfoArray = []
            })
        }
})

elMoreInfoWrChild.addEventListener('click', function(event) {
    let closeBtn = event.target.closest('.info__box-closeBtn')
    if(closeBtn) {
        elMoreInfoDark.classList.remove('more-info')
        elMoreInfoWrChild.classList.add('info__none')
    }
})

function renderMoreInfo(array, wrapper) {

    wrapper.innerHTML = ''
    let moreInfoFragment = document.createDocumentFragment();
//accessInfo
//webReaderLink
    array.forEach( item => {
        console.log(item);
        const newMoreInfoTemp = elMoreInfoTemp.cloneNode(true)
        newMoreInfoTemp.querySelector('.info__box-heading').textContent = item.volumeInfo.title
        newMoreInfoTemp.querySelector('.info__img').src = item.volumeInfo.imageLinks.thumbnail
        newMoreInfoTemp.querySelector('.info__text').textContent = item.volumeInfo.description
        newMoreInfoTemp.querySelector('.info__Author-span').textContent = item.volumeInfo.authors
        newMoreInfoTemp.querySelector('.info__Published-span').textContent = item.volumeInfo.publishedDate
        newMoreInfoTemp.querySelector('.info__Publishers-span').textContent = item.volumeInfo.publisher
        newMoreInfoTemp.querySelector('.info__Categories-span').textContent = item.volumeInfo.printType
        newMoreInfoTemp.querySelector('.info__Pages-span').textContent = item.volumeInfo.pageCount
        newMoreInfoTemp.querySelector('.info__readBtn').href = item.accessInfo.webReaderLink

        moreInfoFragment.appendChild(newMoreInfoTemp)
    })
    wrapper.appendChild(moreInfoFragment)
}








