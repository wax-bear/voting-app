process.env.NODE_ENV = 'test';

const request = require('supertest'),
    chai = require('chai'),
    should = chai.should(),
    server = require('../src/app'),
    User = require('../src/db/models'),
    queries = require('../src/db/queries')

describe('routes : users', () => {
    beforeEach((done) => {
        User.remove({}, (err) => {
            done();
        });
    });

// ## URI endpoints

// | Endpoint          | HTTP Method | CRUD Method |          Result |
// | ----------------- | :---------: | ----------: | --------------: |
// | /users/create   |    POST     |      CREATE | create a user |
// | /users/ping       |     GET     |        READ |            pong |
// | /users/user/:id   |     GET     |        READ |   get user info |
// | /users/update/:id |     PUT     |      UPDATE |     edit a user |
// | /users/delete/:id |   DELETE    |      DELETE |   delete a user |


    // | Endpoint          | HTTP Method | CRUD Method |          Result |
    // | ----------------- | :---------: | ----------: | --------------: |
    // | /users/create   |    POST     |      CREATE | create a user |

    describe('POST /users/create', () => {
        it('it should create a user and GET users/user/:id', (done) => {
            request(server)
                .post('/users/create')
                .field('name', 'Bas')
                .field('email', 'bkdelaat@gmail.com')
                .field('password', '<passport-generated-password>')
                .expect((req) => {
                    // console.log(req.body)
                    console.log(req.header)
                    // console.log(req)
                })
                .expect('Location', '/users.user/*')
                .expect(queries.readUser('bkdelaat@gmail.com'))
                .end((err, res) => {
                    err ? console.log(err) :
                        done();
                });
        });

        it('it should not create a user with an already created e-mail', (done) => {
            queries.createUser({ name: "bas", email: "bkdelaat@gmail.com", password: "12345" }, (err, user) => {
                request(server)
                    .post('/user/create')
                    .field(user.name)
                    .field(user.email)
                    .field(user.password)
                    .expect('Content-Type', /html/)
                    .expect(200)
                    .expect('Location', '/users/create')
                    .end((err, res) => {
                        err ? console.log(err) :
                            done();
                    });
            })
        });

        it('it should not create a user when there is no e-mail', (done) => {
            request(server)
                .post('/users/create')
                .field('name', 'Bas')
                .field('password', '<passport-generated-password>')
                .expect(200)
                .expect('Location', '/users/create')
                .end((err, res) => {
                    err ? console.log(err) :
                        done();
                });
        });
        it('it should not create a user when there is no password', (done) => {
            request(server)
                .post('/users/create')
                .field('name', 'Bas')
                .field('email', 'bkdelaat@gmail.com')
                .expect(200)
                .expect('Location', '/users/create')
                .end((err, res) => {
                    err ? console.log(err) :
                        done();
                });
        });
    });

    // | Endpoint          | HTTP Method | CRUD Method |          Result |
    // | ----------------- | :---------: | ----------: | --------------: |
    // | /users/user/:id   |     GET     |        READ |   get user info |

    describe('GET /users/user/:id', () => {
        it('it should GET a users/user/bas', (done) => {
            queries.createUser({ name: "bas", email: "bkdelaat@gmail.com", password: "12345" }, (err, user) => {
                request(server)
                    .get('/users/user/' + user.id)
                    .expect('Content-Type', /html/)
                    .expect(200)
                    .end((err, res) => {
                        err ? console.log(err) :
                            done();
                    });
            });
        });
    });

    // | Endpoint          | HTTP Method | CRUD Method |          Result |
    // | ----------------- | :---------: | ----------: | --------------: |
    // | /users/ping       |     GET     |        READ |            pong |

    describe('/GET /users/ping', () => {
        it('it should GET "pong"', (done) => {
            request(server)
                .get('/users/ping')
                .expect('Content-Type', /html/)
                .expect('Content-Length', '4')
                .expect(200)
                .end(function(err, res) {
                    err ? console.log(err) :
                        done();
                });
        });
    });

    // | Endpoint          | HTTP Method | CRUD Method |          Result |
    // | ----------------- | :---------: | ----------: | --------------: |
    // | /users/update/:id |     PUT     |      UPDATE |     edit a user |

    describe('PUT /users/update/:id', () => {
        it('it should PUT users/user/bas', (done) => {
            queries.createUser({ name: "bas", email: "bkdelaat@gmail.com", password: "12345" }, (err, user) => {
                queries.updateUser({ name: "bas", email: "bkdelaat@hotmail.com", password: "12345" }, (err, user) => {
                    request(server)
                        .expect('Content-Type', /html/)
                        .expect(200)
                        .expect('Location', '/users/user/' + user.id)
                        .end((err, res) => {
                            err ? console.log(err) :
                                done();
                        });
                })
            })
        })
    })


    // | Endpoint          | HTTP Method | CRUD Method |          Result |
    // | ----------------- | :---------: | ----------: | --------------: |
    // | /users/delete/:id |   DELETE    |      DELETE |   delete a user |

    describe('DELETE /users/delete/:id', () => {
        it('it should DELETE user bas', (done) => {
            queries.createUser({ name: "bas", email: "bkdelaat@gmail.com", password: "12345" }, (err, user) => {
                queries.deleteUser({ email: "bkdelaat@hotmail.com" }, (err, user) => {
                    request(server)
                        .expect('Content-Type', /html/)
                        .expect(200)
                        .expect('Location', '/')
                        .end((err, res) => {
                            err ? console.log(err) :
                                done();
                        });
                })
            })
        })
    });

});