(function() {
  'use strict';
  var eraseOptions, getToken, loadOptions, saveOptions;

  getToken = function(username, password, done) {
    var params, postUrl, xhr;
    password = md5(password);
    postUrl = 'https://api.nirvanahq.com/?api=rest';
    xhr = new XMLHttpRequest();
    xhr.open('POST', postUrl, true);
    username = encodeURIComponent(username);
    password = encodeURIComponent(password);
    params = "method=auth.new&u=" + username + "&p=" + password;
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
      var jsonData, token;
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          jsonData = JSON.parse(xhr.responseText);
          token = jsonData['results'][0]['auth']['token'] || '';
          return done(token);
        } else {
          throw 'Error getting token: ' + xhr.statusText;
        }
      }
    };
    return xhr.send(params);
  };

  loadOptions = function() {
    if (localStorage['username'] != null) {
      document.getElementById('username').value = localStorage['username'];
    }
    if (localStorage['token'] != null) {
      return document.getElementById('token').textContent = localStorage['token'];
    }
  };

  saveOptions = function() {
    var password, tokenDisplay, username;
    username = document.getElementById('username').value;
    password = document.getElementById('password').value;
    tokenDisplay = document.getElementById('token');
    tokenDisplay.textContent = 'Processing...';
    return getToken(username, password, function(token) {
      localStorage['username'] = username;
      localStorage['token'] = token;
      document.getElementById('password').value = '';
      return tokenDisplay.textContent = token;
    });
  };

  eraseOptions = function() {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    localStorage.removeItem('token');
    return location.reload();
  };

  document.addEventListener('DOMContentLoaded', loadOptions);

  document.getElementById('login').addEventListener('click', saveOptions);

  document.getElementById('erase').addEventListener('click', eraseOptions);

}).call(this);
