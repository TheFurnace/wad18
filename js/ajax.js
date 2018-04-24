(function(){



    function uploadPreview(file, idInt) {
        var uploadConfirm = document.getElementById("uploadConfirm");
        var imageType = /image.*/;

        if (!file.type.match(imageType)) {
            throw "File Type must be an image";
        }

        var uploadConfirmItem = document.createElement("div");
        uploadConfirmItem.id = "item-" + idInt;
        uploadConfirmItem.classList.add('uploadConfirmItem');

        var imagePreview = document.createElement("img");
        imagePreview.classList.add('imagePreview');
        imagePreview.file = file;

        var descriptionForm = document.createElement("form");
        descriptionForm.id = "form-" + idInt;
        descriptionForm.classList.add('descriptionForm');
        descriptionForm.classList.add('right-float');

        var descriptionFormText = document.createElement("p");
        descriptionFormText.innerHTML = "Description: ";

        var descriptionFormInput = document.createElement("input");
        descriptionFormInput.id = "textInput-" + idInt;
        descriptionFormInput.setAttribute("type", "text");
        descriptionFormInput.setAttribute("name", "imageDescription");


        var removeButton = document.createElement("button");
        removeButton.id = "removeButton-" + idInt;
        removeButton.setAttribute("type", "button");
        removeButton.innerHTML = "remove";

        removeButton.addEventListener('click', function () {
            var selector = "#item-" + idInt;
            var parentItem = document.querySelector(selector);
            parentItem.remove();

            var uploadConfirm = document.querySelector('#uploadConfirm');
            if (uploadConfirm.children.length <= 1) {
                uploadConfirm.remove();
            }
        } );

        var uploadButton = document.createElement("button");
        uploadButton.id = "uploadButton-" + idInt;
        uploadButton.setAttribute("type", "button");
        uploadButton.innerHTML = "upload";

        uploadButton.addEventListener('click', function () {
            uploadFile(file, idInt);

            var selector = "#item-" + idInt;
            var parentItem = document.querySelector(selector);
            parentItem.remove();

            var uploadConfirm = document.querySelector('#uploadConfirm');
            if (uploadConfirm.children.length <= 1) {
                uploadConfirm.remove();
            }

            updateVault();
        } );

        descriptionFormText.appendChild(descriptionFormInput);
        descriptionForm.appendChild(descriptionFormText);
        descriptionForm.appendChild(removeButton);
        descriptionForm.appendChild(uploadButton);
        
        uploadConfirmItem.appendChild(imagePreview);
        uploadConfirmItem.appendChild(descriptionForm);

        uploadConfirm.appendChild(uploadConfirmItem);

        // Using FileReader to display the image content
        var reader = new FileReader();
        reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(imagePreview);
        reader.readAsDataURL(file);
    }

    function uploadFile(file, idInt) {
        var url = "/wad18/server/saveImage.php"
        var xhr = new XMLHttpRequest();
        var fd = new FormData();
        var description = document.querySelector("#textInput-" + idInt).value;

        if(description.length > 0 && description.length < 127){
            xhr.open("POST", url, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    // Every thing ok, file uploaded
                    console.log(xhr.responseText); // handle response.
                }
            };
            fd.append('uploaded_file', file);
            fd.append('description', description.toString());
            xhr.send(fd);
        }
        else{
            alert("Please input a valid description");
        } 
    }

    function updateVault() {
        var radioForm = document.querySelector('#radioPictures');
        radioForm.remove();
        radioForm = document.createElement("form");
        radioForm.id = "radioPictures";
        document.querySelector('#vault').appendChild(radioForm);

        $.ajax( {
            url: "/wad18/server/updateVault.php",
            type: "GET",
            dataType: "json",
            success: function ( json ) {
                console.log( "AJAX request success" );
                var target = document.querySelector("#radioPictures");
                var i = 0;
                json.forEach(row => {
                    var radio = document.createElement("input");
                    radio.id = "radio-" + i;
                    radio.setAttribute("type",  "radio");
                    radio.setAttribute("name",  "pictureSelect");
                    radio.setAttribute("onClick",  "updateShowroom(\"" + row['file'] + "\")");

                    var label = document.createElement("label");
                    label.setAttribute("for",  "radio-" + i);
                    label.innerHTML = row['name'];

                    var br = document.createElement("br");

                    target.appendChild(radio);
                    target.appendChild(label);
                    target.appendChild(br);


                    i = i + 1;
                });
            },
            failure: function ( xhr, status ) {
                console.log( "AJAX request failed" );
            },
            complete: function( xhr, status ) {
                console.log( "AJAX request complete" );
            },
            cache: false
        
             } );
    }

    var uploadfiles = document.querySelector('#pictureFile');
    uploadfiles.addEventListener('change', function () {
        var files = this.files;

        //html for upload confirm popup
        var uploadConfirm = document.createElement("div");
        uploadConfirm.id = "uploadConfirm";

        var uploadConfirmTitle = document.createElement("h2");
        uploadConfirmTitle.innerHTML = "Enter descriptions for selected coffee shots";
        uploadConfirm.appendChild(uploadConfirmTitle);
        document.body.appendChild(uploadConfirm);
        
        for(var i=0; i<files.length; i++){
            uploadPreview(this.files[i], i);
        }

    }    , false);

    document.addEventListener('DOMContentLoaded', function() {
        updateVault();
    }, false);
})();

function updateShowroom(filepath) {
    var pictureView = document.querySelector('#pictureView');
    if(pictureView.children.length < 1){
        var pictureFrame = document.createElement("img");
        pictureFrame.id = "pictureFrame";
        pictureView.appendChild(pictureFrame);
    }

    var pictureFrame = document.querySelector("#pictureFrame");
    pictureFrame.setAttribute("src", filepath);
}