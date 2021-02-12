
fetchData = () => {
    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(resp => resp.json())
    .then(quotes => {
        quotes.forEach(quote => {
        appendLi(quote)
      })
        fetchForm()
        handleButtonClick()
    })
}

appendLi = (quote) => {
     const ul = document.querySelector("#quote-list")
     let li = `
     <li class='quote-card'>
     <blockquote class="blockquote">
       <p class="mb-0">${quote.quote}</p>
       <footer class="blockquote-footer">${quote.author}</footer>
       <br>
       <button id='${quote.id}' class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
       <button id='${quote.id}' class='btn-danger'>Delete</button>
     </blockquote>
   </li>
   `
   return ul.innerHTML += li
 
}

fetchForm = () => {
  const form = document.querySelector('#new-quote-form')
  form.addEventListener('submit', function(event){
    event.preventDefault()

    const newData = {
      quote: event.target['quote'].value,
      author: event.target['author'].value
    }
    postForm(newData)
  })
}

postForm = (formData) => {
  const reqObject = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  }
  fetch('http://localhost:3000/quotes', reqObject)
  .then(resp => resp.json())
  .then(quote => {
    appendLi({
      ...quote,
      likes: []
    })
    console.log(quote)
  })
}

handleButtonClick = () => {
const qList = document.querySelector('#quote-list')
qList.addEventListener('click', function(e){
  console.log(e.target.className)
  switch(e.target.className){
  case 'btn-success':
    handleLike(e)
     break;
  case 'btn-danger':
    handleDelete(e)
     break;
  default:
    console.log("Hello World")
  }

 })
}

handleLike = (e) => {
const addLike = {
  quoteId: e.target.id,
  createdAt: Date.now()
}
const reqObj = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(addLike)
}
fetch('http://localhost:3000/likes', reqObj)
.then(resp => resp.json())
.then(data => {
  console.log(e.target.childNodes[1])
  const span = e.target.childNodes[1]
  span.innerText = parseInt(span.innerText) + 1
})
}

handleDelete = (e) => {
fetch(`http://localhost:3000/quotes/${e.target.id}`, {method: 'DELETE'})
.then(resp => resp.json())
.then(data => {
   e.target.parentNode.parentNode.remove()
  
})

}

fetchData()