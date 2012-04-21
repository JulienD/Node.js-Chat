
  // Création d'un objet message pour
  function Message(nickname, text) {
    this.timestamp = new Date().getTime();
    this.nickname = nickname;
    this.text = text;
  }
  // renderHtml - génération du html du message
  Message.prototype.renderHtml = function() {
    return '<div>' + new Date(this.timestamp).toLocaleTimeString() + ' ' + this.nickname + ' ' + this.text + '</div>';
  }
  // getData    - fonction de récupération des éléments du message timestamp + user + message
  Message.prototype.getData = function() {
    var ret = {'timestamp' : this.timestamp, 'nickname' : this.nickname, 'text' : this.text};
    return ret;
  }


  var nickname = 'bob';

  var socket = io.connect();
  socket.on('getChatMessage', function (data) {
    var html ='';
    for (i in data) {
      html += new Message(data[i].nickname, data[i].text).renderHtml();
    }
    document.getElementById('chat').innerHTML = html;
  });


  socket.on('updateChatMessage', function (data) {        
    document.getElementById('chat').innerHTML += new Message(data.nickname, data.text).renderHtml();
  });


  socket.on('connected', function (id) {
    document.getElementById('chat').innerHTML += '<li><span>Connected</span> ' + id + '</li>';
  });

  function sendMessage(mess) {

    var text = document.getElementById('message').value;
    console.log(text);
    var m = new Message(nickname, text);
    console.log(m);

    // On appelle l'evenement se trouvant sur le serveur pour qu'il enregistre le message et qu'il l'envoie a tous les autres clients connectes (sauf nous)
    socket.emit('sendMessage', m.getData());

    // On affiche directement notre message dans notre page
    document.getElementById('chat').innerHTML += m.renderHtml();

    // Une supprime le message saisie dans le formulaire.
    document.getElementById('message').value = '';

    // On retourne false pour que la page ne soit pas rechargée.
    return false;
  };

  function sendAnnouncement() {
    socket.emit('sendAnnouncement', nickname);
  };
  
  socket.on('announcement', function (nickname) {     
    document.getElementById('chat').innerHTML += '<li>' + nickname + ' has joined the chat</li>';
  });




var messagesArea = document.getElementById('messages');
function addMessage(username, message, time) {
  if (typeof time != 'string') {
    var date = new Date(time);
    time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }
  var line = '[' + time + '] <strong>' + username + '</strong>: ' + message + '<br />';
  messagesArea.innerHTML = line + messagesArea.innerHTML;
}
  