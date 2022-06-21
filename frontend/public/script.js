const htmlBody = `
    <section class="img-container">
        <img class="img" src="./public/coffee.jpg" alt="coffee">
    </section>
    <section class="flex-container">
        <h1>Register</h1>
        <div class="image-preview" id="image-preview">
            <img src="" alt="Image Preview" class="image-preview__image">
            <span id="img-prev-dt" class="image-preview__default-text">Image Preview</span>
        </div>
        <form id="form">
            <input type="file" id="imageChooser" name="picture">
            <input type="text" id="fname" name="fname" placeholder="First name">
            <input type="text" id="sname" name="sname" placeholder="Surname"><br>
            <input type="number" id="zip" name="zip" placeholder="Zip code">
            <input type="text" id="cou" name="cou" placeholder="Country">
            <input type="text" id="cit" name="city" placeholder="City">
            <input type="text" id="str" name="str" placeholder="Street">
            <input type="number" id="hnu" name="hnum" placeholder="House number"><br>
            <textarea name="intr" id="intr" wrap="hard" placeholder="Introduction..."></textarea><br>
            <button class="saveButton" onclick="saveData()">save</button>
            </form><br>
        <button class="deleteButton" onclick="deleteData()">delete</button>
    </section>
`;

const loadEvent = () => {

    console.log("the page is loaded")

    let rootElement = document.getElementById("root");

    rootElement.insertAdjacentHTML("beforeend", htmlBody);

    imageUpload()

    const formElement = document.getElementById("form");

    formElement.addEventListener("submit", e => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("picture", e.target.querySelector(`input[name="picture"]`).files[0]);

        const fetchSettings = {
            method: 'POST',
            body: formData
        };

        fetch("http://127.0.0.1:3000/user/imageUpload", fetchSettings)
        .then(async data => {
            if (data.status === 200){
                const res = await data.json()
                console.dir(data)
            }
        })
        .catch(error => {
            e.target.outerHTML = `Error`;
            console.dir(error);
        })
    }) 
}

window.addEventListener("load", loadEvent);

const getFirstName = () => {

    const firstNameTag = document.getElementById("fname")
    const firstName = firstNameTag.value
    return firstName
}

const getSurName = () => {

    const surNameTag = document.getElementById("sname")
    const surName = surNameTag.value
    return surName
}

const getZipCode = () => {

    const zipCodeTag = document.getElementById("zip")
    const zipCode = zipCodeTag.value
    return zipCode
}

const getCountry = () => {

    const countryTag = document.getElementById("cou")
    const country = countryTag.value
    return country
}

const getCity = () => {

    const cityTag = document.getElementById("cit")
    const city = cityTag.value
    return city
}

const getStreet = () => {

    const streetTag = document.getElementById("str")
    const street = streetTag.value
    return street
}

const getHouseNumber = () => {

    const houseNumberTag = document.getElementById("hnu")
    const houseNumber = houseNumberTag.value
    return houseNumber
}

const getIntro = () => {

    const introTag = document.getElementById("intr")
    const intro = introTag.value
    return intro
}

const imageUpload = () => {
    
    const imageTag = document.getElementById("imageChooser")
    const image = imageTag.value
    const previewContainer = document.getElementById("image-preview")
    const previewImage = previewContainer.querySelector(".image-preview__image")
    const previewDefaultText = previewContainer.querySelector(".image-preview__default-text")

    imageTag.addEventListener("change", function() {
        const file = this.files[0]

        if (file){
            const reader = new FileReader()

            previewDefaultText.style.display = "none"
            previewImage.style.display = "block"

            reader.addEventListener("load", function() {
                //console.log(this)
                previewImage.setAttribute("src", this.result)
            })

            reader.readAsDataURL(file)

        }else{
            previewDefaultText.style.display = null
            previewImage.style.display = null
            previewImage.setAttribute("src", "")
        }
    })
   
    return image;
}

const saveData = () => {
    const imageTag = document.getElementById("imageChooser");
    const dataOfUser = {
        firstName: getFirstName(),
        surName: getSurName(),
        zipCode: getZipCode(),
        country: getCountry(),
        city: getCity(),
        street: getStreet(),
        houseNumber: getHouseNumber(),
        intro: getIntro(),
        image: imageTag.value,
        id: getFirstName() + getSurName() + getZipCode() + getCountry() + getCity() + getStreet() + getHouseNumber()
    }

    fetch ("http://127.0.0.1:3000/user/add",{
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataOfUser)
    })
    .then(response => {
        console.log(response.statusText)
    })

}

const deleteData = () => {
    const imageTag = document.getElementById("imageChooser");
    const previewContainer = document.getElementById("image-preview")

    const dataOfUser = {
        firstName: getFirstName(),
        surName: getSurName(),
        zipCode: getZipCode(),
        country: getCountry(),
        city: getCity(),
        street: getStreet(),
        houseNumber: getHouseNumber(),
        intro: getIntro(),
        image: imageTag.value,
        id: getFirstName() + getSurName() + getZipCode() + getCountry() + getCity() + getStreet() + getHouseNumber()
    }

    fetch ("http://127.0.0.1:3000/user/delete/" + dataOfUser.id,{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataOfUser)
    })
    .then(response => {
        console.log(response.statusText)
    })

    fetch ("http://127.0.0.1:3000/user/deleteImage/", {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataOfUser)
    })
    .then(response => {
        console.log(response.statusText)
    })

    document.getElementById('fname').value = ''
    document.getElementById('sname').value = ''
    document.getElementById('zip').value = ''
    document.getElementById('cou').value = ''
    document.getElementById('cit').value = ''
    document.getElementById('str').value = ''
    document.getElementById('hnu').value = ''
    document.getElementById('intr').value = ''
    document.querySelector('.image-preview__image').remove();

    const input = document.querySelector('input')
    input.value = "";
}