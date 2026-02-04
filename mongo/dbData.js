db.employees.drop();
db.employees.insert([
    {
        "employeeId": "EC/#9549874308",
        "firstName": "Meredith",
        "lastName": "Vickers",
        "admin": true,
        // password is DavidSucks
        "password": "$2a$12$mcre1cmb6I8PJYXU38qd/.staFwyZuR/SPOROtMwxjkBFvvzw.cNi"
    },
    {
        "employeeId": "EC/#4861258765",
        "firstName": "Idris",
        "lastName": "Janek",
        "admin": false,
        // password is SteveStills
        "password": "$2a$12$suSiFUYSpmfel4h5YGvzgeUmj3lE0CtAP2n7bV1B1mwsIckQXYi62"
    }
]);

db.claims.drop();
db.claims.insert([
    {
        "Status": "open",
        "employee_id": "EC/#9549874308",
        "receipt": "489104590124890.png",
        "description": "Purchase of Weyland Yutani personal medical pod (experimental)",
        "category": {
            "name": "Medical",
            "faceHugger": false
        }
    },
    {
        "Status": "open",
        "employee_id": "EC/#4861258765",
        "receipt": "582918453217090.png",
        "description": "Visit to US headquarters",
        "category": {
            "name": "Travel",
            "locationStart": "Sea of Tranquility, Moon",
            "locationEnd": "San Francisco, California",
            "distanceKm": 363104
        }
    }
]);

db.categories.drop();
db.categories.insert([
    // categories are used as a reference to determine required fields when making a claim
    {
        "name": "Food",
        "allowChange": false,
        // This could also be hard coded to make things easier.
        "requirements": [
            { "requirement": "none" }
        ]
    },
    {
        "name": "Travel",
        "allowChange": false,
        "requirements": [
            { "requirement": "locationStart" },
            { "requirement": "locationEnd" },
            { "requirement": "distanceKm" },
        ]
    },
    {
        "name": "Lodging",
        "allowChange": false,
        "requirements": [
            { "requirement": "none" }
        ]
    },
    {
        "name": "Medical",
        "allowChange": false,
        "requirements": [
            { "requirement": "facehugger" }
        ]
    },
]);