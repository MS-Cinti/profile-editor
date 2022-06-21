const express = require('express')
const path = require("path");
const fs = require('fs')
const app = express()
const fileUpload = require("express-fileupload");
const bodyParser = require('body-parser')


const dataLocation = path.join(`${__dirname}/../frontend/data/`);
const uploads = path.join(`${__dirname}/../frontend/upload/`);


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use("/upload", express.static(`${__dirname}/../frontend/upload`));
app.use(fileUpload());
//app.use(express.json())
app.use("/data", express.static(`${__dirname}/../frontend/data`))


//read the user data from json file
const saveUserData = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync(dataLocation + 'users.json', stringifyData)
}
//get the user data from json file
const getUserData = () => {
    console.log(__dirname)
    const jsonData = fs.readFileSync(dataLocation + 'users.json')
    return JSON.parse(jsonData)
}


//GET methods
app.get('/', (req, res) => {
	res.sendFile( path.join(`${__dirname}/../frontend/index.html`) )
})

app.get('/user/list', (req, res) => {
    const users = getUserData()
    res.send(users)
})


let jsonData = [];
try {
    let data = fs.readFileSync(`${dataLocation}data.json`, error => {
        if (error) {
            console.log(error);
        }
    });
    jsonData = JSON.parse(data);
} catch (error) {
    fs.writeFile(`${dataLocation}data.json`, JSON.stringify(jsonData), (error) => {
        if (error) {
            console.log(error);
        }
    });
}


//POST methods
app.post('/user/add', (req, res) => {
    //get the existing user data
    const existUsers = getUserData()

    //get the new user data from post request
    const userData = req.body

    //check if the userData fields are missing
    if (userData.firstName == null || userData.surName == null || userData.zipCode == null || userData.houseNumber == null) {
        return res.status(401).send({error: true, msg: 'User data missing'})
    }
    
    //check if the username exist already
    const findExist = existUsers.find( user => user.id === userData.id )

    if (findExist) {
        return res.status(409).send({error: true, msg: 'username already exist'})
    }
    //append the user data
    existUsers.push(userData)

    //save the new user data
    saveUserData(existUsers);
    res.send({success: true, msg: 'User data added successfully'})
})

app.post("/user/imageUpload", (req, res) => {
    //upload image
    const picture = req.files.picture;
    const answer = {};
    if (picture) {
        picture.mv(uploads + picture.name, error => {
            return res.status(500).send(error);
        });
    }
    answer.pictureName  = picture.name;

    //network/response nál látszik ez
    res.send(answer)

    //upload data from form
    const imageData = [req.body];
    imageData.image_name = picture.name;
    imageData.push(imageData);

    fs.writeFile(`${dataLocation}data.json`, JSON.stringify(jsonData), (error) => {
        if (error) {
            console.log(error);
        }
    });
});


//update- Patch method
app.patch('/user/update/:username', (req, res) => {
    //get the username from url
    const username = req.params.username
    //get the update data
    const userData = req.body
    //get the existing user data
    const existUsers = getUserData()
    //check if the username exist or not       
    const findExist = existUsers.find( user => user.username === username )
    if (!findExist) {
        return res.status(409).send({error: true, msg: 'username not exist'})
    }
    //filter the userdata
    const updateUser = existUsers.filter( user => user.username !== username )
    //push the updated data
    updateUser.push(userData)
    //finally save it
    saveUserData(updateUser)
    res.send({success: true, msg: 'User data updated successfully'})
})


//Delete methods
app.delete('/user/delete/:id', (req, res) => {
    const id = req.params.id
    //get the existing userdata
    const existUsers = getUserData()
    //filter the userdata to remove it
    const filterUser = existUsers.filter( user => user.id !== id )
    if ( existUsers.length === filterUser.length ) {
        return res.status(409).send({error: true, msg: 'username does not exist'})
    }
    //save the filtered data
    saveUserData(filterUser)
    res.send({success: true, msg: 'User removed successfully'})
})

app.delete('/user/deleteImage/', (req, res) => {
    const image = req.body.image;
    console.log(image)
    const cuttedImage = image.slice(12)
    console.log(cuttedImage)

    fs.unlink(uploads+cuttedImage, function (err) {
        if (err) throw err;
        // if no error, file has been deleted successfully
        console.log('File deleted!');
    })
})


app.use("/public", express.static(`${__dirname}/../frontend/public`))


//configure the server port
app.listen(3000, () => {
    console.log('http://127.0.0.1:3000')
})