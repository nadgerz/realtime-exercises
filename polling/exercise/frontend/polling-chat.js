const chat = document.getElementById('chat')
const msgs = document.getElementById('msgs')

// let's store all current messages here
let allChat = []

// the interval to poll at in milliseconds
const INTERVAL = 10000

// a submit listener on the form in the HTML
chat.addEventListener('submit', function (e) {
  e.preventDefault()
  postNewMsg(chat.elements.user.value, chat.elements.text.value)
  chat.elements.text.value = ''
})

async function postNewMsg(user, text) {
  const data = {
    user,
    text,
  }

  const options = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const res = await fetch('/poll', options)
  const json = await res.json()

  return json
}

async function getNewMsgs() {
  let json

  try {
    const res = await fetch('/poll')
    // console.log(res)
    // console.log(res.body)
    console.log(typeof res.body)
    // const body = JSON.parse(res.body)
    // var text = ''
    // for (var key in body) {
    //   text += 'Index is: ' + key + '\nDescription is:  ' + body[key]
    // }
    // // The Description is:  "descriptive string"
    // console.log('Got a response: ', text)

    json = await res.json()
    console.log(json)
  } catch (e) {
    console.error(`getNewMsgs(): polling error`, e)
  }

  allChat = json.msg

  render()

  setTimeout(getNewMsgs, INTERVAL)
}

function render() {
  // as long as allChat is holding all current messages, this will render them
  // into the ui. yes, it's inefficent. yes, it's fine for this example
  const html = allChat.map(({ user, text, time, id }) =>
    template(user, text, time, id),
  )
  msgs.innerHTML = html.join('\n')
}

// given a user and a msg, it returns an HTML string to render to the UI
const template = (user, msg) =>
  `<li class="collection-item"><span class="badge">${user}</span>${msg}</li>`

// make the first request
getNewMsgs()
