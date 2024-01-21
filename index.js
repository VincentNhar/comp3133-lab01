const csv = require('csv-parser')
const fs = require('fs')

// Fetch data from the csv file
const streamDataFromCSV = (csvFile, callback) => {
    const dataStream = []
    fs.createReadStream(csvFile)
    .pipe(csv())
    .on('data', (row) => {
        dataStream.push(row)
    })
    .on('end', () => {
        console.log('CSV file successfully processed.')
        callback(null, dataStream); // pass the data to the callback
    })
    .on('error', (error) => {
        console.error('Error processing CSV file:',error); // pass the error to the callback
        callback(error,null);
    })
}

// Deletes existing file in current directory
const deleteFileIfExist = (fileName) => {
    if (fs.existsSync(fileName)) {
        fs.unlink(fileName , function (err){
            if (err){
                return console.log(err)
            }
        })
    }
}


// Filters the data with the mentioned country and write to a file
const filterAndWriteToFile = (data, country, fileName) => {
    const filteredData = data.filter(item => item.country === country);
    const header = 'country,year,population'
    const content = [header, ...filteredData.map(item => `${item.country},${item.year},${item.population}`)].join('\n');

    fs.writeFileSync(fileName, content);
}

const canadaFilePath = 'canada.txt';
const usaFilePath = 'usa.txt';

streamDataFromCSV('input_countries.csv', (error, dataStream) => {
    if (error) {
        console.error('Error:', error)
    } else {
        // delete existing file
        deleteFileIfExist(canadaFilePath);
        deleteFileIfExist(usaFilePath);

        // filter and write to file data for Canada
        filterAndWriteToFile(dataStream,'Canada', canadaFilePath)
        
        // filter and write to file data for USA
        filterAndWriteToFile(dataStream,'United States', usaFilePath)

        //console.log("Data has been filtered. 2 files has been created")
    }
})