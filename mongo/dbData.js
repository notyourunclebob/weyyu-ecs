db.employees.drop();
db.employees.insert([
    {
        "employeeId": "EC#9549874308",
        "firstName": "Meredith",
        "lastName": "Vickers",
        "admin": true,
        // password is DavidSucks
        "password": "$2a$12$mcre1cmb6I8PJYXU38qd/.staFwyZuR/SPOROtMwxjkBFvvzw.cNi"
    },
    {
        "employeeId": "EC#4861258765",
        "firstName": "Idris",
        "lastName": "Janek",
        "admin": false,
        // password is SteveStills
        "password": "$2a$12$suSiFUYSpmfel4h5YGvzgeUmj3lE0CtAP2n7bV1B1mwsIckQXYi62"
    },
    {
        "employeeId": "EC#3312847651",
        "firstName": "Ellen",
        "lastName": "Ripley",
        "admin": false,
        // password is Nostromo1
        "password": "$2a$12$KIXbSPRvgMvFBHFVQHbV5.3QmRmQiXhGNmQ5u7hLlY9qY4aGPFpWi"
    },
    {
        "employeeId": "EC#7823456190",
        "firstName": "Carter",
        "lastName": "Burke",
        "admin": false,
        // password is WeylandCorp1
        "password": "$2a$12$9X5aR2lK8PmNqT6vY3uJdOeHwZsBcFgMnVpQrLtXiAkUyDjEoISh."
    },
    {
        "employeeId": "EC#5541237809",
        "firstName": "Dwayne",
        "lastName": "Hicks",
        "admin": false,
        // password is PulseRifle88
        "password": "$2a$12$mR7tN4kL2PqXsV9wA5cBhOeGzYuFdJiKnMpQvLsRtWaXbCyDzEfGh"
    },
    {
        "employeeId": "EC#6698321470",
        "firstName": "Bishop",
        "lastName": "341-B",
        "admin": false,
        // password is Synthetic99
        "password": "$2a$12$pS8uO3jM6RnYtW2vB7dCiPfHaZxEqKlNmVpQsLuRtXbYcDzEfGhIj"
    },
    {
        "employeeId": "EC#2234789056",
        "firstName": "Amanda",
        "lastName": "Ripley",
        "admin": false,
        // password is Sevastopol7
        "password": "$2a$12$qT9vP4lN7SmZuX3wC8eDjQgIbYrFkKmOnWpRsTuVxAyBcDzEfGhIjK"
    },
    {
        "employeeId": "EC#8867345219",
        "firstName": "Peter",
        "lastName": "Weyland",
        "admin": true,
        // password is GodsAndKings
        "password": "$2a$12$rU0wQ5mO8TnAvY4xD9fEkRhJcZsGlLpNnXqStUvWyBzCdEfGhIjKlM"
    },
    {
        "employeeId": "EC#1198456732",
        "firstName": "Walter",
        "lastName": "Model-1",
        "admin": false,
        // password is Covenant22
        "password": "$2a$12$sV1xR6nP9UoBwZ5yE0gFlSiKdAtHmMqOoYrTuVwXzCaDeBfGhIjKlMn"
    },
    {
        "employeeId": "EC#4456123987",
        "firstName": "Newt",
        "lastName": "Jorden",
        "admin": false,
        // password is AreWeGoingHome
        "password": "$2a$12$tW2yS7oQ0VpCxA6zF1hGmTjLebuInNrPpZsTvUxYaDfEcGhIjKlMnOp"
    }
]);

