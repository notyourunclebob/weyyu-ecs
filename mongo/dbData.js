db.employees.drop();
db.employees.insert([
    {
        "_id": "EC/#9549874308",
        "firstName": "Meredith",
        "lalsName": "Vickers",
        "admin": true,
        // password is DavidSucks
        "passWord": "$2a$12$mcre1cmb6I8PJYXU38qd/.staFwyZuR/SPOROtMwxjkBFvvzw.cNi"
    },
]);

db.claims.drop();
db.claims.insert([
    {
        "Status": "Open",
        "employee_id": "EC/#9549874308",
        "receipt": "489104590124890.png",
        "description": "Purchase of Weyland Yutani personal medical pod (experimental)",
        "category": {
            "name": "Medical",
            "faceHugger": false
        }
        

    },
]);

db.categories.drop();
db.categories.insert([
    {
        "name": "Food",
        "allowChange": false,
        "requirements": [
            {"requirement": "none", "dataType": "none"}
        ]
    },
    {
        "name": "Travel",
        "allowChange": false,
        "requirements": [
            {"requirement": "locationStart", "dataType": "string"},
            {"requirement": "locationEnd", "dataType": "string"},
            {"requirement": "distanceKm", "dataType": "number"},
        ]
    },
    {
        "name": "Food",
        "allowChange": false,
        "requirements": [
            {"requirement": "none"}
        ]
    },
    {
        "name": "Food",
        "allowChange": false,
        "requirements": [
            {"requirement": "none"}
        ]
    },
]);