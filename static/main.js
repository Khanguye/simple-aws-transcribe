
const fileElm = document.getElementById("audio-input");
const statusElm = document.getElementById('status');

window.onload = () => {
    fileElm.addEventListener('change', () => {
        const files = document.getElementById('audio-input').files;
        const file = files[0];
        if(file == null){
            return alert('No file selected.');
        }
        getSignedRequest(file);
    });
};

function getSignedRequest(file){
    fetch(`/get-signed-url?file-name=${file.name}&file-type=${file.type}`)
    .then(response => response.json()).then(data => {
        uploadFile(file, data.signedRequest);
    })
    .catch((error) => alert('Could not get signed URL.') );
}

function uploadFile(file, signedRequest){
    statusElm.innerText = 'Uploading file...';
    const options = {method: 'PUT',body: file,referrerPolicy:'origin-when-cross-origin'};
    fetch(signedRequest,options)
    .then(response => statusElm.innerText = 'File Upload Success.')
    .catch((error)=> statusElm.innerText = 'Could not upload file.');
}