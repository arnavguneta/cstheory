const dfaForm = document.querySelector('form')
const textboxOne = document.querySelector('#textbox-1')
const textboxTwo = document.querySelector('#textbox-2')
const textboxThree = document.querySelector('#textbox-3')
const message = document.querySelector('#message-1')

dfaForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const dfa_1 = textboxOne.value
    const dfa_2 = textboxTwo.value
    const op = document.title.toString().split(' ')[0].toLowerCase()

    const data = { op, dfa_1, dfa_2 }

    message.textContent = 'Loading...'
    const postData = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }

    fetch('/api/dfa', postData).then((response) => {
        response.json().then((res) => {
            if (res.error)
                messageOne.textContent = res.error
            else {
                message.textContent = "Union of DFAs 1 and 2"
                textboxThree.textContent = res.data
                textboxThree.style.visibility = "visible"
            }
        })
    })
})