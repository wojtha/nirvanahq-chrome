'use strict'

generateUUID = ->
  d = new Date().getTime()
  uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) ->
    r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    ((if c is 'x' then r else (r & 0x7 | 0x8))).toString 16
  )
  uuid

unixtimeNow = ->
  Math.round(Date.now()/1000)

# POST the data to the server using XMLHttpRequest
getToken = (done) ->
  if localStorage['token']?
    done(localStorage['token'])
  else
    throw 'Token not found, please login first'

createTask = (title, note, token, done) ->
  statusDisplay = document.getElementById('status-display')

   # The URL to POST our data to
  postUrl = "https://api.nirvanahq.com/?api=json&appid=gem&authtoken=#{token}"

  # Set up an asynchronous AJAX POST request
  xhr = new XMLHttpRequest()
  xhr.open 'POST', postUrl, true

  now = unixtimeNow()
  uuid = generateUUID()
  data =
    method: 'task.save'
    id:     uuid
    name:   title
    _name:  now
    note:   note
    _note:  now
    type:   0
    _type:  now
    state:  0
    _state: now

  payload = JSON.stringify([data])

  # Handle request state change events
  xhr.onreadystatechange = ->
    # If the request completed
    if xhr.readyState is 4
      statusDisplay.innerHTML = ''
      if xhr.status is 200
        statusDisplay.innerHTML = 'Saved!'
        done()
      else
        statusDisplay.innerHTML = 'Error saving: ' + xhr.statusText

  # Send the request and set status
  xhr.send payload
  statusDisplay.innerHTML = 'Saving...'

submitForm = (event) ->
  event.preventDefault()
  unless localStorage['token']?
    alert('Please go to options and login first')
  getToken (token) ->
    title = document.getElementById('title').value
    note = document.getElementById('note').value
    createTask title, note, token, ->
      window.setTimeout(window.close, 1000)

chrome.tabs.query { currentWindow: true, active: true }, (tabs) ->
  currentTab = tabs[0]
  title = document.getElementById('title')
  note = document.getElementById('note')

  title.value = currentTab.title
  note.value = currentTab.url

document.getElementById('add-task').addEventListener('submit', submitForm)
