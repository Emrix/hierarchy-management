var data = `Node ID,Node Name,Parent ID,Hierarchy Name,Level Name
Marriott,Marriott,,Brand,Brand Family
Holiday Inn,Holiday Inn,,Brand,Brand Family
Hilton,Hilton,,Brand,Brand Family
Harriott Hotels & Resorts,Marriott Hotels & Resorts,Marriott,Brand,Property Brand
Fairfield,Fairfield,Marriott,Brand,Property Brand
Courtyard,Courtyard,Marriott,Brand,Property Brand
Holiday Inn Express,Holiday Inn Express,Holiday Inn,Brand,Property Brand
Holiday Inn Suites,Holiday Inn Suites,Holiday Inn,Brand,Property Brand
Hilton Gardens,Hilton Gardens,Hilton,Brand,Property Brand
Hampton,Hampton,Hilton,Brand,Property Brand
Embassy Suites,Embassy Suites,Hilton,Brand,Property Brand
Marriott Hotels & Resorts-IAH,Marriott Hotels & Resorts-IAH,Harriott Hotels & Resorts,Brand,Hotel Property
Fairfield-JFK,Fairfield-JFK,Fairfield,Brand,Hotel Property
Fairfield-Hou-Downtown,Fairfield-Hou-Downtown,Fairfield,Brand,Hotel Property
Courtyard-Manhatttan,Courtyard-Manhatttan,Courtyard,Brand,Hotel Property
Holiday Inn Express-LA Downtown,Holiday Inn Express-LA Downtown,Holiday Inn Express,Brand,Hotel Property
Holiday Inn Express-Marietta,Holiday Inn Express-Marietta,Holiday Inn Express,Brand,Hotel Property
Holiday Inn Suites-LAX,Holiday Inn Suites-LAX,Holiday Inn Suites,Brand,Hotel Property
Holiday Inn Suites-ATL,Holiday Inn Suites-ATL,Holiday Inn Suites,Brand,Hotel Property
Hilton Gardens-Sugar Land,Hilton Gardens-Sugar Land,Hilton Gardens,Brand,Hotel Property
Hampton Inn-LAX,Hampton Inn-LAX,Hampton,Brand,Hotel Property
Hampton Inn-San Jose,Hampton Inn-San Jose,Hampton,Brand,Hotel Property
Embassy Suites-SFO,Embassy Suites-SFO,Embassy Suites,Brand,Hotel Property
Embassy Suites-SF-Downtown,Embassy Suites-SF-Downtown,Embassy Suites,Brand,Hotel Property
West,West,,Region,Region Name
Southeast,Southeast,,Region,Region Name
Northeast,Northeast,,Region,Region Name
South Central,South Central,,Region,Region Name
California,California,West,Region,State
Georgia,Georgia,Southeast,Region,State
New York,New York,Northeast,Region,State
Texas,Texas,South Central,Region,State
Los Angeles,Los Angeles,California,Region,City
San Francisco,San Francisco,California,Region,City
Atlanta,Atlanta,Georgia,Region,City
New York City,New York City,New York,Region,City
Houston,Houston,Texas,Region,City
Holiday Inn Suites-LAX,Holiday Inn Suites-LAX,Los Angeles,Region,Hotel Property
Holiday Inn Express-LA Downtown,Holiday Inn Express-LA Downtown,Los Angeles,Region,Hotel Property
Hampton Inn-LAX,Hampton Inn-LAX,Los Angeles,Region,Hotel Property
Hampton Inn-San Jose,Hampton Inn-San Jose,San Francisco,Region,Hotel Property
Embassy Suites-SF-Downtown,Embassy Suites-SF-Downtown,San Francisco,Region,Hotel Property
Embassy Suites-SFO,Embassy Suites-SFO,San Francisco,Region,Hotel Property
Holiday Inn Suites-ATL,Holiday Inn Suites-ATL,Atlanta,Region,Hotel Property
Holiday Inn Express-Marietta,Holiday Inn Express-Marietta,Atlanta,Region,Hotel Property
Fairfield-JFK,Fairfield-JFK,New York City,Region,Hotel Property
Courtyard-Manhatttan,Courtyard-Manhatttan,New York City,Region,Hotel Property
Marriott Hotels & Resorts-IAH,Marriott Hotels & Resorts-IAH,Houston,Region,Hotel Property
Fairfield-Hou-Downtown,Fairfield-Hou-Downtown,Houston,Region,Hotel Property
Hilton Gardens-Sugar Land,Hilton Gardens-Sugar Land,Houston,Region,Hotel Property
Airport,Airport,,Area,Area Name
Suburbs,Suburbs,,Area,Area Name
Downtown,Downtown,,Area,Area Name
Marriott Hotels & Resorts-IAH,Marriott Hotels & Resorts-IAH,Airport,Area,Hotel Property
Fairfield-JFK,Fairfield-JFK,Airport,Area,Hotel Property
Holiday Inn Suites-LAX,Holiday Inn Suites-LAX,Airport,Area,Hotel Property
Holiday Inn Suites-ATL,Holiday Inn Suites-ATL,Airport,Area,Hotel Property
Hampton Inn-LAX,Hampton Inn-LAX,Airport,Area,Hotel Property
Embassy Suites-SFO,Embassy Suites-SFO,Airport,Area,Hotel Property
Holiday Inn Express-Marietta,Holiday Inn Express-Marietta,Suburbs,Area,Hotel Property
Hilton Gardens-Sugar Land,Hilton Gardens-Sugar Land,Suburbs,Area,Hotel Property
Fairfield-Hou-Downtown,Fairfield-Hou-Downtown,Downtown,Area,Hotel Property
Courtyard-Manhatttan,Courtyard-Manhatttan,Downtown,Area,Hotel Property
Holiday Inn Express-LA Downtown,Holiday Inn Express-LA Downtown,Downtown,Area,Hotel Property
Hampton Inn-San Jose,Hampton Inn-San Jose,Downtown,Area,Hotel Property
Embassy Suites-SF-Downtown,Embassy Suites-SF-Downtown,Downtown,Area,Hotel Property`

//var csv is the CSV file with headers
function csvJSON(csv) {
    var lines = csv.split("\n"); //Split the data into an array
    var result = []; //Set up the resulting file
    var headers = lines[0].split(","); //Get the header names
    for (var i = 1; i < lines.length; i++) { //Loop through each line appending the data along the way
        var obj = {};
        var currentline = lines[i].split(",");
        for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }
    //return result; //JavaScript object
    return JSON.stringify(result); //JSON
}

csvJSON(data);