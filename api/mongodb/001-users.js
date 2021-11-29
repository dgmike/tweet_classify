db.createUser({
  user: "tweets",
  pwd: "tweets",
  roles: [
    { role: "readWrite", db: "tweets" }
  ]
})

db.users.insert({
  name: 'Michael',
  username: 'michael',
  password: '{bcrypt}$2a$10$/aew4A1EZauFxRcIQZSkcOKZYUKoIBGdCORRaVw1UrMq7Gzv/qpHK'
})
