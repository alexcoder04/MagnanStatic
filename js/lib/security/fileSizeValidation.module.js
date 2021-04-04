import setupModal from "../modal.module.js";

export default function checkFileSize(inputEl, maxSize=(1024 * 1024 * 50)){
    let totalSize = 0;
    Array.from(inputEl.files).forEach(file => {
        totalSize += file.size;
    });
    if (totalSize > maxSize){
        setupModal({
            title: "File size is too big!",
            text: `The files you try to upload are too big! There is a limit of ${maxSize} bytes (${maxSize / (1024 * 1024)} megabytes).`
        });
        inputEl.value = null;
    }
}
