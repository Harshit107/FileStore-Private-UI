import "./UploadFileMain.css";
import Card from "./../UI/Card";
import "../UI/ButtonGlow";
import {  useState } from "react";
import { storage } from "./../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import FullpageLoading from "../UI/FullpageLoading";

const UploadFileMain = (props) => {
  const uploadFileMainMainClassName = `upload-file-main__main ${props.className}`;
  const [fileToUpload, setFileToUpload] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [downloadURL, setDownloadURL] = useState(null);

  const handleFileUpload = async () => {
    if (fileToUpload == null) return;

    setIsUploading(true)
    const storageRef = ref(storage, `files/${fileToUpload.name + uuidv4()}`);
    const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        let progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress.toFixed(1));
      },
      (error) => {
        console.error("Upload error:", error);
        handleUploadFailed(error)
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        handleUploadComplete(downloadURL)
      }
    );
  };

  const handleUploadComplete = (downloadURL) => {
    setDownloadURL(downloadURL);
    setUploadProgress(null);
    setUploadComplete(true);
    setFileToUpload(null);
    setIsUploading(false);
  };

  const handleUploadFailed = (error) => {
     setUploadProgress(null);
     setUploadComplete(false);
     setIsUploading(false);
     setFileToUpload(null);
  };

  return (
    <div className={uploadFileMainMainClassName}>
      {isUploading && (
        <FullpageLoading
          messageToDisplay={`Uploading is ${uploadProgress}% done`}
        />
      )}
      <Card className={`upload-file-main__container`}>
        <input
          type="file"
          className="upload-btn"
          name="Upload file"
          id="file"
          onChange={(event) => {
            setFileToUpload(event.target.files[0]);
          }}
        ></input>
        <label htmlFor="file" className="file-label glow-on-hover">
          {fileToUpload == null ? `Choose File` : fileToUpload.name}
        </label>
        {!fileToUpload && <p>Supported file types: PNG, JPG, PDF, WORD</p>}
        {fileToUpload && <button onClick={handleFileUpload} className="fileupload-buttton">Upload</button>}
        {uploadProgress && <p>Progress: {uploadProgress}%</p>}
        {uploadComplete && (
          <div>
            <p>Upload complete!</p>
            {downloadURL && (
              <a href={downloadURL} target="_blank" rel="noopener noreferrer">
                Download File
              </a>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default UploadFileMain;
