db.employees.drop();
db.employees.insert([
    {
        "f_name": "Meredith",
        "l_name": "Vickers",
        "admin": true,

    },
]);

db.claims.drop();
db.claims.insert({

});

db.categories.drop();
db.categories.insert([
    {
        "category": "Food"
    },
    {
        "category": "Travel"
    },
    {
        "category": "Lodging"
    },
    {
        "category": "Medical"
    },
]);