let globalDataToSignature;

document.getElementById('sig_button').addEventListener('click', function() {
    let file = document.getElementById('input_file').files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function () {
        globalDataToSignature = reader.result;
        // signatureRSA(reader.result);
        signatureElgamal(reader.result);
    }
});