db.claims.drop();
db.claims.insert([
    // EC#9549874308 - Meredith Vickers
    {
        "status": "pending",
        "employeeId": "EC#9549874308",
        "receipt": "489104590124890.png",
        "description": "Purchase of Weyland Yutani personal medical pod (experimental)",
        "amount": 40000.00,
        "date": new Date("2184-03-12"),
        "category": { "name": "Medical", "faceHugger": false }
    },
    {
        "status": "approved",
        "employeeId": "EC#9549874308",
        "receipt": "489104590124891.png",
        "description": "Executive dining at Weyland HQ",
        "amount": 4200.00,
        "comment": "Approved for board meeting",
        "date": new Date("2184-03-18"),
        "category": { "name": "Food" }
    },
    {
        "status": "approved",
        "employeeId": "EC#9549874308",
        "receipt": "489104590124892.png",
        "description": "Shuttle from Prometheus to LV-223 base camp",
        "amount": 8750.00,
        "comment": "Mission critical transport",
        "date": new Date("2184-04-01"),
        "category": { "name": "Travel", "locationStart": "USCSS Prometheus", "locationEnd": "LV-223 Surface", "distanceKm": 480 }
    },
    {
        "status": "pending",
        "employeeId": "EC#9549874308",
        "receipt": "489104590124893.png",
        "description": "Private quarters upgrade on Prometheus",
        "amount": 12500.00,
        "date": new Date("2184-04-10"),
        "category": { "name": "Lodging" }
    },
    {
        "status": "rejected",
        "employeeId": "EC#9549874308",
        "receipt": "489104590124894.png",
        "description": "Personal wine collection transport",
        "amount": 3100.00,
        "comment": "Not a business expense",
        "date": new Date("2184-04-15"),
        "category": { "name": "Food" }
    },

    // EC#4861258765 - Idris Janek
    {
        "status": "pending",
        "employeeId": "EC#4861258765",
        "receipt": "582918453217090.png",
        "description": "Visit to US headquarters",
        "amount": 15000.50,
        "date": new Date("2184-02-20"),
        "category": { "name": "Travel", "locationStart": "Sea of Tranquility, Moon", "locationEnd": "San Francisco, California", "distanceKm": 363104 }
    },
    {
        "status": "approved",
        "employeeId": "EC#4861258765",
        "receipt": "51456717090.png",
        "description": "Stomach medicine",
        "amount": 99.99,
        "comment": "Game over man",
        "date": new Date("2184-02-22"),
        "category": { "name": "Medical", "faceHugger": true }
    },
    {
        "status": "pending",
        "employeeId": "EC#4861258765",
        "receipt": "582918453217091.png",
        "description": "Hotel stay near Weyland SF office",
        "amount": 890.00,
        "date": new Date("2184-02-21"),
        "category": { "name": "Lodging" }
    },
    {
        "status": "approved",
        "employeeId": "EC#4861258765",
        "receipt": "582918453217092.png",
        "description": "Team dinner after mission debrief",
        "amount": 340.75,
        "comment": "Approved",
        "date": new Date("2184-03-05"),
        "category": { "name": "Food" }
    },
    {
        "status": "rejected",
        "employeeId": "EC#4861258765",
        "receipt": "582918453217093.png",
        "description": "Geology equipment cleaning after cave incident",
        "amount": 560.00,
        "comment": "Not covered under claims policy",
        "date": new Date("2184-03-08"),
        "category": { "name": "Medical", "faceHugger": false }
    },

    // EC#3312847651 - Ellen Ripley
    {
        "status": "approved",
        "employeeId": "EC#3312847651",
        "receipt": "331284765101.png",
        "description": "Emergency medical treatment, Gateway Station",
        "amount": 5200.00,
        "comment": "Covered under hazard clause",
        "date": new Date("2179-06-14"),
        "category": { "name": "Medical", "faceHugger": true }
    },
    {
        "status": "pending",
        "employeeId": "EC#3312847651",
        "receipt": "331284765102.png",
        "description": "Dropship fuel surcharge, LV-426",
        "amount": 22000.00,
        "date": new Date("2179-06-20"),
        "category": { "name": "Travel", "locationStart": "USS Sulaco", "locationEnd": "LV-426 Surface", "distanceKm": 920 }
    },
    {
        "status": "approved",
        "employeeId": "EC#3312847651",
        "receipt": "331284765103.png",
        "description": "Temporary quarters, Gateway Station",
        "amount": 1100.00,
        "comment": "Standard rate approved",
        "date": new Date("2179-05-30"),
        "category": { "name": "Lodging" }
    },
    {
        "status": "pending",
        "employeeId": "EC#3312847651",
        "receipt": "331284765104.png",
        "description": "Rations and supplies for LV-426 mission",
        "amount": 475.50,
        "date": new Date("2179-06-18"),
        "category": { "name": "Food" }
    },
    {
        "status": "rejected",
        "employeeId": "EC#3312847651",
        "receipt": "331284765105.png",
        "description": "Cat carrier and pet supplies (Jones)",
        "amount": 89.99,
        "comment": "Personal expense",
        "date": new Date("2179-06-25"),
        "category": { "name": "Food" }
    },

    // EC#7823456190 - Carter Burke
    {
        "status": "approved",
        "employeeId": "EC#7823456190",
        "receipt": "782345619001.png",
        "description": "Flight to Gateway Station for debriefing",
        "amount": 3400.00,
        "comment": "Business travel approved",
        "date": new Date("2179-05-10"),
        "category": { "name": "Travel", "locationStart": "San Francisco, Earth", "locationEnd": "Gateway Station, Orbit", "distanceKm": 400 }
    },
    {
        "status": "pending",
        "employeeId": "EC#7823456190",
        "receipt": "782345619002.png",
        "description": "Biohazard containment consultation fees",
        "amount": 18500.00,
        "date": new Date("2179-05-15"),
        "category": { "name": "Medical", "faceHugger": false }
    },
    {
        "status": "pending",
        "employeeId": "EC#7823456190",
        "receipt": "782345619003.png",
        "description": "Hotel suite, Weyland corporate tower",
        "amount": 2200.00,
        "date": new Date("2179-05-12"),
        "category": { "name": "Lodging" }
    },
    {
        "status": "approved",
        "employeeId": "EC#7823456190",
        "receipt": "782345619004.png",
        "description": "Client lunch with ICC representatives",
        "amount": 620.00,
        "comment": "Approved",
        "date": new Date("2179-05-13"),
        "category": { "name": "Food" }
    },
    {
        "status": "rejected",
        "employeeId": "EC#7823456190",
        "receipt": "782345619005.png",
        "description": "Speeding fine on Luna highway",
        "amount": 200.00,
        "comment": "Not reimbursable",
        "date": new Date("2179-05-11"),
        "category": { "name": "Travel", "locationStart": "Tycho City", "locationEnd": "Armstrong Base", "distanceKm": 210 }
    },

    // EC#5541237809 - Dwayne Hicks
    {
        "status": "approved",
        "employeeId": "EC#5541237809",
        "receipt": "554123780901.png",
        "description": "Field medical kit resupply",
        "amount": 780.00,
        "comment": "Standard kit approved",
        "date": new Date("2179-06-19"),
        "category": { "name": "Medical", "faceHugger": false }
    },
    {
        "status": "pending",
        "employeeId": "EC#5541237809",
        "receipt": "554123780902.png",
        "description": "APC transport fuel, LV-426",
        "amount": 4300.00,
        "date": new Date("2179-06-20"),
        "category": { "name": "Travel", "locationStart": "USS Sulaco Hangar", "locationEnd": "Hadley's Hope", "distanceKm": 85 }
    },
    {
        "status": "approved",
        "employeeId": "EC#5541237809",
        "receipt": "554123780903.png",
        "description": "Emergency rations, Hadley's Hope",
        "amount": 210.00,
        "comment": "Hazard mission approved",
        "date": new Date("2179-06-21"),
        "category": { "name": "Food" }
    },
    {
        "status": "pending",
        "employeeId": "EC#5541237809",
        "receipt": "554123780904.png",
        "description": "Bunk accommodation, USS Sulaco",
        "amount": 0.00,
        "date": new Date("2179-06-15"),
        "category": { "name": "Lodging" }
    },
    {
        "status": "rejected",
        "employeeId": "EC#5541237809",
        "receipt": "554123780905.png",
        "description": "Personal firearms cleaning kit",
        "amount": 145.00,
        "comment": "Equipment maintenance covered separately",
        "date": new Date("2179-06-22"),
        "category": { "name": "Medical", "faceHugger": false }
    },

    // EC#6698321470 - Bishop 341-B
    {
        "status": "approved",
        "employeeId": "EC#6698321470",
        "receipt": "669832147001.png",
        "description": "Synthetic fluid replacement post-incident",
        "amount": 3100.00,
        "comment": "Covered under synthetic maintenance policy",
        "date": new Date("2179-06-25"),
        "category": { "name": "Medical", "faceHugger": false }
    },
    {
        "status": "pending",
        "employeeId": "EC#6698321470",
        "receipt": "669832147002.png",
        "description": "Dropship piloting surcharge, LV-426 extraction",
        "amount": 9800.00,
        "date": new Date("2179-06-24"),
        "category": { "name": "Travel", "locationStart": "LV-426 Surface", "locationEnd": "USS Sulaco", "distanceKm": 920 }
    },
    {
        "status": "approved",
        "employeeId": "EC#6698321470",
        "receipt": "669832147003.png",
        "description": "Nutrient supplements (synthetic compatible)",
        "amount": 55.00,
        "comment": "Approved",
        "date": new Date("2179-06-16"),
        "category": { "name": "Food" }
    },
    {
        "status": "pending",
        "employeeId": "EC#6698321470",
        "receipt": "669832147004.png",
        "description": "Stasis pod calibration, USS Sulaco",
        "amount": 1400.00,
        "date": new Date("2179-06-10"),
        "category": { "name": "Lodging" }
    },
    {
        "status": "rejected",
        "employeeId": "EC#6698321470",
        "receipt": "669832147005.png",
        "description": "Advanced chess set",
        "amount": 320.00,
        "comment": "Personal purchase",
        "date": new Date("2179-06-12"),
        "category": { "name": "Food" }
    },

    // EC#2234789056 - Amanda Ripley
    {
        "status": "pending",
        "employeeId": "EC#2234789056",
        "receipt": "223478905601.png",
        "description": "Emergency medication, Sevastopol Station",
        "amount": 670.00,
        "date": new Date("2137-11-05"),
        "category": { "name": "Medical", "faceHugger": false }
    },
    {
        "status": "approved",
        "employeeId": "EC#2234789056",
        "receipt": "223478905602.png",
        "description": "Transit to Sevastopol Station",
        "amount": 11200.00,
        "comment": "Approved for retrieval mission",
        "date": new Date("2137-10-25"),
        "category": { "name": "Travel", "locationStart": "Io Station", "locationEnd": "Sevastopol Station", "distanceKm": 628000 }
    },
    {
        "status": "approved",
        "employeeId": "EC#2234789056",
        "receipt": "223478905603.png",
        "description": "Temporary crew lodging, Torrens",
        "amount": 500.00,
        "comment": "Standard rate",
        "date": new Date("2137-10-26"),
        "category": { "name": "Lodging" }
    },
    {
        "status": "pending",
        "employeeId": "EC#2234789056",
        "receipt": "223478905604.png",
        "description": "Emergency food rations, Sevastopol",
        "amount": 130.00,
        "date": new Date("2137-11-06"),
        "category": { "name": "Food" }
    },
    {
        "status": "rejected",
        "employeeId": "EC#2234789056",
        "receipt": "223478905605.png",
        "description": "Hazard suit repair (personal damage)",
        "amount": 2400.00,
        "comment": "Claim outside mission scope",
        "date": new Date("2137-11-10"),
        "category": { "name": "Medical", "faceHugger": false }
    },

    // EC#8867345219 - Peter Weyland
    {
        "status": "approved",
        "employeeId": "EC#8867345219",
        "receipt": "886734521901.png",
        "description": "Cryo suite upgrade, USCSS Prometheus",
        "amount": 95000.00,
        "comment": "Executive approved",
        "date": new Date("2093-10-11"),
        "category": { "name": "Lodging" }
    },
    {
        "status": "approved",
        "employeeId": "EC#8867345219",
        "receipt": "886734521902.png",
        "description": "Private medical team for LV-223 expedition",
        "amount": 250000.00,
        "comment": "Authorised at board level",
        "date": new Date("2093-10-12"),
        "category": { "name": "Medical", "faceHugger": false }
    },
    {
        "status": "pending",
        "employeeId": "EC#8867345219",
        "receipt": "886734521903.png",
        "description": "Gourmet catering, Prometheus executive deck",
        "amount": 18000.00,
        "date": new Date("2093-10-14"),
        "category": { "name": "Food" }
    },
    {
        "status": "pending",
        "employeeId": "EC#8867345219",
        "receipt": "886734521904.png",
        "description": "Chartered transport to LV-223 dig site",
        "amount": 37000.00,
        "date": new Date("2093-12-20"),
        "category": { "name": "Travel", "locationStart": "USCSS Prometheus", "locationEnd": "LV-223 Engineer Site", "distanceKm": 1200 }
    },
    {
        "status": "rejected",
        "employeeId": "EC#8867345219",
        "receipt": "886734521905.png",
        "description": "Holographic portrait commission",
        "amount": 45000.00,
        "comment": "Not a business expense",
        "date": new Date("2093-10-15"),
        "category": { "name": "Food" }
    },

    // EC#1198456732 - Walter Model-1
    {
        "status": "approved",
        "employeeId": "EC#1198456732",
        "receipt": "119845673201.png",
        "description": "Synthetic maintenance and recalibration",
        "amount": 4800.00,
        "comment": "Routine maintenance approved",
        "date": new Date("2104-05-17"),
        "category": { "name": "Medical", "faceHugger": false }
    },
    {
        "status": "pending",
        "employeeId": "EC#1198456732",
        "receipt": "119845673202.png",
        "description": "Lander transport to Origae-6 surface",
        "amount": 6600.00,
        "date": new Date("2104-12-05"),
        "category": { "name": "Travel", "locationStart": "USCSS Covenant", "locationEnd": "Origae-6 Surface", "distanceKm": 2100 }
    },
    {
        "status": "approved",
        "employeeId": "EC#1198456732",
        "receipt": "119845673203.png",
        "description": "Crew nutrition supplies, Covenant",
        "amount": 890.00,
        "comment": "Approved",
        "date": new Date("2104-05-20"),
        "category": { "name": "Food" }
    },
    {
        "status": "pending",
        "employeeId": "EC#1198456732",
        "receipt": "119845673204.png",
        "description": "Crew stasis pod servicing",
        "amount": 3200.00,
        "date": new Date("2104-05-18"),
        "category": { "name": "Lodging" }
    },
    {
        "status": "rejected",
        "employeeId": "EC#1198456732",
        "receipt": "119845673205.png",
        "description": "Flute and music sheet procurement",
        "amount": 410.00,
        "comment": "Personal item",
        "date": new Date("2104-05-22"),
        "category": { "name": "Food" }
    },

    // EC#4456123987 - Newt Jorden
    {
        "status": "pending",
        "employeeId": "EC#4456123987",
        "receipt": "445612398701.png",
        "description": "Psychological evaluation and counselling",
        "amount": 1800.00,
        "date": new Date("2179-07-01"),
        "category": { "name": "Medical", "faceHugger": true }
    },
    {
        "status": "approved",
        "employeeId": "EC#4456123987",
        "receipt": "445612398702.png",
        "description": "Transport from Gateway to Weyland care facility",
        "amount": 2200.00,
        "comment": "Approved under child welfare policy",
        "date": new Date("2179-07-02"),
        "category": { "name": "Travel", "locationStart": "Gateway Station", "locationEnd": "Weyland Care Facility, Earth", "distanceKm": 400 }
    },
    {
        "status": "approved",
        "employeeId": "EC#4456123987",
        "receipt": "445612398703.png",
        "description": "Temporary lodging, Gateway medical wing",
        "amount": 950.00,
        "comment": "Approved",
        "date": new Date("2179-06-28"),
        "category": { "name": "Lodging" }
    },
    {
        "status": "pending",
        "employeeId": "EC#4456123987",
        "receipt": "445612398704.png",
        "description": "Nutritional meal plan, Gateway Station",
        "amount": 320.00,
        "date": new Date("2179-06-29"),
        "category": { "name": "Food" }
    },
    {
        "status": "rejected",
        "employeeId": "EC#4456123987",
        "receipt": "445612398705.png",
        "description": "Replacement doll (Casey)",
        "amount": 35.00,
        "comment": "Personal item",
        "date": new Date("2179-07-03"),
        "category": { "name": "Food" }
    }
]);

db.categories.drop();
db.categories.insert([
    {
        "name": "Food",
        "allowChange": false,
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