var str;
var imageIndex;

function init() {

    var searchTerms = ["Youghal", "Cork", "Henry Pether", "Oak"];

    if(localStorage.getItem("local-data") !== null) {
        getData(localStorage.getItem("local-data"));
    } else {
        getData();
        console.log("localStorage is not working!");
    }

    for (var i = 0; i < searchTerms.length; i++) {
        var newB = document.createElement("button");
        var bText = document.createTextNode(searchTerms[i]);
        newB.appendChild(bText);
        document.getElementById("header").appendChild(newB);
        newB.onclick = (function(nr) {
            return function() {
                getData(searchTerms[nr]);
            };
        })(i);
    }
}

function getData(element) {
    send_JSONP_Request("https://www.flickr.com/services/rest/?method=flickr.photos.search&per_page=100&api_key=a805174f56d23d939a425204dad80deb&tags=" + element + "&format=json&tag_mode=all&jsoncallback=getImage");

    str = document.getElementById("container");

    var message = document.createElement("div");
    message.className = "msg";
    str.appendChild(message);

    localStorage.setItem("local-data", element);
}

function getImage(images) {
    str = document.getElementById("container");
    while(str.hasChildNodes()) {
        str.removeChild(str.lastChild);
    }

    for (var i = 0; i < images.photos.photo.length; i++) {
        var urlSmall = "http://farm" + images.photos.photo[i].farm + ".static.flickr.com/" + images.photos.photo[i].server + "/" + images.photos.photo[i].id + "_" + images.photos.photo[i].secret + "_s.jpg";
        var urlBig = "http://farm" + images.photos.photo[i].farm + ".static.flickr.com/" + images.photos.photo[i].server + "/" + images.photos.photo[i].id + "_" + images.photos.photo[i].secret + "_z.jpg";

        imageIndex = i;

        var image = document.createElement("img");
        image.id = imageIndex;

        image.className = "image-box thumbnail";
        image.src = urlSmall;
        image.dataset.bigurl = urlBig;

        document.getElementById("container").appendChild(image);
        var string = "showModal('" + imageIndex + "');";

        var newImage = document.getElementById(imageIndex);
        newImage.setAttribute("onclick", string);
    }
}

function showModal(elementId) {
    var choosenImage = document.getElementById(elementId);

    var modal = document.createElement("div");
    modal.setAttribute("id", "modal");
    modal.setAttribute("class", "modal");

    var modalContent = document.createElement("div");
    modalContent.setAttribute("class", "modal-content");

    var modalImage = document.createElement("img");
    modalImage.setAttribute("id", "modal-image");
    modalImage.src = choosenImage.dataset.bigurl;

    var modalX = document.createElement("button");
    modalX.setAttribute("class", "close");
    modalX.setAttribute("id", "closebutton");
    modalX.textContent = "X";
    modalX.onclick = function () {
        document.body.removeChild(document.body.lastChild);
        imageIndex = null;
    };

    var modalNavLeft = document.createElement("div");
    modalNavLeft.setAttribute("class", "modalNavLeft");
    modalNavLeft.innerText = "<";
    modalNavLeft.onclick = function() {
        left(elementId);
    };

    var modalNavRight = document.createElement("div");
    modalNavRight.setAttribute("class", "modalNavRight");
    modalNavRight.innerText = ">";
    modalNavRight.onclick = function() {
        right(elementId);
    };

    modal.appendChild(modalNavLeft);
    modal.appendChild(modalNavRight);

    modal.appendChild(modalContent);
    modalContent.appendChild(modalX);
    modalContent.appendChild(modalImage);

    modal.style.display = "block";
    document.body.appendChild(modal);

    function left(element) {
        var image = document.getElementById("modal-image");
        image.remove();

        var img = document.createElement("img");
        img.setAttribute("id", "modal-image");

        var previousId = parseInt(element);
        previousId = parseInt(previousId) - 1;
        imageIndex = previousId;
        var previousImage = document.getElementById(previousId);

        img.src = previousImage.dataset.bigurl;
        modalContent.appendChild(img);
    }

    function right(element) {
        var image = document.getElementById("modal-image");
        image.remove();

        var img = document.createElement("img");
        img.setAttribute("id", "modal-image");

        var previousId = parseInt(element);
        previousId = parseInt(previousId) + 1;
        imageIndex = previousId;
        var previousImage = document.getElementById(previousId);

        img.src = previousImage.dataset.bigurl;
        modalContent.appendChild(img);
    }

    function keyboard(e)
    {
        if (e.which == 37) {
            left(imageIndex);
        }
        else if (e.which == 39) {
            right(imageIndex);
        }
        else {
            console.log('Press any key');
        }
    }
    window.addEventListener("keyup", keyboard);
}

function send_JSONP_Request(request) {
    var newScript = document.createElement('script');
    newScript.setAttribute('src', request);
    document.getElementsByTagName('head')[0].appendChild(newScript);
}

window.onload = function() {
    init();
};