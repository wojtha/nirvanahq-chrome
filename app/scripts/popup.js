(function() {
  'use strict';
  var createTask, generateUUID, getToken, submitForm, unixtimeNow;

  generateUUID = function() {
    var d, uuid;
    d = new Date().getTime();
    uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r;
      r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : r & 0x7 | 0x8).toString(16);
    });
    return uuid;
  };

  unixtimeNow = function() {
    return Math.round(Date.now() / 1000);
  };

  getToken = function(done) {
    if (localStorage['token'] != null) {
      return done(localStorage['token']);
    } else {
      throw 'Token not found, please login first';
    }
  };

  createTask = function(title, note, token, done) {
    var data, now, payload, postUrl, statusDisplay, uuid, xhr;
    statusDisplay = document.getElementById('status-display');
    postUrl = "https://api.nirvanahq.com/?api=json&appid=gem&authtoken=" + token;
    xhr = new XMLHttpRequest();
    xhr.open('POST', postUrl, true);
    now = unixtimeNow();
    uuid = generateUUID();
    data = {
      method: 'task.save',
      id: uuid,
      name: title,
      _name: now,
      note: note,
      _note: now,
      type: 0,
      _type: now,
      state: 0,
      _state: now
    };
    payload = JSON.stringify([data]);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        statusDisplay.innerHTML = '';
        if (xhr.status === 200) {
          statusDisplay.innerHTML = 'Saved!';
          return done();
        } else {
          return statusDisplay.innerHTML = 'Error saving: ' + xhr.statusText;
        }
      }
    };
    xhr.send(payload);
    return statusDisplay.innerHTML = 'Saving...';
  };

  submitForm = function(event) {
    event.preventDefault();
    if (localStorage['token'] == null) {
      alert('Please go to options and login first');
    }
    return getToken(function(token) {
      var note, title;
      title = document.getElementById('title').value;
      note = document.getElementById('note').value;
      return createTask(title, note, token, function() {
        return window.setTimeout(window.close, 1000);
      });
    });
  };

  chrome.tabs.query({
    currentWindow: true,
    active: true
  }, function(tabs) {
    var currentTab, note, title;
    currentTab = tabs[0];
    title = document.getElementById('title');
    note = document.getElementById('note');
    title.value = currentTab.title;
    return note.value = currentTab.url;
  });

  document.getElementById('add-task').addEventListener('submit', submitForm);

}).call(this);
