exports.welcome = (req, res) => {
    res.send({
        message: "Welcome to MITA APP API.",
        status: 200,
        content: {
            "User" : {
                "GET" : [
                    "GET /api/users/:id",
                    "GET /user/email/:email",
                ],
                "POST" : [
                    "POST /api/users/register",
                    "POST /api/users/login",
                    "POST /api/users/logout",
                ],
                "PUT" : [
                    "PUT /api/users/:id",
                ],
                "DELETE" : [
                    "DELETE /api/users/:id",
                ]
            }, 
            "Child" : {
                "GET" : [
                "GET /api/child/all",
                "GET /api/child/:id",
                ],
                "POST" : [
                "POST /api/child",
                ],
                "PUT" : [
                "PUT /api/child/:id",
                ],
                "DELETE" : [
                "DELETE /api/child/:id",
                ]
            },        
            "Question" : {
                "GET" : [
                    "GET /api/question/all",
                    "GET /api/question/:id",
                ],
                "POST" : [
                    "POST /api/question",
                ]
            },
            "Therapy" : {
                "GET" : [
                    "GET /api/therapy/all",
                    "GET /api/therapy/:id",
                ],
                "POST" : [
                    "POST /api/therapy",
                ]
            },
        },
    });
};