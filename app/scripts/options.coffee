'use strict'

# POST the data to the server using XMLHttpRequest
getToken = (username, password, done) ->
  password = md5(password)

  # The URL to POST our data to
  postUrl = 'https://api.nirvanahq.com/?api=rest'

  # Set up an asynchronous AJAX POST request
  xhr = new XMLHttpRequest()
  xhr.open 'POST', postUrl, true

  # Prepare the data to be POSTed by URLEncoding each field's contents
  username = encodeURIComponent(username)
  password = encodeURIComponent(password)
  params = "method=auth.new&u=#{username}&p=#{password}"

  # Set correct header for form data
  xhr.setRequestHeader 'Content-type', 'application/x-www-form-urlencoded'

  # Handle request state change events
  xhr.onreadystatechange = ->
    # If the request completed
    if xhr.readyState is 4
      if xhr.status is 200
        jsonData = JSON.parse(xhr.responseText)
        token = jsonData['results'][0]['auth']['token'] || ''
        done(token)
      else
        throw 'Error getting token: ' + xhr.statusText

  # Send the request and set status
  xhr.send params

loadOptions = ->
  if localStorage['username']?
    document.getElementById('username').value = localStorage['username']
  if localStorage['token']?
    document.getElementById('token').textContent = localStorage['token']

saveOptions = ->
  username = document.getElementById('username').value
  password = document.getElementById('password').value
  tokenDisplay = document.getElementById('token')
  tokenDisplay.textContent = 'Processing...'
  getToken username, password, (token) ->
    localStorage['username'] = username
    localStorage['token'] = token
    document.getElementById('password').value = ''
    tokenDisplay.textContent = token

eraseOptions = ->
  localStorage.removeItem 'username'
  localStorage.removeItem 'password'
  localStorage.removeItem 'token'
  location.reload()

document.addEventListener('DOMContentLoaded', loadOptions)
document.getElementById('login').addEventListener('click', saveOptions)
document.getElementById('erase').addEventListener('click', eraseOptions)
