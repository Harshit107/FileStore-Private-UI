import "./UploadFileMain.css";
import Card from "./../UI/Card";
import "../UI/ButtonGlow";
import { useState } from "react";
import { storage } from "./../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const UploadFileMain = (props) => {
  const uploadFileMainMainClassName = `upload-file-main__main ${props.className}`;
  const [fileToUpload, setFileToUpload] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [downloadURL, setDownloadURL] = useState(null);

  const handleFileUpload = async () => {
    if (fileToUpload == null) return;

    const storageRef = ref(storage, `files/${fileToUpload.name + uuidv4()}`);
    const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload error:", error);
        setUploadProgress(0);
        setUploadComplete(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setDownloadURL(downloadURL);
        setUploadProgress(0);
        setUploadComplete(true);
      }
    );
  };

  return (
    <div className={uploadFileMainMainClassName}>
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
          Upload file
        </label>
        <p>Supported file types: PNG, JPG, PDF, WORD</p>
        <button onClick={handleFileUpload}>Upload</button>
        {uploadProgress > 0 && <p>Progress: {uploadProgress.toFixed(2)}%</p>}
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
